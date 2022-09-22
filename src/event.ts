export default abstract class Event {
  public constructor(public readonly name: string) {}
  public listen(): Promise<void> | void {}
}
