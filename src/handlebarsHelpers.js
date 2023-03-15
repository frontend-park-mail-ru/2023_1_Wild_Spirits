/**
 * registers helpers for handlebars
 * @param {Object} Handlebars - handlebars entity
 */
function registerHelpers(Handlebars) {
    Handlebars.registerHelper('ifEq', (arg1, arg2, options) => {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
}

export default registerHelpers
