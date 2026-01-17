"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const unique_entity_id_1 = require("./unique-entity-id");
class Entity {
    constructor(props, id) {
        this.props = props;
        this._id = id ?? new unique_entity_id_1.UniqueEntityId();
    }
    get id() {
        return this._id;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map