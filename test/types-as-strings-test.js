var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - constrained property - type - string", function (t) {

  var user = {
    "name": "string",
    "age": "number",
    "address": "object",
    "isActive": "boolean",
    "meta": "any"
  };

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

  var result = mschema.validate(data, user);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();
});

test("validate invalid data based on simple schema with properties", function (t) {

  var user = {
     "name": "string",
     "age": "number",
     "address": "object",
     "isActive": "boolean"
   };

  var data = {
    "name": 100,
    "age": "abc",
    "address": "not an object",
    "isActive": "not a boolean"
  };

  var result = mschema.validate(data, user);
  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);

  t.equal(result.errors.length, 4);

  t.equal(result.errors[0].property, 'name');
  t.equal(result.errors[0].constraint, 'type');
  t.equal(result.errors[0].value, 100);
  t.equal(result.errors[0].expected, 'string');
  t.equal(result.errors[0].actual, 'number');

  t.equal(result.errors[1].property, 'age');
  t.equal(result.errors[1].constraint, 'type');
  t.equal(result.errors[1].value, 'abc');
  t.equal(result.errors[1].expected, 'number');
  t.equal(result.errors[1].actual, 'string');

  t.equal(result.errors[2].property, 'address');
  t.equal(result.errors[2].constraint, 'type');
  t.equal(result.errors[2].value, 'not an object');
  t.equal(result.errors[2].expected, 'object');
  t.equal(result.errors[2].actual, 'string');

  t.equal(result.errors[3].property, 'isActive');
  t.equal(result.errors[3].constraint, 'type');
  t.equal(result.errors[3].value, 'not a boolean');
  t.equal(result.errors[3].expected, 'boolean');
  t.equal(result.errors[3].actual, 'string');

  t.ok(result, "data is invalid");
  t.end();

});