import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import { parseAuthToken } from '../../helpers/parse-auth-token.helper';
import { AUTH_EFFECTS } from '@constants/auth-effects';
import { generatePolicy } from '../../helpers/generate-policy.helper';
import { MESSAGES } from '@constants/messages';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async event => {
  console.log('In basicAuthorizer >>> request: event ', event);

  const { authorizationToken, methodArn } = event;
  const basicAuthRegex = /^Basic ((?:\.?[A-Za-z0-9-_]+){3})$/gm;

  if (!authorizationToken.match(basicAuthRegex)) {
    throw new Error(MESSAGES.UNAUTHORIZED_AWS);
  }

  try {
    const { login, password } = parseAuthToken(authorizationToken);
    console.log('In basicAuthorizer >>> request: login ', login);

    const currentUserPassword = process.env[login];
    const policyEffect = !currentUserPassword || currentUserPassword !== password ? AUTH_EFFECTS.DENY : AUTH_EFFECTS.ALLOW;

    return generatePolicy(login, methodArn, policyEffect);
  } catch (error) {
    console.error('In basicAuthorizer >>> Error occurred: ', error);
  }
};

export const main = basicAuthorizer;
