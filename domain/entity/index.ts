interface EntityProps {
  [index: string]: any;
}

export abstract class Entity<T extends EntityProps> {
  protected readonly _value: T;

  protected constructor(props: T) {
    this._value = Object.freeze(props);
  }
}
