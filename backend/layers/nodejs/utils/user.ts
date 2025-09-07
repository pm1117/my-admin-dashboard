import { AdminGetUserCommand, CognitoIdentityProvider, CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider/dist-types";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb/dist-types";
import { DynamoDBUser, toCognitoUser, User } from "../models/user";

const userTableName = process.env.USER_TABLE_NAME || '';
const cognitoUserPoolId = process.env.COGNITO_USER_POOL_ID || '';

export async function getUser(
    provider: CognitoIdentityProviderClient,
    client: DynamoDBDocumentClient,
    userName: string
): Promise<User> {
    const cognitoUser = await getCognitoUser(provider, userName);
    const dynamoDBUser = await getDynamoDBUser(client, cognitoUser.userId);
    return {
        ...cognitoUser,
        ...dynamoDBUser,
    };
}

async function getCognitoUser(
    provider: CognitoIdentityProviderClient,
    userName: string
): Promise<User> {
    const getUserCommand = new AdminGetUserCommand({
        UserPoolId: cognitoUserPoolId,
        Username: userName,
    });
    const getUserRes = await provider.send(getUserCommand);
    return toCognitoUser({
        ...getUserRes,
        Attributes: getUserRes.UserAttributes || [],
    })
}

export async function getDynamoDBUser(
    client: DynamoDBDocumentClient,
    userId: string
): Promise<DynamoDBUser> {
    const res = await client.send(
        new QueryCommand({
            TableName: userTableName,
            IndexName: 'userId-index',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
            KeyConditionExpression: 'userId = :userId',
        })
    )
    return res.Items?.[0] as DynamoDBUser;
}

export async function isEmailUsed(
    provider: CognitoIdentityProvider,
    email: string
): Promise<boolean> {
    const res = await provider.send(
        new ListUsersCommand({
            UserPoolId: cognitoUserPoolId,
            Filter: `email = "${email}"`,
        })
    )
    return res.Users?.length !== 0;
}

export const generateNumberPassword = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}