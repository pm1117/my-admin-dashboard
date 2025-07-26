import type { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { ZodError } from 'zod';

export interface ErrorDetail {
  field: string;
  message: string;
  errorCode: string;
}

export interface ErrorResponse {
  category: string;
  code: string;
  message: string;
  errorDetails?: ErrorDetail[];
}

export const Category = {
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  RESOURCE: 'RESOURCE',
  NETWORK: 'NETWORK',
  SYSTEM: 'SYSTEM',
  DATABASE: 'DATABASE',
  BUSINESS: 'BUSINESS',
};

export const Code = {
  VAL_VALIDATION_FAILED: 'VAL_VALIDATION_FAILED',
  VAL_DUPLICATE: 'VAL_DUPLICATE',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_LOCKED: 'AUTH_LOCKED',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_INVALID_CREDENTIALS_MULTIPLE_TIMES: 'AUTH_INVALID_CREDENTIALS_MULTIPLE_TIMES',
  AUTH_RESET_CODE_EXPIRED: 'AUTH_RESET_CODE_EXPIRED',
  AUTH_TEMPORARY_PASSWORD_EXPIRED: 'AUTH_TEMPORARY_PASSWORD_EXPIRED',
  RES_NOT_FOUND: 'RES_NOT_FOUND',
  RES_CONFLICT: 'RES_CONFLICT',
  RES_GONE: 'RES_GONE',
  RES_LOCKED: 'RES_LOCKED',
  NET_TIMEOUT: 'NET_TIMEOUT',
  NET_CONNECTION_FAIL: 'NET_CONNECTION_FAIL',
  NET_BAD_RESPONSE: 'NET_BAD_RESPONSE',
  NET_RATE_LIMIT: 'NET_RATE_LIMIT',
  SYS_INTERNAL_ERROR: 'SYS_INTERNAL_ERROR',
  SYS_DEPENDENCY_ERROR: 'SYS_DEPENDENCY_ERROR',
  SYS_CONFIG_ERROR: 'SYS_CONFIG_ERROR',
  SYS_RESOURCE_EXHAUSTED: 'SYS_RESOURCE_EXHAUSTED',
  SYS_UNKNOWN: 'SYS_UNKNOWN',
  DB_SYNTAX_ERROR: 'DB_SYNTAX_ERROR',
  DB_UNIQUE_ERROR: 'DB_UNIQUE_ERROR',
  DB_FOREIGN_ERROR: 'DB_FOREIGN_ERROR',
  DB_TRANSACTION_FAIL: 'DB_TRANSACTION_FAIL',
  DB_CONNECTION_BUSY: 'DB_CONNECTION_BUSY',
  BIZ_DOMAIN_RULE_VIOLATION: 'BIZ_DOMAIN_RULE_VIOLATION',
  BIZ_ILLEGAL_STATE: 'BIZ_ILLEGAL_STATE',
  BIZ_CONFLICT: 'BIZ_CONFLICT',
  BIZ_PAYMENT_REQUIRED: 'BIZ_PAYMENT_REQUIRED',
  BIZ_UNPAID_SUBSCRIPTION: 'BIZ_UNPAID_SUBSCRIPTION',
  BIZ_PLAN_EXPIRED: 'BIZ_PLAN_EXPIRED',
  BIZ_BILLING_ERROR: 'BIZ_BILLING_ERROR',
  // Add more business-specific error codes as needed
};

export const Errors = {
  [Code.VAL_VALIDATION_FAILED]: {
    Category: Category.VALIDATION,
    HttpStatus: 400,
    Description: 'Validatiion failed',
    Message: '入力欄に不備があります。',
  },
  [Code.VAL_DUPLICATE]: {
    Category: Category.VALIDATION,
    HttpStatus: 409,
    Description: 'Duplicate entry',
    Message: '入力された値はすでに存在します。',
  },
  [Code.AUTH_UNAUTHORIZED]: {
    Category: Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Unauthorized access',
    Message: '認証情報が見つかりません。',
  },
  [Code.AUTH_FORBIDDEN]: {
    Category: Category.AUTHENTICATION,
    HttpStatus: 403,
    Description: 'Forbidden access',
    Message: 'アクセスが禁止されています。',
  },
  [Code.AUTH_TOKEN_EXPIRED]: {
    Category: Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Token expired',
    Message: 'トークンの有効期限が切れています。',
  },
  [Code.AUTH_INVALID_TOKEN]: {
    Category: Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Invalid token',
    Message: '無効なトークンです。',
  },
  [Code.AUTH_LOCKED]: {
    Category: Category.AUTHENTICATION,
    HttpStatus: 403,
    Description: 'Account locked',
    Message: 'アカウントがロックされています。',
  },
  [Code.AUTH_INVALID_CREDENTIALS]: {
    Category: Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Invalid credentials',
    Message: 'ユーザー名またはパスワードが無効です。',
  },
  [Code.AUTH_INVALID_CREDENTIALS_MULTIPLE_TIMES]: {
    Category: Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Invalid credentials multiple times',
    Message: '複数回連続で無効な認証情報が入力されました。一定回数を超えるとロックします。',
  },
  [Code.AUTH_RESET_CODE_EXPIRED]: {
    Category: Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Reset code expired',
    Message:
      'パスワードリセットコードの有効期限が切れています。再度リセットをリクエストしてください。',
  },
  [Code.AUTH_TEMPORARY_PASSWORD_EXPIRED]: {
    Category: Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Temporary password expired',
    Message: '一時パスワードの有効期限が切れています。再度リセットをリクエストしてください。',
  },
  [Code.RES_NOT_FOUND]: {
    Category: Category.RESOURCE,
    HttpStatus: 404,
    Description: 'Resource not found',
    Message: 'リソースが見つかりません。',
  },
  [Code.RES_CONFLICT]: {
    Category: Category.RESOURCE,
    HttpStatus: 409,
    Description: 'Resource conflict',
    Message: 'リソースの状態が競合しています。',
  },
  [Code.RES_GONE]: {
    Category: Category.RESOURCE,
    HttpStatus: 410,
    Description: 'Resource gone',
    Message: 'リソースは削除されました。',
  },
  [Code.RES_LOCKED]: {
    Category: Category.RESOURCE,
    HttpStatus: 423,
    Description: 'Resource locked',
    Message: 'リソースがロックされています。',
  },
  [Code.NET_TIMEOUT]: {
    Category: Category.NETWORK,
    HttpStatus: 504,
    Description: 'Network timeout',
    Message: 'リクエストがタイムアウトしました。',
  },
  [Code.NET_CONNECTION_FAIL]: {
    Category: Category.NETWORK,
    HttpStatus: 503,
    Description: 'Network connection failed',
    Message: 'ネットワーク接続に失敗しました。',
  },
  [Code.NET_BAD_RESPONSE]: {
    Category: Category.NETWORK,
    HttpStatus: 502,
    Description: 'Bad network response',
    Message: 'ネットワークからの応答が不正です。',
  },
  [Code.NET_RATE_LIMIT]: {
    Category: Category.NETWORK,
    HttpStatus: 429,
    Description: 'Rate limit exceeded',
    Message: 'リクエストのレート制限を超えました。',
  },
  [Code.SYS_INTERNAL_ERROR]: {
    Category: Category.SYSTEM,
    HttpStatus: 500,
    Description: 'Internal server error',
    Message: '予期しないサーバーエラーが発生しました。',
  },
  [Code.SYS_DEPENDENCY_ERROR]: {
    Category: Category.SYSTEM,
    HttpStatus: 500,
    Description: 'Service unavailable',
    Message: '依存サービスが利用できません。',
  },
  [Code.SYS_CONFIG_ERROR]: {
    Category: Category.SYSTEM,
    HttpStatus: 500,
    Description: 'Configuration error',
    Message: 'サーバーの設定に問題があります。',
  },
  [Code.SYS_RESOURCE_EXHAUSTED]: {
    Category: Category.SYSTEM,
    HttpStatus: 500,
    Description: 'Resource exhausted',
    Message: 'サーバーのリソースが不足しています。',
  },
  [Code.SYS_UNKNOWN]: {
    Category: Category.SYSTEM,
    HttpStatus: 500,
    Description: 'Unknown error',
    Message: '不明なエラーが発生しました。',
  },
  [Code.DB_SYNTAX_ERROR]: {
    Category: Category.DATABASE,
    HttpStatus: 500,
    Description: 'Database syntax error',
    Message: 'データベースのクエリに構文エラーがあります。',
  },
  [Code.DB_UNIQUE_ERROR]: {
    Category: Category.DATABASE,
    HttpStatus: 409,
    Description: 'Database unique constraint violation',
    Message: 'データベースの一意制約に違反しています。',
  },
  [Code.DB_FOREIGN_ERROR]: {
    Category: Category.DATABASE,
    HttpStatus: 409,
    Description: 'Database foreign key constraint violation',
    Message: 'データベースの外部キー制約に違反しています。',
  },
  [Code.DB_TRANSACTION_FAIL]: {
    Category: Category.DATABASE,
    HttpStatus: 500,
    Description: 'Database transaction failed',
    Message: 'データベースのトランザクションに失敗しました。',
  },
  [Code.DB_CONNECTION_BUSY]: {
    Category: Category.DATABASE,
    HttpStatus: 503,
    Description: 'Database connection busy',
    Message: 'データベースへの接続数が上限に達しています。',
  },
  [Code.BIZ_DOMAIN_RULE_VIOLATION]: {
    Category: Category.BUSINESS,
    HttpStatus: 400,
    Description: 'Business domain rule violation',
    Message: 'ビジネスドメインのルールに違反しています。',
  },
  [Code.BIZ_ILLEGAL_STATE]: {
    Category: Category.BUSINESS,
    HttpStatus: 400,
    Description: 'Illegal business state',
    Message: '現在の状態ではこの操作を行うことができません。',
  },
  [Code.BIZ_CONFLICT]: {
    Category: Category.BUSINESS,
    HttpStatus: 409,
    Description: 'Business conflict',
    Message: 'ビジネスロジックの矛盾が発生しています。',
  },
  [Code.BIZ_PAYMENT_REQUIRED]: {
    Category: Category.BUSINESS,
    HttpStatus: 403,
    Description: 'Payment required',
    Message: 'この操作を行うには有料プランへの加入が必要です。',
  },
  [Code.BIZ_UNPAID_SUBSCRIPTION]: {
    Category: Category.BUSINESS,
    HttpStatus: 403,
    Description: 'Unpaid subscription',
    Message: 'サブスクリプションの支払いが未完了です。',
  },
  [Code.BIZ_PLAN_EXPIRED]: {
    Category: Category.BUSINESS,
    HttpStatus: 403,
    Description: 'Plan expired',
    Message: '現在のプランの有効期限が切れています。',
  },
  [Code.BIZ_BILLING_ERROR]: {
    Category: Category.BUSINESS,
    HttpStatus: 500,
    Description: 'Billing error',
    Message: '請求処理中にエラーが発生しました。時間をおいて再試行してください。',
  },
  // Add more business-specific error codes as needed
};

export const ErrorCode = {
  VLD_OUT_OF_RANGE: 'VLD_OUT_OF_RANGE',
  VLD_REQUIRED: 'VLD_REQUIRED',
  VLD_INVALID_FORMAT: 'VLD_INVALID_FORMAT',
  VLD_UNKNOWN_ENUM: 'VLD_UNKNOWN_ENUM',
  VLD_PASSWORD_SAME_AS_OLD: 'VLD_PASSWORD_SAME_AS_OLD',
};

interface TransactionCanceledException extends DynamoDBServiceException {
  CancellationReasons?: {
    Code: string;
    Message?: string;
  }[];
}

export const handleErrorDynamoDb = (error: DynamoDBServiceException): APIGatewayProxyResult => {
  let code = Code.DB_CONNECTION_BUSY;

  switch (error.name) {
    case 'ValidationException':
      code = Code.DB_SYNTAX_ERROR;
      break;
    case 'ConditionalCheckFailedException':
      code = Code.DB_UNIQUE_ERROR;
      break;
    case 'TransactionCanceledException': {
      const transactionError = error as TransactionCanceledException;
      const cancellationReasons = transactionError.CancellationReasons || [];
      if (cancellationReasons.some(reason => reason.Code === 'ConditionalCheckFailed')) {
        code = Code.DB_FOREIGN_ERROR;
      } else {
        code = Code.DB_TRANSACTION_FAIL;
      }
      break;
    }

    case 'ProvisionedThroughputExceededException':
      code = Code.DB_CONNECTION_BUSY;
      break;
  }

  const errorResponse: ErrorResponse = {
    category: Errors[code].Category,
    code: code,
    message: Errors[code].Message,
    errorDetails: [],
  };

  return {
    statusCode: Errors[code].HttpStatus,
    body: JSON.stringify(errorResponse),
  };
};

export const handleSysInternalError = (): APIGatewayProxyResult => {
  const code = Code.SYS_INTERNAL_ERROR;
  const errorResponse: ErrorResponse = {
    category: Errors[code].Category,
    code: code,
    message: Errors[code].Message,
    errorDetails: [],
  };

  return {
    statusCode: Errors[code].HttpStatus,
    body: JSON.stringify(errorResponse),
  };
};

export const validateInput = (data: ZodError): ErrorDetail[] => {
  const errors: ErrorDetail[] = [];

  for (const item of data.issues || []) {
    const errorCode = (item as { params?: { code?: string } }).params?.code || item.code;
    errors.push({
      field: item.path[0] as string,
      message: item.message,
      errorCode,
    });
  }
  return errors;
};

export const errorResponse = (
  statusCode: number,
  errorCode: string,
  errorDetails: ErrorDetail[] = []
): APIGatewayProxyResult => {
  const errorResponse: ErrorResponse = {
    category: Errors[errorCode].Category,
    code: errorCode,
    message: Errors[errorCode].Message,
    errorDetails: errorDetails,
  };

  return {
    statusCode: statusCode,
    body: JSON.stringify(errorResponse),
  };
};

export function checkAuth(event: APIGatewayProxyEvent) {
  const autorizerClaims = event.requestContext.authorizer?.claims;
  const userId = autorizerClaims?.['cognito:username'];

  if (!userId) {
    const ErrorCode = Code.AUTH_UNAUTHORIZED;
    return errorResponse(Errors[ErrorCode].HttpStatus, ErrorCode, []);
  }
}
