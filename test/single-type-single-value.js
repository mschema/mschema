var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - constrained property - string - minLength", function (t) {

  var name = {
    "type": "string",
    "minLength": 4
  };

  var data = "Marak";

  var result = mschema.validate(data, name);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});


test("mschema.validate - invalid data - constrained property - string - regex", function (t) {

  var name = {
    "type": "string",
    "regex": /^[\w|\-|\.]/
  };

  var data = "(!@#@!)";

  var result = mschema.validate(data, name);

  t.equal(result.valid, false);

  t.type(result.errors, Array);
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);

  t.equal(result.errors[0].property, 'key');
  t.equal(result.errors[0].constraint, 'regex');
  t.equal(result.errors[0].actual, "(!@#@!)");
  t.equal(result.errors[0].value, "(!@#@!)");
  t.ok(result, "data is invalid");
  t.end();

});