import { UniqueEntityId } from "./unique-entity-id";

export class Entity<EntityProps> {
  private _id: UniqueEntityId;
  protected props: EntityProps;

  constructor(props: EntityProps, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  get id(): UniqueEntityId {
    return this._id;
  }
}