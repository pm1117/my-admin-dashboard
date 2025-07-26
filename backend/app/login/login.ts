import * as crypto from 'crypto';
import {
    Code,
    errorResponse,
    Errors,
    handleErrorDynamoDb,
    validateInput,
} from '/opt/nodejs/utils/handle-error';
import { z } from 'zod';
import { APIGatewayProxyEvent } from 'aws-lambda';
import {
    CognitoIdentityProvider,
    AdminSetUserPasswordCommand,
    type ChallengeNameType,
    type AuthenticationResultType,
    InitiateAuthCommand,
    RespondToAuthChallengeCommand,
    InitiateAuthCommandOutput,
    NotAuthorizedException,
} from '@aws-sdk/client-cognito-identity-provider';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { get } from 'http';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { handleError } from '/opt/nodejs/utils/error';

const awsRegion = process.env.AWS_REGION || 'ap-northeast-1';
const cognitoUserPoolId = process.env.COGNITO_USER_POOL_ID || '';
const cognitoUserPoolClientId = process.env.COGNITO_USER_POOL_CLIENT_ID || '';
const cognitoUserPoolClientSecretName = process.env.COGNITO_USER_POOL_CLIENT_SECRET_NAME || '';
const version = process.env.VERSION || '1.0.0';
const userTableName = process.env.USER_TABLE_NAME || '';

const cognito = new CognitoIdentityProvider();
const secretsManager = new SecretsManagerClient();
const dynamoDB = new DynamoDBClient({ region: awsRegion });
const documentClient = DynamoDBDocumentClient.from(dynamoDB);

const loginInputSchema = z.object({
    userName: z.string(),
    password: z.string(),
});

export const main = async (event: APIGatewayProxyEvent) => {
    const input = loginInputSchema.safeParse(JSON.parse(event.body || '{}'));
    if (!input.success) {
        return errorResponse(400, Code.VAL_VALIDATION_FAILED, validateInput(input.error));
    }

    let user = null;
    try {
        user = await getUser(cognito, documentClient, input.data.userName);
        if (!user) {
            const ErrorCode = Code.AUTH_FORBIDDEN;
            return errorResponse(Errors[ErrorCode].HttpStatus, ErrorCode, []);
        }
    } catch (error) {
        const ErrorCode = Code.AUTH_FORBIDDEN;
        return errorResponse(Errors[ErrorCode].HttpStatus, ErrorCode, []);
    }

    if (user.status === 'FORCE_CHANGE_PASSWORD') {
        const lastChangePassword = user.lastChangePassword || user.createdAt;
        if (lastChangePassword && isExpired(lastChangePassword.toString())) {
            const errorCode = Code.AUTH_TEMPORARY_PASSWORD_EXPIRED;
            return errorResponse(Errors[errorCode].HttpStatus, errorCode, [
                {
                    field: 'password',
                    errorCode: errorCode,
                    message: Errors[errorCode].Message,
                },
            ]);
        }
    }

    let failedAttempts = user.failedAttempts || 0;
    if (failedAttempts >= 5) {
        return errorResponse(401, Code.AUTH_LOCKED, []);
    }

    try {
        const secretHash = await generateCognitoClientSecretHash(input.data.userName);
        if (!secretHash) {
            return errorResponse(500, Code.SYS_INTERNAL_ERROR, []);
        }

        const res = await initiateAuth(input.data.userName, input.data.password, secretHash);
        failedAttempts = 0;
        if (res.AuthenticationResult) {
            return await handleAuthenticationSuccess(res.AuthenticationResult, input.data?.userName);
        }

        if (res.ChallengeName) {
            return await handleAuthChallenge(res, input, secretHash);
        }

        return errorResponse(500, Code.SYS_INTERNAL_ERROR, []);
    } catch (error) {
        if (error instanceof NotAuthorizedException) {
            failedAttempts++;
            if (failedAttempts >= 5) {
                return errorResponse(401, Code.AUTH_LOCKED, []);
            }
            if (failedAttempts >= 3) {
                return errorResponse(403, Code.AUTH_INVALID_CREDENTIALS_MULTIPLE_TIMES, []);
            }
            return errorResponse(401, Code.AUTH_INVALID_CREDENTIALS, []);
        }
        return handleError(error);
    } finally {
        await updateDynamoDBUser(user, failedAttempts);
    }
};

async function initiateAuth(userName: string, password: string, secretHash: string) {
    return await cognito.send(
        new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: cognitoUserPoolClientId,
            AuthParameters: {
                USERNAME: userName,
                PASSWORD: password,
                SECRET_HASH: secretHash,
            },
        })
    );
}

async function handleAuthenticationSuccess(
    authResult: AuthenticationResultType,
    userName: string
) {
    const AuthenticationResult = toAuthenticationResultModel(authResult);
    const user = await getUser(cognito, documentClient, userName);
    const userConsents = await getUserConsentByUserId(documentClient, userName);

    return {
        statusCode: 200,
        body: JSON.stringify({
            AuthenticationResult,
            user: {
                ...user,
                consents: userConsents,
            },
        }),
    };
}

async function handleAuthChallenge(
    res: InitiateAuthCommandOutput,
    input: z.SafeParseReturnType<typeof loginInputSchema, { userName: string; password: string }>,
    secretHash: string
) {
    if (!input.data) {
        return null;
    }
    const authResult = await respondToChallenge(
        res.ChallengeName as ChallengeNameType,
        res.Session as string,
        input.data.userName,
        input.data.password,
        secretHash
    );

    if (!authResult || !authResult.AccessToken) {
        return errorResponse(500, Code.SYS_INTERNAL_ERROR, []);
    }

    await updateUserStatus(input.data.userName, input.data.password);
    const user = await getUser(cognito, documentClient, input.data.userName);
    const userConsents = await getUserConsentByUserId(documentClient, input.data.userName);

    return {
        statusCode: 200,
        body: JSON.stringify({
            AuthenticationResult: toAuthenticationResultModel(authResult),
            user: {
                ...user,
                consents: userConsents,
            },
        }),
    }
}

async function respondToChallenge(
    challengeName: ChallengeNameType,
    session: string,
    userName: string,
    password: string,
    secretHash: string
): Promise<AuthenticationResultType | undefined> {
    const command = new RespondToAuthChallengeCommand({
        ClientId: cognitoUserPoolClientId,
        ChallengeName: challengeName,
        ChallengeResponses: {
            USERNAME: userName,
            NEW_PASSWORD: password,
            SECRET_HASH: secretHash,
        },
        Session: session,
    });
    const res = await cognito.send(command);
    return res.AuthenticationResult;
}

async function updateUserStatus(userName: string, password: string): Promise<void> {
    await cognito.send(
        new AdminSetUserPasswordCommand({
            UserPoolId: cognitoUserPoolId,
            Username: userName,
            Password: password,
            Permanent: false,
        })
    );
}

async function generateCognitoClientSecretHash(userName: string): Promise<string | null> {
    const secret = await secretsManager.send(
        new GetSecretValueCommand({
            SecretId: cognitoUserPoolClientSecretName || '',
        })
    );
    if (!secret.SecretString) {
        return null;
    }

    return crypto
        .createHmac('SHA256', secret.SecretString)
        .update(userName + cognitoUserPoolClientId)
        .digest('base64');
}

async function updateDynamoDBUser(user: User, failedAttempts: number) {
    const dynamoDBUserAttributes = prepareDynamoDBUserAttributes(failedAttempts);

    const updateExpressions = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(dynamoDBUserAttributes)) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
    }

    const updateExpression = `SET ${updateExpressions.join(', ')}`;

    await documentClient.send(
        new UpdateCommand({
            TableName: userTableName,
            Key: {
                userId: user.userId,
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
        })
    );
}

function prepareDynamoDBUserAttributes(failedAttempts: number) {
    const userAttributes: Record<string, unknown> = {};
    userAttributes.failedAttempts = failedAttempts;
    userAttributes.lastFailedLogin = new Date().toISOString();
    userAttributes.updatedAt = new Date().toISOString();
    return userAttributes;
}

function isExpired(lastChangePassword: string): boolean {
    const expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 days
    const lastChangeDate = new Date(lastChangePassword);
    const currentDate = new Date();
    return currentDate.getTime() - lastChangeDate.getTime() > expirationTime;
}
