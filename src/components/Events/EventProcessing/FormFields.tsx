import { VDOM } from "modules/vdom";
import { toEvent } from "modules/CastEvents";
import { EventProcessingForm } from "models/Events";

export type EventProcessingFormKey = keyof EventProcessingForm;

export interface FormFields extends EventProcessingForm {
    phone: string;
    website: string;
}

export type FormFieldNameType = keyof FormFields

export interface FormLabelProps {
    prefix: string;
    fieldName: FormFieldNameType;
    title: string;
    required?: boolean;
}

interface BaseFormFieldProps extends FormLabelProps {
    errorMsg?: string;
}

interface BaseTextProps extends BaseFormFieldProps {
    value: string | number | undefined;
    min?: string;
    changeHandler?: (event: Event, fieldName: FormFieldNameType) => void;
}

export type InputFieldType = "text" | "date" | "time";
export interface InputFieldProps extends BaseTextProps {
    type: InputFieldType;
}

export interface TextareaFieldProps extends BaseTextProps {}

export const FormLabel = ({ prefix, fieldName, required, title }: FormLabelProps) => {
    return (
        <label htmlFor={prefix + "-" + fieldName} className={required ? "form-label-required" : "form-label"}>
            {title}
        </label>
    );
}

export interface FormFieldBaseProps extends BaseFormFieldProps {
    children: JSX.Element;
}

export const FormFieldBase = ({ prefix, fieldName, title, required, errorMsg, children }: FormFieldBaseProps) => {
    return (
        <div className={`${prefix}__form-block`}>
            <FormLabel prefix={prefix} fieldName={fieldName} required={required} title={title} />
            {children}
            {errorMsg && <div className="form-error">{errorMsg}</div>}
        </div>
    );
};

export const InputField = ({
    prefix,
    fieldName,
    value,
    title,
    type,
    min,
    required,
    errorMsg,
    changeHandler,
}: InputFieldProps) => {
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
            />
        </FormFieldBase>
    )
}

export const TextareaField = ({ prefix, fieldName, value, title, required, errorMsg, changeHandler }: TextareaFieldProps) => {
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
