export interface Action<TPayload> {
    type: string,
    payload?: TPayload
}
