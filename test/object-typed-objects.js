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

  var users = {
    "type": "object",
    "properties": {
      "name": "string",
      "age": "number",
      "address": {
        "street": "string",
        "city": "string",
        "zipcode": "string"
      }
    }
  };

  var data = {
    "user/marak": {
      "name": "Marak",
      "age": 42,
      "address": {
        "street": "123 elm street",
        "city": "Canada",
        "zipcode": "12345-01"
      }
    }
  };

  var result = mschema.validate(data, users);

  console.log(result)
  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});


test("mschema.validate - invalid data - nested constraints", function (t) {

  var users = {
    "type": "object",
    "properties": {
      "name": "string",
      "age": "number",
      "address": {
        "street": "string",
        "city": "string",
        "zipcode": "string"
      }
    }
  };

  var data = {
    "user/marak": {
      "name": "Marak",
      "age": 42,
      "address": {
        "street": 123,
        "city": "Canada",
        "zipcode": "12345-01"
      }
    }
  };

  var result = mschema.validate(data, users);

  console.log(result)
  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, "street");
  t.equal(result.errors[0].constraint, "type");
  t.similar(result.errors[0].expected, "string");
  t.equal(result.errors[0].actual, "number");
  t.equal(result.errors[0].value, 123);
  t.ok(result, "data is invalid");

  t.end();

});
