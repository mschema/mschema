var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - nested constraints", function (t) {

  var user = {
    "name": "string",
    "age": "number",
    "address": {
      "street": "string",
      "city": "string",
      "zipcode": "string"
    }
  };

  var data = {
    "name": "Marak",
    "age": 42,
    "address": {
      "street": "123 elm street",
      "city": "Canada",
      "zipcode": "12345-01"
    }
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - invalid data - nested constraints", function (t) {

  var user = {
    "name": "string",
    "age": "number",
    "address": {
      "street": "string",
      "city": "string",
      "zipcode": {
        "type": "string",
        "required": true
      }
    }
  };

  var data = {
    "name": "Marak",
    "age": 42,
    "address": "not an object"
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, "address");
  t.equal(result.errors[0].constraint, "type");
  t.similar(result.errors[0].expected, "object");
  t.equal(result.errors[0].actual, "string");
  t.equal(result.errors[0].value, "not an object");
  t.ok(result, "data is invalid");

  t.end();

});

test("mschema.validate - invalid data - array", function (t) {

  var user = {
    "name": "string",
    "age": "number",
    "address": "object"
  };

  var data = {
    "name": "Marak",
    "age": 42,
    "address": []
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, "address");
  t.equal(result.errors[0].constraint, "type");
  t.similar(result.errors[0].expected, "object");
  t.equal(result.errors[0].actual, "array");
  t.equal(result.errors[0].value, data.address);
  t.ok(result, "data is invalid");

  t.end();

});
