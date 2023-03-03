export default (superclass) => class extends superclass {
    formSubmit(event) {
        const validate = (field, value) => {
            if (field === 'email') {
                if (!value.includes('@'))
                    return "почта должна содержать символ '@'";
            }
    
            return '';
        }

        event.preventDefault();

        const form = event.target;
                
        const formData = new FormData(form);

        for (const entry of formData.entries()) {
            const warningEl = form.querySelector(`input[name=${entry[0]}] + .warning`);

            if (entry[1] === '') {
                warningEl.textContent = "поле не может быть пустым"
            } else {
                warningEl.textContent = validate(...entry);
            }
        }

    }
}
