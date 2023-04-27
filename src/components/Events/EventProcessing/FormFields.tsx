import { VDOM } from "modules/vdom";
import { EventProcessingForm } from "models/Events";
import { toEvent } from "modules/CastEvents";

export type EventProcessingFormKey = keyof EventProcessingForm;

export interface FormLabelProps {
    fieldName: EventProcessingFormKey;
    title: string;
    required?: boolean;
}

interface BaseFormFieldProps extends FormLabelProps {
    errorMsg?: string;
}

interface BaseTextProps extends BaseFormFieldProps {
    value: string | number | undefined;
    min?: string;
    changeHandler: (event: Event, fieldName: EventProcessingFormKey) => void;
}

export type InputFieldType = "text" | "date" | "time";
export interface InputFieldProps extends BaseTextProps {
    type: InputFieldType;
}

export interface TextareaFieldProps extends BaseTextProps {}

export const FormLabel = ({ fieldName, required, title }: FormLabelProps) => {
    return (
        <label htmlFor={`event-processing-${fieldName}`} className={required ? "form-label-required" : "form-label"}>
            {title}
        </label>
    );
};

export interface FormFieldBaseProps extends BaseFormFieldProps {
    children: JSX.Element;
}
export const FormFieldBase = ({ fieldName, title, required, errorMsg, children }: FormFieldBaseProps) => {
    return (
        <div className="event-processing__form-block">
            <FormLabel fieldName={fieldName} required={required} title={title} />
            {children}
            {errorMsg && <div className="form-error">{errorMsg}</div>}
        </div>
    );
};

export const InputField = ({
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
        <FormFieldBase fieldName={fieldName} title={title} required={required} errorMsg={errorMsg}>
            <input
                name={fieldName}
                className={errorMsg ? "form-control-error" : "form-control"}
                type={type}
                id={`event-processing-${fieldName}`}
                value={value}
                min={min && min}
                onChange={(e) => changeHandler(toEvent(e), fieldName)}
            />
        </FormFieldBase>
    );
};

export const TextareaField = ({ fieldName, value, title, required, errorMsg, changeHandler }: TextareaFieldProps) => {
    return (
        <FormFieldBase fieldName={fieldName} title={title} required={required} errorMsg={errorMsg}>
            <textarea
                name={fieldName}
                className={`event-processing__form-textarea ${errorMsg ? "form-control-error" : "form-control"}`}
                id={`event-processing-${fieldName}`}
                onChange={(e) => changeHandler(toEvent(e), fieldName)}
            >
                {value}
            </textarea>
        </FormFieldBase>
    );
};
