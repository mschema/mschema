var mschema = require('../');

// see '/tests' folder for alternate syntax and examples

var address = {
  "street": "string",
  "city": "string",
  "zipcode": "string"
}

var user = {
  "name": "string",
  "age": "number",
  "address": address // uses mschema linking a property named "address" will be matched later
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

// validates true
var validate = mschema.validate(data, user, { "address": address }); // pass the separate address schema to be mapped to address
console.log(validate);

var badData = {
  "name": "Marak",
  "age": 42,
  "address": {
    "street": "123 elm street",
    "city": 123,
    "zipcode": "12345-01"
  }
};

// validates false with errors
var validate = mschema.validate(badData, user, { "address": address }); // pass the separate address schema to be mapped to address
console.log(validate)