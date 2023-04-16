export type TRequestResolver = ()=>void
export type TRequest = (resolve: TRequestResolver, ...args: any[]) => void;
