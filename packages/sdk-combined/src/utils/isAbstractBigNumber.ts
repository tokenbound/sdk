import { AbstractBigNumber } from "../types";

export function isAbstractBigNumber(value: any): value is AbstractBigNumber {
    return (
      typeof value === 'object' &&
      typeof value._hex === 'string' &&
      typeof value._isBigNumber === 'boolean' &&
      typeof value.fromTwos === 'function' &&
      typeof value.toTwos === 'function' &&
      typeof value.abs === 'function' &&
      typeof value.add === 'function' &&
      typeof value.sub === 'function' &&
      typeof value.div === 'function' &&
      typeof value.mul === 'function' &&
      typeof value.mod === 'function' &&
      typeof value.pow === 'function' &&
      typeof value.and === 'function' &&
      typeof value.or === 'function' &&
      typeof value.xor === 'function' &&
      typeof value.mask === 'function' &&
      typeof value.shl === 'function' &&
      typeof value.shr === 'function' &&
      typeof value.eq === 'function' &&
      typeof value.lt === 'function' &&
      typeof value.lte === 'function' &&
      typeof value.gt === 'function' &&
      typeof value.gte === 'function' &&
      typeof value.isNegative === 'function' &&
      typeof value.isZero === 'function' &&
      typeof value.toNumber === 'function' &&
      typeof value.toBigInt === 'function' &&
      typeof value.toString === 'function' &&
      typeof value.toHexString === 'function' &&
      typeof value.toJSON === 'function'
      // Add checks for other necessary methods and properties
    );
  }
  