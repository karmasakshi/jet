export class CustomError extends Error {
  public httpStatusCode: number;

  public constructor(httpStatusCode: number, message: string) {
    super(message);
    this.httpStatusCode = httpStatusCode;
  }
}
