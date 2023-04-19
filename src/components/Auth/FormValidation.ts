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
                if (!value.includes("@")) {
                    return "почта должна содержать символ '@'";
                }

                value = value.split('@')[1];

                if (!value.includes(".")) {
                    return "почта должна содержать символ '.'";
                }
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
            const validationError = validateField(field, value);
            if (validationError !== "") {
                warningEl.textContent = validationError;
                isValid = false;
            }
        }
    }

    const password = formData.get("password");
    const passwordConfirmation = formData.get("passwordConfirmation");

    if ((passwordConfirmation !== null) && (password !== passwordConfirmation)) {
        const warningEl = form.querySelector("input[name=passwordConfirmation] + .warning");
        if (warningEl) {
            warningEl.textContent = "пароли не совпадают";
        }
        isValid = false;
    }

    return isValid;
};

export const warningMsg = (message: string | undefined, errors: {[key: string]: string} | undefined): void => {
    let warning: string;
    if (message === undefined) {
        warning = "неизвестная ошибка сервера";
    } else {
        const errorMessages: {[key: string]: string} = {
            "User with such username/email already exists": "Такой пользователь уже зарегистрирован",
            "User not authorized": "Неверный логин или пароль",
            "Wrong credentials": "Неверный логин или пароль"
        };
    
        if (message !== 'Request data validation failure') {
            warning = errorMessages[message] || message;
        } else {
            warning = "";
        }
    }

    if (errors !== undefined) {
        const errorSynonyms: {[key: string]: string} = {
            "username": "nickname",
            "pass": "password"
        }

        for (const [field, msg] of Object.entries(errors)) {
            const fieldName = errorSynonyms[field];
            if (!fieldName) {
                continue;
            }
            const warningEl = document.querySelector(`input[name=${fieldName}] + .warning`);
            console.log(field, msg)
            if (warningEl) {
                warningEl.textContent = msg;
            }
        }
    }

    const warningEl = document.getElementById("common-warning");

    if (warningEl) {
        warningEl.innerText = warning;
    }
}
