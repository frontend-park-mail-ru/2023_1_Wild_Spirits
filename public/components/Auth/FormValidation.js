/** @module Components */

/**
 * common form validation functionality
 * @class FormValidation
 */
export default (superclass) =>
    class extends superclass {
        /**
         * method that validates form
        * @class FormValidation
        * @param {HTMLElement} form - validated form
        * @returns {bool} - is form valid
        */
        validate(form) {
            const validateField = (field, value) => {
                if (field === "email") {
                    if (!value.includes("@")) return "почта должна содержать символ '@'";
                }

                return "";
            };

            const formData = new FormData(form);

            let isValid = true;

            for (const entry of formData.entries()) {
                const warningEl = form.querySelector(`input[name=${entry[0]}] + .warning`);
                if (!warningEl) {
                    continue;
                }

                if (entry[1] === "") {
                    warningEl.textContent = "поле не может быть пустым";
                    isValid = false;
                } else {
                    warningEl.textContent = validateField(...entry);
                }
            }

            if (formData.get("password") !== formData.get("passwordConfirmation")) {
                const warningEl = form.querySelector("input[name=passwordConfirmation] + .warning");
                if (warningEl) {
                    warningEl.textContent = "пароли не совпадают";
                }
            }

            return isValid;
        }
    }
