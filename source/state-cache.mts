type RuleName = string;
type Position = number;
type State = number;
type JSXTag = string;

/**
 * A multi-layer cache for the state of the parser.
 * It uses an array of keys as a single compound key.
 */
export default class StateCache<T> {

  private cache: Map<RuleName, Map<Position, Map<State, Map<JSXTag, T>>>> = new Map();

  get(key: [RuleName, Position, State, JSXTag]): T | undefined {
    return this.cache.get(key[0])?.get(key[1])?.get(key[2])?.get(key[3]);
  }

  /**
   * Check if this multi-layer cache has the given key.
   * Since the intermediate layers are always other maps we only need to check the last layer.
   */
  has(key: [RuleName, Position, State, JSXTag]): boolean {
    return !!this.cache.get(key[0])?.get(key[1])?.get(key[2])?.has(key[3]);
  }

  set(key: [RuleName, Position, State, JSXTag], value: T): void {
    const cache0 = this.cache;
    let cache1: Map<Position, Map<State, Map<JSXTag, T>>>;
    if (!cache0.has(key[0])) {
      cache1 = new Map
      this.cache.set(key[0], cache1);
    } else {
      cache1 = cache0.get(key[0])!;
    }

    let cache2: Map<State, Map<JSXTag, T>>;
    if (!cache1?.has(key[1])) {
      cache2 = new Map();
      cache1.set(key[1], cache2);
    } else {
      cache2 = cache1.get(key[1])!;
    }

    let cache3: Map<JSXTag, T>;
    if (!cache2.has(key[2])) {
      cache3 = new Map();
      cache2.set(key[2], cache3);
    } else {
      cache3 = cache2.get(key[2])!;
    }

    cache3.set(key[3], value);
  }
}
