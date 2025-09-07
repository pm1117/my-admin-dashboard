import { UserType } from "@aws-sdk/client-cognito-identity-provider";

type Merge<T> = {
    [K in keyof T]: T[K];
}
export type User = Merge<CognitoUser & DynamoDBUser>;

export type DynamoDBUser = {
    companyId: string;
    userId: string;
    role?: string;
    job?: string;
    department?: string;
    productNames?: string[];
    familyName?: string;
    givenName?: string;
    phoneNumber?: string;
    failedAttempts?: number;
    lastFailedAttempt?: string;
    lastChangePassword?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
}

export type CognitoUser = {
    userId: string;
    companyId: string;
    enabled: boolean;
    status: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const toCognitoUser = (user: UserType): CognitoUser => {
    return {
        userId: user.Username ?? "",
        companyId: "",
        enabled: !!user.Enabled,
        status: user.UserStatus ?? "",
        email: user.Attributes?.find(attr => attr.Name === "email")?.Value,
        createdAt: user.UserCreateDate,
        updatedAt: user.UserLastModifiedDate,
    }
} 