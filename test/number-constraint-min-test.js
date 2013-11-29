var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - constrained property - min", function (t) {

  var user = {
    "name": "string",
    "age": {
      "type": "number",
      "min": 99
    }
  };

  var data = {
    "name": "Marak",
    "age": 100
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - invalid data - constrained property - min", function (t) {

  var user = {
    "name": "string",
    "age": {
      "type": "number",
      "min": 99
    }
  };

  var data = {
    "name": "Marak",
    "age": 42
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, 'age');
  t.equal(result.errors[0].constraint, 'min');
  t.equal(result.errors[0].expected, 99);
  t.equal(result.errors[0].actual, 42);
  t.equal(result.errors[0].value, 42);
  t.ok(result, "data is invalid");
  t.end();

});