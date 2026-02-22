export abstract class TransactionManager {
  abstract run<T>(callback: (tx: unknown) => Promise<T>): Promise<T>;
}
