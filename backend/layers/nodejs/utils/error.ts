import {
  CognitoIdentityProviderServiceException,
  NotAuthorizedException,
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';
import { Code, errorResponse, handleErrorDynamoDb } from './handle-error';

export function handleError(error: unknown) {
  if (error instanceof DynamoDBServiceException) {
    return handleErrorDynamoDb(error);
  }

  if (error instanceof NotAuthorizedException) {
    return errorResponse(401, Code.AUTH_INVALID_CREDENTIALS, []);
  }

  if (error instanceof CognitoIdentityProviderServiceException) {
    return {
      statusCode: error.$metadata.httpStatusCode || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
}
