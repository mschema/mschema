var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - non-object schema", function (t) {

  var user = "data";
  var data = {};

  var result = mschema.validate(data, user);
  t.equal(result.valid, false)
  t.equal(result.message, 'schema is not an object, cannot validate')
  t.ok(result, "data is valid");
  t.end();

});


test("mschema.validate - non-object properties field", function (t) {
  
  var user = {
    "type": "object",
    "properties": {
      "name": "string",
      "age": "number",
      "address": {
        "street": "string",
        "city": "string",
        "zipcode": "string"
      }
    }
  };

  var data = {};

  var result = mschema.validate(data, user);
  t.equal(result.valid, true)
  t.ok(result, "data is valid");
  t.end();

});