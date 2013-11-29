var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - array of - string", function (t) {

  var blog = {
    "name": "string",
    "posts": ["string"]
  };

  var data = {
    "name": "My Blog",
    "posts": ["first post", "another post", "third post"]
  };

  var result = mschema.validate(data, blog);
  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - invalid data - array of - string", function (t) {

  var blog = {
    "name": "string",
    "posts": ["string"]
  };

  var data = {
    "name": "My Blog",
    "posts": "first post"
  };

  var result = mschema.validate(data, blog);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  t.equal(result.errors[0].property, 'posts');
  t.equal(result.errors[0].constraint, 'type');
  t.equal(result.errors[0].value, 'first post');
  t.equal(result.errors[0].expected, 'array');
  t.equal(result.errors[0].actual, 'string');
  t.ok(result, "data is invalid");
  t.end();
});

test("mschema.validate - mixed invalid and valid data - array of - string", function (t) {

  var blog = {
    "name": "string",
    "posts": ["string"]
  };

  var data = {
    "name": "My Blog",
    "posts": ["first post", 2, {}]
  };

  var result = mschema.validate(data, blog);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);
  t.equal(result.errors.length, 1);
  
  t.equal(result.errors[0].property, 'posts');
  t.equal(result.errors[0].constraint, 'type');
  t.equal(result.errors[0].value, 2);
  t.equal(result.errors[0].expected, 'string');
  t.equal(result.errors[0].actual, 'number');

  t.ok(result, "data is invalid");
  t.end();

});