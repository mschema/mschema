var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - { strict: false } - numbers as strings", function (t) {

  var missle = {
    "name": "string",
    "power": {
      "type": "string",
      "enum": ["high", "medium", "low"]
    },
    "warheads": {
      "type": "number",
      "min": 1,
      "max": 8
    }
  };

  var data = {
    "name": "small missle",
    "power": "low",
    "warheads": "5"
  };

  var validate = mschema.validate(data, missle, { strict: false });
  t.equal(validate.valid, true);
  t.equal(validate.instance.warheads, 5);
  t.end();

});

test("mschema.validate - { strict: true } - numbers as strings", function (t) {

  var missle = {
    "name": "string",
    "power": {
      "type": "string",
      "enum": ["high", "medium", "low"]
    },
    "warheads": {
      "type": "number",
      "min": 1,
      "max": 8
    }
  };

  var data = {
    "name": "small missle",
    "power": "low",
    "warheads": "5"
  };

  var validate = mschema.validate(data, missle, { strict: true });
  t.equal(validate.valid, false);
  t.equal(validate.errors.length, 1);
  t.equal(validate.errors[0].constraint, 'type');
  t.equal(validate.errors[0].actual, 'string');
  t.equal(validate.errors[0].expected, 'number');
  t.type(validate.instance.warheads, "string");
  t.end();

});