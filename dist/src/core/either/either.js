"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRight = exports.makeLeft = exports.unwrapEither = exports.isRight = exports.isLeft = void 0;
const isLeft = (e) => {
    return e.left !== undefined;
};
exports.isLeft = isLeft;
const isRight = (e) => {
    return e.right !== undefined;
};
exports.isRight = isRight;
const unwrapEither = ({ left, right, }) => {
    if (right !== undefined && left !== undefined) {
        throw new Error(`Received both left and right values at runtime when opening an Either\nLeft: ${JSON.stringify(left)}\nRight: ${JSON.stringify(right)}`);
    }
    if (left !== undefined) {
        return left;
    }
    if (right !== undefined) {
        return right;
    }
    throw new Error('Received no left or right values at runtime when opening Either');
};
exports.unwrapEither = unwrapEither;
const makeLeft = (value) => ({ left: value });
exports.makeLeft = makeLeft;
const makeRight = (value) => ({ right: value });
exports.makeRight = makeRight;
//# sourceMappingURL=either.js.map