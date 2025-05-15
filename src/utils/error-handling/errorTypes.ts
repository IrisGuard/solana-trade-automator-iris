
export class BotError extends Error {
  isBotError: boolean = true;
  
  constructor(message: string) {
    super(message);
    this.name = "BotError";
  }
}

export class NetworkError extends BotError {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends BotError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends BotError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class TokenError extends BotError {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

export class TransactionError extends BotError {
  constructor(message: string) {
    super(message);
    this.name = "TransactionError";
  }
}
