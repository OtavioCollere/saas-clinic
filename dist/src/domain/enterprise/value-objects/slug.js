"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slug = void 0;
class Slug {
    constructor(value) {
        this.value = value;
    }
    static create(text) {
        if (!text || text.trim().length === 0) {
            throw new Error('Slug cannot be created from empty text');
        }
        const slug = text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        if (slug.length === 0) {
            throw new Error('Slug generation resulted in empty value');
        }
        return new Slug(slug);
    }
    getValue() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
exports.Slug = Slug;
//# sourceMappingURL=slug.js.map