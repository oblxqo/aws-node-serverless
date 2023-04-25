import type { AWS } from '@serverless/typescript';

import { importFileParser, importProductsFile } from '@functions/index';
import { s3ClientParams } from '@constants/s3-client-params';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    stage: 'dev',
    profile: 'dev-sandx-profile',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_URL: '${cf:product-service-dev.SQSQueue}'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket', 's3:PutObject', 's3:GetObject', 's3:DeleteObject'],
        Resource: [`arn:aws:s3:::${s3ClientParams.UPLOAD_BUCKET_NAME}/*`]
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: ['${cf:product-service-dev.SQSQueueArn}']
      }
    ]
  },
  // import the function via paths
  functions: { importFileParser, importProductsFile },
  resources: {
    Resources: {
      ImportFileBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: s3ClientParams.UPLOAD_BUCKET_NAME,
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['PUT'],
                AllowedOrigins: ['*'],
                MaxAge: 3600
              }
            ]
          }
        }
      }
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    }
  }
};

module.exports = serverlessConfiguration;
