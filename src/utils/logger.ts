export const log: (...args: any[]) => void = __DEV__ ? console.log.bind(console) : () => {}
export const warn: (...args: any[]) => void = __DEV__ ? console.warn.bind(console) : () => {}
export const error: (...args: any[]) => void = console.error.bind(console)





