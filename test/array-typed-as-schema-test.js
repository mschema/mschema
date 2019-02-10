var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - constraint - array of objects", function (t) {

  var blog = {
    "name": "string",
    "posts": [{
        "title": {
          "type": "string",
          "minLength": 3,
          "maxLength": 15
        },
        "content": {
          "type": "string",
          "minLength": 3,
          "maxLength": 15
        }
    }]
  };

  var data = {
    "name": "My Blog",
    "posts": [{ "title": "a post", "content": "some content"}]
  };

  var result = mschema.validate(data, blog);
  t.equal(result.valid, true);
  t.ok(result, "data is valid");
  t.end();

});

test("mschema.validate - invalid data - constraint - array of objects", function (t) {

  var blog = {
    "name": "string",
    "posts": [{
        "title": {
          "type": "string",
          "minLength": 3,
          "maxLength": 15
        },
        "content": {
          "type": "string",
          "minLength": 3,
          "maxLength": 15
        }
    }]
  };

  var data = {
    "name": "My Blog",
    "posts": [{ "title": "a", "content": "way too much content in here"}]
  };

  var result = mschema.validate(data, blog);

  t.equal(result.valid, false);
  t.type(result.errors, Array)
  t.type(result.errors, Object);

  t.equal(result.errors.length, 2);
  t.equal(result.errors[0].property, 'title');
  t.equal(result.errors[0].constraint, 'minLength');
  t.equal(result.errors[0].value, 'a');
  t.equal(result.errors[0].expected, 3);
  t.equal(result.errors[0].actual, 1);

  t.equal(result.errors[1].property, 'content');
  t.equal(result.errors[1].constraint, 'maxLength');
  t.equal(result.errors[1].value, 'way too much content in here');
  t.equal(result.errors[1].expected, 15);
  t.equal(result.errors[1].actual, 28);

  t.ok(result, "data is invalid");
  t.end();

});