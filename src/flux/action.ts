export interface Action {
    type: string;
}

export interface PayloadAction<TPayload> extends Action {
    payload: TPayload;
}
