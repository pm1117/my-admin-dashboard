import { APIGatewayProxyEvent } from 'aws-lambda';
import { Code, Errors, errorResponse, validateInput } from '/opt/nodejs/utils/handle-error';
import { z } from 'zod';

const pathSchema = z.object({
    companyId: z.string().superRefine((val, ctx) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(val)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid UUID format',
            });
        }
    })
});
const main = async (
    event: APIGatewayProxyEvent,
) => {
    const authorizerClaims = event.requestContext.authorizer?.claims;

    const companyId = authorizerClaims?.['custom:companyId'] || '';
    if (!companyId) {
        const ErrorCode = Code.AUTH_UNAUTHORIZED;
        return errorResponse(Errors[ErrorCode].HttpStatus, ErrorCode, []);
    }

    const pathParameters = pathSchema.safeParse(event.pathParameters);
    if (!pathParameters.success) {
        const ErrorCode = Code.VAL_VALIDATION_FAILED;
        return errorResponse(Errors[ErrorCode].HttpStatus, ErrorCode, validateInput(pathParameters.error));
    }
}

export const handler = logMiddleware(main);