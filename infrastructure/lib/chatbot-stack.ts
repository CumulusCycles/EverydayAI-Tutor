import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2'
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { Construct } from 'constructs'

export class ChatbotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Lambda execution role with Bedrock and S3 permissions
    const lambdaRole = new iam.Role(this, 'ChatbotLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    })

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'BedrockRetrieve',
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:RetrieveAndGenerate', 'bedrock:Retrieve'],
        resources: ['*'],
      }),
    )

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'BedrockInvokeModel',
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:InvokeModel'],
        resources: [
          'arn:aws:bedrock:*::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0',
          `arn:aws:bedrock:us-east-1:${cdk.Stack.of(this).account}:inference-profile/global.anthropic.claude-sonnet-4-20250514-v1:0`,
        ],
      }),
    )

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'BedrockGetInferenceProfile',
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:GetInferenceProfile'],
        resources: [
          `arn:aws:bedrock:us-east-1:${cdk.Stack.of(this).account}:inference-profile/global.anthropic.claude-sonnet-4-20250514-v1:0`,
        ],
      }),
    )

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'KBBucketRead',
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        resources: [
          `arn:aws:s3:::${process.env.KB_BUCKET_NAME}`,
          `arn:aws:s3:::${process.env.KB_BUCKET_NAME}/*`,
        ],
      }),
    )

    // Lambda function — chatbot handler
    const chatbotFn = new lambda.Function(this, 'ChatbotFunction', {
      runtime: lambda.Runtime.PYTHON_3_13,
      code: lambda.Code.fromAsset('../chatbot/lambda'),
      handler: 'handler.handler',
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      environment: {
        KB_ID: process.env.KB_ID ?? '',
        KB_BUCKET_NAME: process.env.KB_BUCKET_NAME ?? '',
        BEDROCK_REGION: process.env.BEDROCK_REGION ?? 'us-east-1',
      },
    })

    // HTTP API with CORS
    const httpApi = new apigatewayv2.HttpApi(this, 'ChatbotApi', {
      corsPreflight: {
        allowOrigins: ['https://aieverydaytutor.com', 'https://www.aieverydaytutor.com'],
        allowMethods: [apigatewayv2.CorsHttpMethod.POST],
        allowHeaders: ['Content-Type'],
      },
    })

    // POST /chat → Lambda integration
    httpApi.addRoutes({
      path: '/chat',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration('ChatbotIntegration', chatbotFn),
    })

    new cdk.CfnOutput(this, 'ChatApiUrl', {
      value: httpApi.apiEndpoint,
      description: 'Chatbot API endpoint URL',
    })
  }
}
