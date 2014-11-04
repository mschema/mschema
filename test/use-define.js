var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.ok(mschema.define, "mschema define function enabled");
  t.end();
});

test("use define function to define schema and call .validate", function (t) {

  var user = mschema.define({
    "name": "string",
    "age": "number",
    "address": "object",
    "isActive": "boolean",
    "meta": "any"
  });

  var data = {
    "name": "Marak",
    "age": 42,
    "address": {
      "street": "123 elm street",
      "city": "Canada",
      "zipcode": "12345-01"
    },
    "isActive": true,
    "meta": 42
  };

  var result = user.validate(data);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();
});
