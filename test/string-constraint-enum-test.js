var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - constrained property - string - enum", function (t) {

  var weapon = {
    "name": "string",
    "type": {
      "type": "string",
      "enum": ["knife", "gun", "missle"]
    }
  };

  var data = {
    "name": "AK-47",
    "type": "gun"
  };

  var result = mschema.validate(data, weapon);
  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - invalid data - constrained property - string - enum", function (t) {

  var weapon = {
    "name": "string",
    "type": {
      "type": "string",
      "enum": ["knife", "gun", "missle"]
    }
  };

  var data = {
    "name": "AK-47",
    "type": "flame thrower"
  };

  // perform the validation
  var result = mschema.validate(data, weapon);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, 'type');
  t.equal(result.errors[0].constraint, 'enum');
  t.similar(result.errors[0].expected, ["knife", "gun", "missle"]);
  t.equal(result.errors[0].actual, "flame thrower");
  t.equal(result.errors[0].value, "flame thrower");
  t.ok(result, "data is invalid");
  t.end();

});