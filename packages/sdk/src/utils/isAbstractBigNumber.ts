import { AbstractBigNumber } from "../types";

export function isAbstractBigNumber(value: any): value is AbstractBigNumber {
  return value && value._isBigNumber === true;
}
