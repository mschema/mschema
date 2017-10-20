var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - constrained properties - string and number - required", function (t) {

  var user = {
    "name": {
      "type": "string",
      "required": true
    },
    "age": {
      "type": "number",
      "required": true
    }
  };

  var data = {
    "name": "Marak",
    "age": 42
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - missing data - constrained property - string and number - required", function (t) {

  var user = {
    "name": {
      "type": "string",
      "required": true
    },
    "age": {
      "type": "number",
      "required": true
    }
  };

  var data = {};

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 2);
  t.equal(result.errors[0].property, 'name');
  t.equal(result.errors[0].constraint, 'required');
  t.equal(result.errors[0].expected, true);
  t.equal(result.errors[0].actual, false);
  t.equal(result.errors[0].value, undefined);

  t.equal(result.errors[1].property, 'age');
  t.equal(result.errors[1].constraint, 'required');
  t.equal(result.errors[1].expected, true);
  t.equal(result.errors[1].actual, false);
  t.equal(result.errors[1].value, undefined);

  t.ok(result, "data is invalid");
  t.end();

});

test("mschema.validate - missing data - constrained property - string and number - implied required", function (t) {

  var user = {
    "name": "string",
    "age": "number"
  };

  var data = {};

  var result = mschema.validate(data, user);
  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - missing data - constrained property - string and number - implied required", function (t) {

  var user = {
    "name": "string",
    "age": {
      "type": "number"
    }
  };

  var data = {};

  var result = mschema.validate(data, user);
  console.log(result)
  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - non-required property - data missing", function (t) {

  var user = {
    "name": {
      "type": "string",
      "required": true
    },
    "age": { type: 'number', required: false }
  };

  var data = { name: "marak" };

  var result = mschema.validate(data, user);

  console.log(result)
  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();


});

test("mschema.validate - required property, default value - data missing", function (t) {

  var user = {
    "name": {
      "type": "string",
      "default": "bob",
      "required": true
    },
    "age": { type: 'number', required: false }
  };

  var data = { };

  var result = mschema.validate(data, user);

  t.equal(result.valid, true);
  t.equal(result.instance.name, 'bob')
  t.ok(result, "data is valid");
  t.end();

});




test("mschema.validate - required string property - empty string value", function (t) {

  var user = {
    "name": {
      "type": "string",
      "required": true
    },
    "password": {
      "type": "string",
      "required": true
    }
  };

  var data = { name: "bob", password: "" };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.ok(result, "data is invalid");
  t.end();

});


test("mschema.validate - required property, default value - null data", function (t) {

  var user = {
    "name": {
      "type": "string",
      "default": "bob",
      "required": true
    },
    "age": { type: 'number', required: false }
  };

  var data = { name: null, age: 20 };

  var result = mschema.validate(data, user);
  t.equal(result.valid, true);
  t.equal(result.instance.name, "bob")
  t.ok(result, "data is valid");
  t.end();

});