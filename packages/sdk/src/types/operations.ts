export const CALL_OPERATIONS = {
  CALL: 0,
  DELEGATECALL: 1,
  CREATE: 2,
  CREATE2: 3,
} as const

export type CallOperation = (typeof CALL_OPERATIONS)[keyof typeof CALL_OPERATIONS]
