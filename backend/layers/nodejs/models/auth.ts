import type { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";

export type AuthenticationResult = {
    idToken: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}

export const toAuthenticationResultModel = (
    data: AuthenticationResultType,
): AuthenticationResult => {
    return {
        idToken: data.IdToken ?? '',
        accessToken: data.AccessToken ?? '',
        refreshToken: data.RefreshToken ?? '',
        expiresIn: data.ExpiresIn ?? 0,
        tokenType: data.TokenType ?? '',
    }
}