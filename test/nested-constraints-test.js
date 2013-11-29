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
      "zipcode": "string"
    }
  };

  var data = {
    "name": "Marak",
    "age": 42,
    "address": {
      "street": "123 elm street",
      "city": 42,
      "zipcode": "12345-01"
    }
  };

  var result = mschema.validate(data, user);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, 'city');
  t.equal(result.errors[0].constraint, 'type');
  t.similar(result.errors[0].expected, 'string');
  t.equal(result.errors[0].actual, "number");
  t.equal(result.errors[0].value, 42);
  t.ok(result, "data is invalid");
  t.end();

});

test("mschema.validate - valid data - complex nested constraints", function (t) {

  var schema = {
    "a": {
      "b": {
        "c": ["string"]
      }
    }
  };

  var data = {
    "a": {
      "b": {
        "c": ["x", "y", "z"]
      }
    }
  };

  var result = mschema.validate(data, schema);
  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - invalid data - complex nested constraints", function (t) {

  var schema = {
    "a": {
      "b": {
        "c": ["string"],
        "d": [{ "type": "number", "max": 42 }],
        "e": {
          "f": "string",
          "g": {
            "type": "number",
            "min": 5
          }
        }
      }
    }
  };

  var data = {
    "a": {
      "b": {
        "c": [42, {}, "z"],
        "d": [1, 5, 43],
        "e": {
          "f": "foo",
          "g": 4
        }
      }
    }
  };

  var result = mschema.validate(data, schema);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);

  t.equal(result.errors.length, 3);
  t.equal(result.errors[0].property, 'c');
  t.equal(result.errors[0].constraint, 'type');
  t.similar(result.errors[0].expected, 'string');
  t.equal(result.errors[0].actual, "number");
  t.equal(result.errors[0].value, 42);
  
  t.equal(result.errors[1].property, 'd');
  t.equal(result.errors[1].constraint, 'max');
  t.similar(result.errors[1].expected, 42);
  t.equal(result.errors[1].actual, 43);
  t.equal(result.errors[1].value, 43);

  t.equal(result.errors[2].property, 'g');
  t.equal(result.errors[2].constraint, 'min');
  t.similar(result.errors[2].expected, 5);
  t.equal(result.errors[2].actual, 4);
  t.equal(result.errors[2].value, 4);

  t.ok(result, "data is invalid");
  t.end();

});