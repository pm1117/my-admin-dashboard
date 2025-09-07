import { DynamoDBServiceException } from "@aws-sdk/client-dynamodb/dist-types";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { handleErrorDynamoDb, handleSysInternalError } from "./handle-error";

const hiddenData = (event: APIGatewayProxyEvent) => {
    const data = JSON.parse(event.body ?? '{}');
    const sensitiveKeys = new Set(["password", "newPassword", "confirmPassword", "secretHash"]);

    const maskValues = (obj: any): any => {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (sensitiveKeys.has(key)) {
                    obj[key] = "*******";
                } else {
                    obj[key] = maskValues(obj[key]);
                }
            }
        }
        return obj;
    }
    return JSON.stringify(maskValues(data));
}

export const logMiddleware = (handler: (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>) => {
    return async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
        const requestId = context.awsRequestId;
        console.info("Request:", {
            requestId,
            request: {
                body: hiddenData(event),
            },
        });

        try {
            const response = await handler(event, context);

            console.info("Lambda Response:", { requestId, response });
            return response;
        } catch (error) {
            console.error("Error:", { requestId, error });

            if (error instanceof DynamoDBServiceException) {
                return handleErrorDynamoDb(error);
            }

            return handleSysInternalError();
        }
    }
}