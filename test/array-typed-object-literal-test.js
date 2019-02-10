var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

test("mschema.validate - valid data - array - object literal", function (t) {

 var blog = {
    "name": "string",
    "posts": {
      "type": "array",
      "items": "string"
    }
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

test("mschema.validate - invalid data - array - object literal", function (t) {

  var blog = {
     "name": "string",
     "posts": {
       "type": "array",
       "items": "string",
       "minItems": 1
     },
     "tags": {
       "type": "array",
       "items": "string",
       "maxItems": 3
     }
   };

   var data = {
     "name": "My Blog",
     "posts": [],
     "tags": ["lol", "cringe", "gross", "orange"]
   };

   var result = mschema.validate(data, blog);
   t.equal(result.valid, false);
   t.type(result.errors, Array)
   t.type(result.errors, Object);
   t.equal(result.errors.length, 2);
   t.equal(result.errors[0].property, 'posts');
   t.equal(result.errors[0].constraint, 'minItems');
   t.equal(result.errors[0].value, data.posts);
   t.equal(result.errors[0].expected, 1);
   t.equal(result.errors[0].actual, 0);
   t.equal(result.errors[1].property, 'tags');
   t.equal(result.errors[1].constraint, 'maxItems');
   t.equal(result.errors[1].value, data.tags);
   t.equal(result.errors[1].expected, 3);
   t.equal(result.errors[1].actual, 4);
   t.ok(result, "data is invalid");
   t.end();

 });

test("mschema.validate - multiple array types in one array - valid data - object literal", function (t) {

  var point = {
    "name": {
      "type": "string"
    },
    "coords": {
      "type": "array",
      "required": true,
      "items": [{
        "type": "number",
        "min": -90,
        "max": 90
      }, {
        "type": "number",
        "min": -180,
        "max": 180
      }]
    }
  };

  var data = {
    "name": "missle base",
    "coords": [42.544, -118.534]
  };

  var result = mschema.validate(data, point);

  t.equal(result.valid, true);
  t.ok(result, "data is valid");

  t.end();
});

test("mschema.validate - multiple array types in one array - invalid data - object literal", function (t) {

  var point = {
    "name": {
      "type": "string"
    },
    "coords": {
      "type": "array",
      "required": true,
      "items": [{
        "type": "number",
        "min": -90,
        "max": 90
      }, {
        "type": "number",
        "min": -180,
        "max": 180
      }]
    }
  };

  var data = {
    "name": "missle base",
    "coords": [500]
  };

  var result = mschema.validate(data, point);

  t.equal(result.valid, false);
  t.equal(result.errors.length, 2);
  t.equal(result.errors[0].message, 'Value length does not match');
  t.equal(result.errors[1].message, 'Value exceed max of property');
  t.ok(result, "data is invalid");
  t.end();
});
