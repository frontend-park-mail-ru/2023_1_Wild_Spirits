import { VDOM } from "modules/vdom";
import { toEvent } from "modules/CastEvents";

export type InputFieldType = "text" | "date" | "time";
export type StringKeys<T> = Extract<keyof T, string>;
export type FormFieldNames<T> = StringKeys<T>;

export interface FormLabelProps<T> {
    prefix: string;
    fieldName: FormFieldNames<T>;
    title: string;
    required?: boolean;
    errorMsg?: string;
}

export interface BaseTextProps<T> extends FormLabelProps<T> {
    value: string | number | undefined;
    min?: string;
    changeHandler?: (event: Event, fieldName: FormFieldNames<T>) => void;
}

export interface InputFieldProps<T> extends BaseTextProps<T> {
    type: InputFieldType;
}

export type TextareaFieldProps<T> = BaseTextProps<T>;

export interface FormFieldBaseProps<T> extends FormLabelProps<T> {
    children: JSX.Element | JSX.Element[];
}

export const FormLabel = <T,>({ prefix, fieldName, required, title }: FormLabelProps<T>) => {
    return (
        <label htmlFor={`${prefix}-${fieldName}`} className={required ? "form-label-required" : "form-label"}>
            {title}
        </label>
    );
};

export const FormFieldBase = <T,>({
    prefix,
    fieldName,
    title,
    required,
    errorMsg,
    children,
}: FormFieldBaseProps<T>) => {
    return (
        <div className={`${prefix}__form-block`}>
            <FormLabel prefix={prefix} fieldName={fieldName} required={required} title={title} />
            {children}
            {errorMsg && <div className="form-error">{errorMsg}</div>}
        </div>
    );
};

export const InputField = <T,>({
    prefix,
    fieldName,
    value,
    title,
    type,
    min,
    required,
    errorMsg,
    changeHandler,
}: InputFieldProps<T>) => {
    return (
        <FormFieldBase prefix={prefix} fieldName={fieldName} title={title} required={required} errorMsg={errorMsg}>
            <input
                name={fieldName}
                className={errorMsg ? "form-control-error" : "form-control"}
                type={type}
                id={`${prefix}-${fieldName}`}
                value={value}
                min={min}
                onInput={changeHandler ? (e) => changeHandler(toEvent(e), fieldName) : undefined}
                size={1}
            />
        </FormFieldBase>
    );
};

export const TextareaField = <T,>({
    prefix,
    fieldName,
    value,
    title,
    required,
    errorMsg,
    changeHandler,
}: TextareaFieldProps<T>) => {
    return (
        <FormFieldBase prefix={prefix} fieldName={fieldName} title={title} required={required} errorMsg={errorMsg}>
            <textarea
                name={fieldName}
                className={`${prefix}__form-textarea ${errorMsg ? "form-control-error" : "form-control"}`}
                id={`${prefix}-${fieldName}`}
                onInput={changeHandler ? (e) => changeHandler(toEvent(e), fieldName) : undefined}
            >
                {value}
            </textarea>
        </FormFieldBase>
    );
};
