import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as bedrock from 'aws-cdk-lib/aws-bedrock'
import * as s3vectors from 'aws-cdk-lib/aws-s3vectors'
import { Construct } from 'constructs'

const DOMAIN = 'aieverydaytutor.com'
const WWW_DOMAIN = `www.${DOMAIN}`
const GITHUB_ORG_REPO = 'CumulusCycles/EverydayAI-Tutor'
const GITHUB_BRANCH = 'main'

export class EverydayAiTutorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: DOMAIN,
    })

    // ACM certificate — must be in us-east-1 for CloudFront
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: DOMAIN,
      subjectAlternativeNames: [WWW_DOMAIN],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    })

    // Private S3 bucket — no public access
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
    })

    // CloudFront distribution with OAC
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      domainNames: [DOMAIN, WWW_DOMAIN],
      certificate,
      defaultRootObject: 'index.html',
      // React Router: redirect 403/404 → index.html
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    })

    // DNS: apex → CloudFront
    new route53.ARecord(this, 'ApexRecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
    })

    // DNS: www → CloudFront (CloudFront handles the redirect)
    new route53.CnameRecord(this, 'WwwRecord', {
      zone: hostedZone,
      recordName: 'www',
      domainName: distribution.distributionDomainName,
    })

    // GitHub Actions OIDC provider (native CloudFormation — no Lambda custom resource)
    const githubOidcProvider = new iam.OidcProviderNative(this, 'GitHubOidcProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    })

    // Scoped to CumulusCycles/EverydayAI-Tutor, main branch only
    const deployRole = new iam.Role(this, 'GitHubActionsDeployRole', {
      roleName: 'GitHubActionsDeployRole',
      assumedBy: new iam.WebIdentityPrincipal(githubOidcProvider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          'token.actions.githubusercontent.com:sub': `repo:${GITHUB_ORG_REPO}:ref:refs/heads/${GITHUB_BRANCH}`,
        },
      }),
    })

    // Grants permission to assume CDK bootstrap roles only (docs/tech/iam-policy.json)
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'AssumeCDKRoles',
        effect: iam.Effect.ALLOW,
        actions: ['sts:AssumeRole', 'iam:PassRole'],
        resources: [
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-lookup-role-${this.account}-us-east-1`,
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-deploy-role-${this.account}-us-east-1`,
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-file-publishing-role-${this.account}-us-east-1`,
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-image-publishing-role-${this.account}-us-east-1`,
        ],
      }),
    )

    // Grants permissions needed by the frontend deploy job
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'FrontendDeploy',
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudformation:DescribeStacks',
          's3:PutObject',
          's3:GetObject',
          's3:DeleteObject',
          's3:ListBucket',
          's3:ListBucketMultipartUploads',
          's3:AbortMultipartUpload',
          'cloudfront:CreateInvalidation',
          'cloudfront:GetInvalidation',
        ],
        resources: ['*'],
      }),
    )

    // ── Bedrock Knowledge Base ────────────────────────────────────────────────

    // Private S3 bucket for Knowledge Base content
    const kbBucket = new s3.Bucket(this, 'KnowledgeBaseBucket', {
      bucketName: 'aieverydaytutor-knowledge-base',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
    })

    // S3 vector bucket for storing embeddings
    const vectorBucket = new s3vectors.CfnVectorBucket(this, 'KnowledgeBaseVectorBucket', {
      vectorBucketName: 'aieverydaytutor-vector-store',
    })

    // Vector index — Titan Text Embeddings v2 produces 1024-dim float32 vectors
    const KB_INDEX_NAME = 'aieverydaytutor-kb-index'
    const vectorIndex = new s3vectors.CfnIndex(this, 'KnowledgeBaseVectorIndex', {
      vectorBucketArn: vectorBucket.attrVectorBucketArn,
      indexName: KB_INDEX_NAME,
      dataType: 'float32',
      dimension: 1024,
      distanceMetric: 'cosine',
    })

    // IAM role that Bedrock assumes to read the KB bucket, invoke embeddings, and read/write vectors
    const kbRole = new iam.Role(this, 'KnowledgeBaseRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com', {
        conditions: {
          StringEquals: { 'aws:SourceAccount': this.account },
          ArnLike: {
            'aws:SourceArn': `arn:aws:bedrock:${this.region}:${this.account}:knowledge-base/*`,
          },
        },
      }),
    })

    kbRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject', 's3:ListBucket', 's3:GetBucketLocation'],
        resources: [kbBucket.bucketArn, `${kbBucket.bucketArn}/*`],
      }),
    )

    kbRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:InvokeModel'],
        resources: [
          `arn:aws:bedrock:${this.region}::foundation-model/amazon.titan-embed-text-v2:0`,
        ],
      }),
    )

    kbRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          's3vectors:GetIndex',
          's3vectors:GetVectors',
          's3vectors:PutVectors',
          's3vectors:QueryVectors',
          's3vectors:DeleteVectors',
        ],
        resources: [vectorBucket.attrVectorBucketArn, vectorIndex.attrIndexArn],
      }),
    )

    // Knowledge Base — Titan Text Embeddings v2, explicit S3 Vectors storage
    const knowledgeBase = new bedrock.CfnKnowledgeBase(this, 'KnowledgeBase', {
      name: 'aieverydaytutor-knowledge-base',
      roleArn: kbRole.roleArn,
      knowledgeBaseConfiguration: {
        type: 'VECTOR',
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn: `arn:aws:bedrock:${this.region}::foundation-model/amazon.titan-embed-text-v2:0`,
        },
      },
      storageConfiguration: {
        type: 'S3_VECTORS',
        s3VectorsConfiguration: {
          vectorBucketArn: vectorBucket.attrVectorBucketArn,
          indexArn: vectorIndex.attrIndexArn,
          indexName: KB_INDEX_NAME,
        },
      },
    })

    // Data source — KB S3 bucket
    const dataSource = new bedrock.CfnDataSource(this, 'KnowledgeBaseDataSource', {
      knowledgeBaseId: knowledgeBase.attrKnowledgeBaseId,
      name: 'aieverydaytutor-knowledge-base-datasource',
      dataSourceConfiguration: {
        type: 'S3',
        s3Configuration: {
          bucketArn: kbBucket.bucketArn,
        },
      },
    })

    // Allow GitHub Actions deploy role to sync KB content and trigger ingestion
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'KnowledgeBaseSync',
        effect: iam.Effect.ALLOW,
        actions: ['s3:PutObject', 's3:DeleteObject', 's3:ListBucket'],
        resources: [kbBucket.bucketArn, `${kbBucket.bucketArn}/*`],
      }),
    )

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'BedrockIngestion',
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:StartIngestionJob', 'bedrock:GetIngestionJob'],
        resources: ['*'],
      }),
    )

    // ── Outputs ───────────────────────────────────────────────────────────────

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    })

    new cdk.CfnOutput(this, 'DistributionDomain', {
      value: distribution.distributionDomainName,
    })

    new cdk.CfnOutput(this, 'BucketName', {
      value: siteBucket.bucketName,
    })

    new cdk.CfnOutput(this, 'GitHubActionsDeployRoleArn', {
      value: deployRole.roleArn,
    })

    new cdk.CfnOutput(this, 'KBBucketName', {
      value: kbBucket.bucketName,
    })

    new cdk.CfnOutput(this, 'KnowledgeBaseId', {
      value: knowledgeBase.attrKnowledgeBaseId,
    })

    new cdk.CfnOutput(this, 'DataSourceId', {
      value: dataSource.attrDataSourceId,
    })
  }
}
