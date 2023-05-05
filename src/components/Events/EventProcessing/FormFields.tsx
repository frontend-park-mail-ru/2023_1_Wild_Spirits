import { VDOM } from "modules/vdom";
import { EventProcessingForm } from "models/Events";
import {
    FormFieldBase,
    FormFieldNames,
    FormLabel,
    FormLabelProps,
    InputField,
    TextareaField,
} from "components/Form/FormBase";

export type EPFormLabelProps = FormLabelProps<EventProcessingForm>;

export type EPFormFieldNames = FormFieldNames<EventProcessingForm>;
export const EPFormLabel = FormLabel<EventProcessingForm>;
export const EPFormFieldBase = FormFieldBase<EventProcessingForm>;
export const EPInputField = InputField<EventProcessingForm>;
export const EPTextareaField = TextareaField<EventProcessingForm>;
