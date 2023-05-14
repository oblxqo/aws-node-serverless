import { APIGatewayAuthorizerResult } from 'aws-lambda';

export const generatePolicy = (principalId, resource, effect = 'Deny'): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  };
};
