var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;

test("load mschema module", function (t) {
  mschema = require('../');
  t.ok(mschema, "mschema loaded");
  t.end();
});

// TODO:
return;
test("mschema.validate - valid data - constrained property - type - string", function (t) {

  var user = {
    "name": {
      description : 'name property',
      type        : 'string',
      default     : "Marak"
    }
  },
  data = {
  };

  var result = mschema.validate(data, user);
  t.equal(result.valid, true);
  t.type(data.name, "undefined");
  t.equal(result.instance.name, "Marak");
  t.end();

});
