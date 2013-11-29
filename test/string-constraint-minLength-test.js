var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - constrained property - minLength", function (t) {

  var user = {
    "name": "string",
    "name": {
      "type": "string",
      "minLength": 2,
    }
  }

  var data = {
    "name": "Marak"
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();
});

test("mschema.validate - invalid data - constrained property - minLength", function (t) {

  var user = {
    "name": "string",
    "name": {
      "type": "string",
      "minLength": 2,
    }
  }

  var data = {
    "name": "M"
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, 'name');
  t.equal(result.errors[0].constraint, 'minLength');
  t.equal(result.errors[0].expected, 2);
  t.equal(result.errors[0].actual, 1);
  t.equal(result.errors[0].value, "M");
  t.ok(result, "data is invalid");
  t.end();

});