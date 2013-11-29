var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - constrained property - maxLength", function (t) {

  var user = {
    "name": {
      "type": "string",
      "maxLength": 10,
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

test("mschema.validate - invalid data - constrained property - maxLength", function (t) {

  var user = {
    "name": {
      "type": "string",
      "maxLength": 10,
    }
  }

  var data = {
    "name": "Marak Squires"
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, 'name');
  t.equal(result.errors[0].constraint, 'maxLength');
  t.equal(result.errors[0].expected, 10);
  t.equal(result.errors[0].actual, 13);
  t.equal(result.errors[0].value, "Marak Squires");
  t.ok(result, "data is invalid");
  t.end();

});