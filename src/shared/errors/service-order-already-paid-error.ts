export class ServiceOrderAlreadyPaidError extends Error {
  constructor() {
    super('Service order is already paid');
  }
}
