'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.errorResponse =
  exports.validateInput =
  exports.handleSysInternalError =
  exports.handleErrorDynamoDb =
  exports.ErrorCode =
  exports.Errors =
  exports.Code =
  exports.Category =
    void 0;
exports.checkAuth = checkAuth;
exports.Category = {
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  RESOURCE: 'RESOURCE',
  NETWORK: 'NETWORK',
  SYSTEM: 'SYSTEM',
  DATABASE: 'DATABASE',
  BUSINESS: 'BUSINESS',
};
exports.Code = {
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
exports.Errors = {
  [exports.Code.VAL_VALIDATION_FAILED]: {
    Category: exports.Category.VALIDATION,
    HttpStatus: 400,
    Description: 'Validatiion failed',
    Message: '入力欄に不備があります。',
  },
  [exports.Code.VAL_DUPLICATE]: {
    Category: exports.Category.VALIDATION,
    HttpStatus: 409,
    Description: 'Duplicate entry',
    Message: '入力された値はすでに存在します。',
  },
  [exports.Code.AUTH_UNAUTHORIZED]: {
    Category: exports.Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Unauthorized access',
    Message: '認証情報が見つかりません。',
  },
  [exports.Code.AUTH_FORBIDDEN]: {
    Category: exports.Category.AUTHENTICATION,
    HttpStatus: 403,
    Description: 'Forbidden access',
    Message: 'アクセスが禁止されています。',
  },
  [exports.Code.AUTH_TOKEN_EXPIRED]: {
    Category: exports.Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Token expired',
    Message: 'トークンの有効期限が切れています。',
  },
  [exports.Code.AUTH_INVALID_TOKEN]: {
    Category: exports.Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Invalid token',
    Message: '無効なトークンです。',
  },
  [exports.Code.AUTH_LOCKED]: {
    Category: exports.Category.AUTHENTICATION,
    HttpStatus: 403,
    Description: 'Account locked',
    Message: 'アカウントがロックされています。',
  },
  [exports.Code.AUTH_INVALID_CREDENTIALS]: {
    Category: exports.Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Invalid credentials',
    Message: 'ユーザー名またはパスワードが無効です。',
  },
  [exports.Code.AUTH_INVALID_CREDENTIALS_MULTIPLE_TIMES]: {
    Category: exports.Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Invalid credentials multiple times',
    Message: '複数回連続で無効な認証情報が入力されました。一定回数を超えるとロックします。',
  },
  [exports.Code.AUTH_RESET_CODE_EXPIRED]: {
    Category: exports.Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Reset code expired',
    Message:
      'パスワードリセットコードの有効期限が切れています。再度リセットをリクエストしてください。',
  },
  [exports.Code.AUTH_TEMPORARY_PASSWORD_EXPIRED]: {
    Category: exports.Category.AUTHENTICATION,
    HttpStatus: 401,
    Description: 'Temporary password expired',
    Message: '一時パスワードの有効期限が切れています。再度リセットをリクエストしてください。',
  },
  [exports.Code.RES_NOT_FOUND]: {
    Category: exports.Category.RESOURCE,
    HttpStatus: 404,
    Description: 'Resource not found',
    Message: 'リソースが見つかりません。',
  },
  [exports.Code.RES_CONFLICT]: {
    Category: exports.Category.RESOURCE,
    HttpStatus: 409,
    Description: 'Resource conflict',
    Message: 'リソースの状態が競合しています。',
  },
  [exports.Code.RES_GONE]: {
    Category: exports.Category.RESOURCE,
    HttpStatus: 410,
    Description: 'Resource gone',
    Message: 'リソースは削除されました。',
  },
  [exports.Code.RES_LOCKED]: {
    Category: exports.Category.RESOURCE,
    HttpStatus: 423,
    Description: 'Resource locked',
    Message: 'リソースがロックされています。',
  },
  [exports.Code.NET_TIMEOUT]: {
    Category: exports.Category.NETWORK,
    HttpStatus: 504,
    Description: 'Network timeout',
    Message: 'リクエストがタイムアウトしました。',
  },
  [exports.Code.NET_CONNECTION_FAIL]: {
    Category: exports.Category.NETWORK,
    HttpStatus: 503,
    Description: 'Network connection failed',
    Message: 'ネットワーク接続に失敗しました。',
  },
  [exports.Code.NET_BAD_RESPONSE]: {
    Category: exports.Category.NETWORK,
    HttpStatus: 502,
    Description: 'Bad network response',
    Message: 'ネットワークからの応答が不正です。',
  },
  [exports.Code.NET_RATE_LIMIT]: {
    Category: exports.Category.NETWORK,
    HttpStatus: 429,
    Description: 'Rate limit exceeded',
    Message: 'リクエストのレート制限を超えました。',
  },
  [exports.Code.SYS_INTERNAL_ERROR]: {
    Category: exports.Category.SYSTEM,
    HttpStatus: 500,
    Description: 'Internal server error',
    Message: '予期しないサーバーエラーが発生しました。',
  },
  [exports.Code.SYS_DEPENDENCY_ERROR]: {
    Category: exports.Category.SYSTEM,
    HttpStatus: 500,
    Description: 'Service unavailable',
    Message: '依存サービスが利用できません。',
  },
  [exports.Code.SYS_CONFIG_ERROR]: {
    Category: exports.Category.SYSTEM,
    HttpStatus: 500,
    Description: 'Configuration error',
    Message: 'サーバーの設定に問題があります。',
  },
  [exports.Code.SYS_RESOURCE_EXHAUSTED]: {
    Category: exports.Category.SYSTEM,
    HttpStatus: 500,
    Description: 'Resource exhausted',
    Message: 'サーバーのリソースが不足しています。',
  },
  [exports.Code.SYS_UNKNOWN]: {
    Category: exports.Category.SYSTEM,
    HttpStatus: 500,
    Description: 'Unknown error',
    Message: '不明なエラーが発生しました。',
  },
  [exports.Code.DB_SYNTAX_ERROR]: {
    Category: exports.Category.DATABASE,
    HttpStatus: 500,
    Description: 'Database syntax error',
    Message: 'データベースのクエリに構文エラーがあります。',
  },
  [exports.Code.DB_UNIQUE_ERROR]: {
    Category: exports.Category.DATABASE,
    HttpStatus: 409,
    Description: 'Database unique constraint violation',
    Message: 'データベースの一意制約に違反しています。',
  },
  [exports.Code.DB_FOREIGN_ERROR]: {
    Category: exports.Category.DATABASE,
    HttpStatus: 409,
    Description: 'Database foreign key constraint violation',
    Message: 'データベースの外部キー制約に違反しています。',
  },
  [exports.Code.DB_TRANSACTION_FAIL]: {
    Category: exports.Category.DATABASE,
    HttpStatus: 500,
    Description: 'Database transaction failed',
    Message: 'データベースのトランザクションに失敗しました。',
  },
  [exports.Code.DB_CONNECTION_BUSY]: {
    Category: exports.Category.DATABASE,
    HttpStatus: 503,
    Description: 'Database connection busy',
    Message: 'データベースへの接続数が上限に達しています。',
  },
  [exports.Code.BIZ_DOMAIN_RULE_VIOLATION]: {
    Category: exports.Category.BUSINESS,
    HttpStatus: 400,
    Description: 'Business domain rule violation',
    Message: 'ビジネスドメインのルールに違反しています。',
  },
  [exports.Code.BIZ_ILLEGAL_STATE]: {
    Category: exports.Category.BUSINESS,
    HttpStatus: 400,
    Description: 'Illegal business state',
    Message: '現在の状態ではこの操作を行うことができません。',
  },
  [exports.Code.BIZ_CONFLICT]: {
    Category: exports.Category.BUSINESS,
    HttpStatus: 409,
    Description: 'Business conflict',
    Message: 'ビジネスロジックの矛盾が発生しています。',
  },
  [exports.Code.BIZ_PAYMENT_REQUIRED]: {
    Category: exports.Category.BUSINESS,
    HttpStatus: 403,
    Description: 'Payment required',
    Message: 'この操作を行うには有料プランへの加入が必要です。',
  },
  [exports.Code.BIZ_UNPAID_SUBSCRIPTION]: {
    Category: exports.Category.BUSINESS,
    HttpStatus: 403,
    Description: 'Unpaid subscription',
    Message: 'サブスクリプションの支払いが未完了です。',
  },
  [exports.Code.BIZ_PLAN_EXPIRED]: {
    Category: exports.Category.BUSINESS,
    HttpStatus: 403,
    Description: 'Plan expired',
    Message: '現在のプランの有効期限が切れています。',
  },
  [exports.Code.BIZ_BILLING_ERROR]: {
    Category: exports.Category.BUSINESS,
    HttpStatus: 500,
    Description: 'Billing error',
    Message: '請求処理中にエラーが発生しました。時間をおいて再試行してください。',
  },
  // Add more business-specific error codes as needed
};
exports.ErrorCode = {
  VLD_OUT_OF_RANGE: 'VLD_OUT_OF_RANGE',
  VLD_REQUIRED: 'VLD_REQUIRED',
  VLD_INVALID_FORMAT: 'VLD_INVALID_FORMAT',
  VLD_UNKNOWN_ENUM: 'VLD_UNKNOWN_ENUM',
  VLD_PASSWORD_SAME_AS_OLD: 'VLD_PASSWORD_SAME_AS_OLD',
};
const handleErrorDynamoDb = error => {
  let code = exports.Code.DB_CONNECTION_BUSY;
  switch (error.name) {
    case 'ValidationException':
      code = exports.Code.DB_SYNTAX_ERROR;
      break;
    case 'ConditionalCheckFailedException':
      code = exports.Code.DB_UNIQUE_ERROR;
      break;
    case 'TransactionCanceledException': {
      const transactionError = error;
      const cancellationReasons = transactionError.CancellationReasons || [];
      if (cancellationReasons.some(reason => reason.Code === 'ConditionalCheckFailed')) {
        code = exports.Code.DB_FOREIGN_ERROR;
      } else {
        code = exports.Code.DB_TRANSACTION_FAIL;
      }
      break;
    }
    case 'ProvisionedThroughputExceededException':
      code = exports.Code.DB_CONNECTION_BUSY;
      break;
  }
  const errorResponse = {
    category: exports.Errors[code].Category,
    code: code,
    message: exports.Errors[code].Message,
    errorDetails: [],
  };
  return {
    statusCode: exports.Errors[code].HttpStatus,
    body: JSON.stringify(errorResponse),
  };
};
exports.handleErrorDynamoDb = handleErrorDynamoDb;
const handleSysInternalError = () => {
  const code = exports.Code.SYS_INTERNAL_ERROR;
  const errorResponse = {
    category: exports.Errors[code].Category,
    code: code,
    message: exports.Errors[code].Message,
    errorDetails: [],
  };
  return {
    statusCode: exports.Errors[code].HttpStatus,
    body: JSON.stringify(errorResponse),
  };
};
exports.handleSysInternalError = handleSysInternalError;
const validateInput = data => {
  const errors = [];
  for (const item of data.issues || []) {
    const errorCode = item.params?.code || item.code;
    errors.push({
      field: item.path[0],
      message: item.message,
      errorCode,
    });
  }
  return errors;
};
exports.validateInput = validateInput;
const errorResponse = (statusCode, errorCode, errorDetails = []) => {
  const errorResponse = {
    category: exports.Errors[errorCode].Category,
    code: errorCode,
    message: exports.Errors[errorCode].Message,
    errorDetails: errorDetails,
  };
  return {
    statusCode: statusCode,
    body: JSON.stringify(errorResponse),
  };
};
exports.errorResponse = errorResponse;
function checkAuth(event) {
  const autorizerClaims = event.requestContext.authorizer?.claims;
  const userId = autorizerClaims?.['cognito:username'];
  if (!userId) {
    const ErrorCode = exports.Code.AUTH_UNAUTHORIZED;
    return (0, exports.errorResponse)(exports.Errors[ErrorCode].HttpStatus, ErrorCode, []);
  }
}
