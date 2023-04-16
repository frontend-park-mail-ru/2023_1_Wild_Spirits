export type TRequestResolver = (...args: any[])=>void
export type TRequest = (resolve: TRequestResolver, ...args: any[]) => void;
