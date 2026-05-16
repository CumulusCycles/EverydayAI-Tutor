AIEverydayTutor.com was built entirely using Claude Code — Anthropic's agentic AI coding tool. No human developer wrote a single line of code directly. Every component, every page, every configuration file, and the entire cloud infrastructure was produced through conversations with Claude Code.

Claude Code is not a code suggestion tool. It is an agentic system that reads your codebase, understands the context, writes code, runs checks, and opens pull requests for review. You describe what you want in plain language, and Claude Code acts on it.

The tech stack that Claude Code built for this site includes: React, Vite, and TypeScript for the frontend; Tailwind CSS v4 for styling; React Router for client-side navigation; Vitest and Playwright for unit and end-to-end testing; AWS CDK written in TypeScript for infrastructure as code; AWS S3 and CloudFront for hosting and content delivery; AWS ACM and Route 53 for SSL and DNS; GitHub Actions with OIDC authentication for a CI/CD pipeline that deploys automatically on every merge to main with no stored AWS credentials; AWS Lambda (Python) and API Gateway for the chatbot backend; and AWS Bedrock Knowledge Base with S3 Vectors for RAG-powered semantic search.

The workflow used to build the site was: write a prompt describing what to build, Claude Code reads the codebase and writes the code, a pull request is opened for review, and when merged, the site is automatically deployed to AWS. Every feature followed this loop.

The full prompt log — every prompt used to build this site, documented session by session — is available in the GitHub repository alongside the source code.

The repository is open source and available at https://github.com/CumulusCycles/EverydayAI-Tutor.

This project also serves as the demo for an upcoming Claude Code tutorial series on the EverydayAI Tutor YouTube channel. The series will show how to build real projects with AI from scratch, step by step.

The site also includes a live AI-powered chatbot — look for the orange button in the bottom-right corner. It is powered by AWS Bedrock Knowledge Base and S3 Vectors, and allows visitors to ask plain English questions about the site, the YouTube channel, and the content available — and receive grounded, accurate answers. The chatbot uses RAG, which stands for Retrieval Augmented Generation. RAG means the AI's responses are anchored to actual site content rather than generated from general knowledge alone, which makes answers more accurate and relevant.

The chatbot backend is a Python Lambda function behind AWS API Gateway, also built entirely by Claude Code. The entire development process — prompts, architecture decisions, and source code — is documented and open source, just like the rest of the site.
