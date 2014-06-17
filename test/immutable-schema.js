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
    "name": {
      description: 'name property',
      type     : 'string',
      required : true,
      minLength: 1
    }
  };

  var result = mschema.validate({}, user);
  t.equal(result.valid, false);
  
  var result = mschema.validate({ name: "" }, user);
  t.equal(result.valid, false);
  
  var result = mschema.validate({ name: "Marak" }, user);
  t.equal(result.valid, true);
  
  var result = mschema.validate({}, user);
  t.equal(result.valid, false);
  
  t.equal(user.name.required, true);
  t.ok(result, "data is valid");
  t.end();

});
