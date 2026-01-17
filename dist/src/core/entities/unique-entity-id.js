"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueEntityId = void 0;
const node_crypto_1 = require("node:crypto");
class UniqueEntityId {
    constructor(value) {
        this.id = value ?? (0, node_crypto_1.randomUUID)();
    }
    toString() {
        return this.id;
    }
    toValue() {
        return this.id;
    }
}
exports.UniqueEntityId = UniqueEntityId;
//# sourceMappingURL=unique-entity-id.js.map