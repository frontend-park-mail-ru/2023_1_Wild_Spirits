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

            return isValid;
        }

        warningMsg(message) {
            const errorMessages = {
                "User already exists": "Такой пользователь уже зарегестрирован",
                "User not authorized": "Неверный логин или пароль",
                "Wrong credentials": "Неверный логин или пароль"
            };

            const warning = errorMessages[message];

            const warningEl = document.getElementById("common-warning");

            warningEl.innerText = warning ? warning : message;
        }
    }
