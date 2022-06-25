class BadRequestError extends Error {
  code = 400;
  name = 'BadRequestError';
  constructor(message: string) {
    super(message);
  }
}

export default BadRequestError;
