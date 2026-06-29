export class ServiceOrderNotFoundError extends Error {
  constructor() {
    super('Service order not found');
  }
}
