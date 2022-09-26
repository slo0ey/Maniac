export default class EntityNotFoundError extends Error {
  public readonly name = 'EntityNotFoundError';

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}
