export default Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p>\r\n    "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"nestedTest") || (depth0 != null ? lookupProperty(depth0,"nestedTest") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"nestedTest","hash":{},"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":20}}}) : helper)))
    + "\r\n</p>";
},"useData":true});