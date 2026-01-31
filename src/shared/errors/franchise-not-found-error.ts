export class FranchiseNotFoundError extends Error {
  constructor() {
    super('Franchise not found');
  }
}

