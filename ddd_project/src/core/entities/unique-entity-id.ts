import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  private id: string;

  constructor(value?: string) {
    this.id = value ?? randomUUID();
  }

  toString(): string {
    return this.id;
  }

  toValue(): string {
    return this.id;
  }
}