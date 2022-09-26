export default class FirestoreError extends Error {
  public readonly name = 'FirestoreError';
  public readonly fsError: Error;

  constructor(message: string, error: Error) {
    super(message);
    this.fsError = error;

    Object.setPrototypeOf(this, FirestoreError.prototype);
  }
}
