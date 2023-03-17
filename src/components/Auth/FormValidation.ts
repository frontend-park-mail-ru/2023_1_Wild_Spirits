/** @module Components */

/**
 * method that validates form
 * @class FormValidation
 * @param {HTMLElement} form - validated form
 * @returns {bool} - is form valid
 */
export const validateForm = (form: HTMLFormElement): boolean => {
    const validateField = (field: string, value: FormDataEntryValue) => {
        if (field === "email") {
            if (!(value instanceof File)) {
                if (!value.includes("@")) return "почта должна содержать символ '@'";
            }
        }

        return "";
    };

    const formData = new FormData(form);

    let isValid = true;

    for (const [field, value] of formData.entries()) {
        const warningEl = form.querySelector(`input[name=${field}] + .warning`);
        if (!warningEl) {
            continue;
        }

        if (value === "") {
            warningEl.textContent = "поле не может быть пустым";
            isValid = false;
        } else {
            warningEl.textContent = validateField(field, value);
        }
    }

    if (formData.get("password") !== formData.get("passwordConfirmation")) {
        const warningEl = form.querySelector("input[name=passwordConfirmation] + .warning");
        if (warningEl) {
            warningEl.textContent = "пароли не совпадают";
        }
    }

    return isValid;
};
