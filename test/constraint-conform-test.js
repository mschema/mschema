var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - constrained properties - conform", function (t) {

  var user = {
    "name": {
      "type": "string",
      "required": true
    },
    "age": {
      "type": "number",
      "required": true
    },
    "isTall": {
      "type": "any",
      "required": true,
      "conform": function (val) {
        if (val === 1) {
          return true;
        }
        if (val === "yes" || val === "y" || val === "Y" || val === "Yes" || val === "YES") {
          return true;
        }
        return false;
      }
    }
  };

  var data = {
    "name": "Marak",
    "age": 42,
    "isTall": "Y"
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - invalid data - constrained properties - conform", function (t) {

  var user = {
    "name": {
      "type": "string",
      "required": true
    },
    "age": {
      "type": "number",
      "required": true
    },
    "isTall": {
      "type": "any",
      "required": true,
      "conform": function (val) {
        if (val === 1) {
          return true;
        }
        if (val === "yes" || val === "y" || val === "Y" || val === "Yes" || val === "YES") {
          return true;
        }
        return false;
      }
    }
  };

  var data = {
    "name": "Marak",
    "age": 42,
    "isTall": "No"
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);

  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, 'isTall');
  t.equal(result.errors[0].constraint, 'conform');
  t.equal(result.errors[0].expected, true);
  t.equal(result.errors[0].actual, false);
  t.equal(result.errors[0].message, 'Value does not conform to function');
  t.ok(result, "data is invalid");
  t.end();

});

test("mschema.validate - invalid expected function - constrained properties - conform", function (t) {

  var user = {
    "name": {
      "type": "string",
      "required": true
    },
    "age": {
      "type": "number",
      "required": true
    },
    "isTall": {
      "type": "any",
      "required": true,
      "conform": "not-a-function"
    }
  };

  var data = {
    "name": "Marak",
    "age": "not-a-number",
    "isTall": "No"
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 2);
  t.equal(result.errors[0].property, 'age');
  t.equal(result.errors[0].constraint, 'type');
  t.equal(result.errors[0].expected, 'number');
  t.equal(result.errors[0].actual, 'string');
  t.equal(result.errors[0].message, 'Type does not match');

  t.equal(result.errors[1].property, 'isTall');
  t.equal(result.errors[1].constraint, 'conform');
  t.equal(result.errors[1].expected, 'function');
  t.equal(result.errors[1].actual, 'string');
  t.equal(result.errors[1].value, 'No');
  t.equal(result.errors[1].message, 'conform property must be function');

  t.ok(result, "data is invalid");
  t.end();

});

test("mschema.validate - undefined return - constrained properties - conform", function (t) {

  var user = {
    "name": {
      "type": "string",
      "required": true
    },
    "age": {
      "type": "number",
      "required": true
    },
    "isTall": {
      "type": "any",
      "required": true,
      "conform": function (val) {
        // no value is returned
      }
    }
  };

  var data = {
    "name": "Marak",
    "age": "not-a-number",
    "isTall": "No"
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 2);
  t.equal(result.errors[0].property, 'age');
  t.equal(result.errors[0].constraint, 'type');
  t.equal(result.errors[0].expected, 'number');
  t.equal(result.errors[0].actual, 'string');
  t.equal(result.errors[0].message, 'Type does not match');

  t.equal(result.errors[1].property, 'isTall');
  t.equal(result.errors[1].constraint, 'conform');
  t.equal(result.errors[1].actual, undefined);
  t.equal(result.errors[1].value, 'No');
  t.equal(result.errors[1].message, 'conform function must return true or false');

  t.ok(result, "data is invalid");
  t.end();

});