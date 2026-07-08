export type Left<L> = {
  _tag: 'Left';
  value: L;
};

export type Right<R> = {
  _tag: 'Right';
  value: R;
};

export type Either<L, R> = Left<L> | Right<R>;

export function makeLeft<L, R = never>(value: L): Either<L, R> {
  return {
    _tag: 'Left',
    value,
  };
}

export function makeRight<R, L = never>(value: R): Either<L, R> {
  return {
    _tag: 'Right',
    value,
  };
}

export function isLeft<L, R>(either: Either<L, R>): either is Left<L> {
  return either._tag === 'Left';
}

export function isRight<L, R>(either: Either<L, R>): either is Right<R> {
  return either._tag === 'Right';
}

export function unwrapEither<L, R>(either: Either<L, R>): L | R {
  return either.value;
}

