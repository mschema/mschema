var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - constrained property - string - regex", function (t) {

  var user = {
    "name": {
      "type": "string",
      "regex": /^[\w|\-|\.]+$/
    }
  };

  var data = { "name": "Marak" };

  var result = mschema.validate(data, user);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - invalid data - constrained property - string - regex", function (t) {

  var user = {
    "name": {
      "type": "string",
      "regex": /^[\w|\-|\.]+$/
    }
  };

  var data = { "name": "(!@#@!)" };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.type(result.errors, Array)  
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, 'name');
  t.equal(result.errors[0].constraint, 'regex');
  t.similar(result.errors[0].expected, /^[\w|\-|\.]+$/);
  t.equal(result.errors[0].actual, "(!@#@!)");
  t.equal(result.errors[0].value, "(!@#@!)");
  t.ok(result, "data is invalid");
  t.end();

});

test("mschema.validate - empty value - constrained property - string - regex - required false", function (t) {

  var user = {
    "name": {
      "type": "string",
      "regex": /^[\w|\-|\.]+$/,
      "required": false
    }
  };

  var data = { "name": "" };

  var result = mschema.validate(data, user);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});
