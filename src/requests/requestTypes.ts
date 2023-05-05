export type TRequestResolver = () => void;
export type TRequest<PROPS extends any[] = any[]> = (resolve: TRequestResolver, ...args: PROPS) => void;
