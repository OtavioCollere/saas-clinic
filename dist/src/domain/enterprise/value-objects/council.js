"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Council = void 0;
class Council {
    constructor(value) {
        this.value = value;
    }
    static crm() {
        return new Council('CRM');
    }
    static crbm() {
        return new Council('CRBM');
    }
    getValue() {
        return this.value;
    }
}
exports.Council = Council;
//# sourceMappingURL=council.js.map