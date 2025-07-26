'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.handleError = handleError;
const client_cognito_identity_provider_1 = require('@aws-sdk/client-cognito-identity-provider');
const client_dynamodb_1 = require('@aws-sdk/client-dynamodb');
const handle_error_1 = require('./handle-error');
function handleError(error) {
  if (error instanceof client_dynamodb_1.DynamoDBServiceException) {
    return (0, handle_error_1.handleErrorDynamoDb)(error);
  }
  if (error instanceof client_cognito_identity_provider_1.NotAuthorizedException) {
    return (0, handle_error_1.errorResponse)(401, handle_error_1.Code.AUTH_INVALID_CREDENTIALS, []);
  }
  if (error instanceof client_cognito_identity_provider_1.CognitoIdentityProviderServiceException) {
    return {
      statusCode: error.$metadata.httpStatusCode || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
}
