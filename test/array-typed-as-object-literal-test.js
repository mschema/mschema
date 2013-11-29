var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - array of - object literal", function (t) {

  var blog = {
    "name": "string",
    "posts": [{
      "type": "string",
      "minLength": 3,
      "maxLength": 15
    }]
  };

  var data = {
    "name": "My Blog",
    "posts": ["a post", "another post", "third post"]
  };

  var result = mschema.validate(data, blog);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - invalid data - array of - object literal", function (t) {

  var blog = {
    "name": "string",
    "posts": [{
      "type": "string",
      "minLength": 3,
      "maxLength": 5
    }]
  };

  var data = {
    "name": "My Blog",
    "posts": ["a", "another post", "third post"]
  };

  var result = mschema.validate(data, blog);
  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 3);
  t.equal(result.errors[0].property, 'posts');
  t.equal(result.errors[0].constraint, 'minLength');
  t.equal(result.errors[0].value, 'a');
  t.equal(result.errors[0].expected, 3);
  t.equal(result.errors[0].actual, 1);
  t.ok(result, "data is invalid");
  t.end();

});


test("mschema.validate - mixed valid and invalid data - array of - object literal", function (t) {

  var blog = {
    "name": "string",
    "posts": [{
      "type": "string",
      "minLength": 3,
      "maxLength": 10
    }]
  };

  var data = {
    "name": "My Blog",
    "posts": ["a post", 2, false]
  };

  var result = mschema.validate(data, blog);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 2);
  
  t.equal(result.errors[0].property, 'posts');
  t.equal(result.errors[0].constraint, 'type');
  t.equal(result.errors[0].value, 2);
  t.equal(result.errors[0].expected, 'string');
  t.equal(result.errors[0].actual, 'number');

  t.equal(result.errors[1].property, 'posts');
  t.equal(result.errors[1].constraint, 'type');
  t.similar(result.errors[1].value, false);
  t.equal(result.errors[1].expected, 'string');
  t.equal(result.errors[1].actual, 'boolean');

  t.ok(result, "data is invalid");
  t.end();

});