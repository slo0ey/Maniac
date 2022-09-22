export default abstract class Event {
  public constructor(public readonly name: string) {}
  listen(): Promise<void> | void {}
}
