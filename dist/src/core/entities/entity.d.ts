import { UniqueEntityId } from "./unique-entity-id";
export declare class Entity<EntityProps> {
    private _id;
    protected props: EntityProps;
    constructor(props: EntityProps, id?: UniqueEntityId);
    get id(): UniqueEntityId;
}
