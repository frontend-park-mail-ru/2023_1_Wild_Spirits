export type TRequestResolver = (...args: any[]) => void;
export type TRequest<PROPS extends any[] = any[]> = (resolve: TRequestResolver, ...args: PROPS) => void;
