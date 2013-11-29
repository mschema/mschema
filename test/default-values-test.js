var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - default value", function (t) {

  var user = {
    "name": {
      "type": "string",
      "default": "Marak",
    },
    "age": {
      "type": "number",
      "default": 42
    },
    "items": []
  };

  var data = {};

  var result = mschema.validate(data, user);
  t.equal(result.valid, true);
  t.equal(result.instance.name, 'Marak');
  t.equal(result.instance.age, 42);

  t.ok(result, "data is valid");
  t.end();

});


test("mschema.validate - valid data - default value - invalid value provided", function (t) {

  var user = {
    "name": {
      "type": "string",
      "default": "Marak",
    },
    "age": {
      "type": "number",
      "default": 42
    }
  };

  var data = { "name": 123 };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.ok(result, "data is invalid");
  t.equal(result.errors[0].property, 'name');
  t.end();

});