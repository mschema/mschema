var mschema = require('../');

// see '/tests' folder for alternate syntax and examples

var userSchema = {
  "name": {
    "type": "string",
    "minLength": 5,
    "maxLength": 20,
    "required": true
  },
  "password": {
    "type": "string",
    "minLength": 8,
    "maxLength": 64
  },
  "email": "string"
}

var user = {
  "name": "Marak",
  "password": "atleasteight",
  "email": "foo@bar.com"
}

// validates true
console.log(mschema.validate(user, userSchema));

var invalidUser = {
  "name": "M",
  "password": "1234",
  "email": "foo@bar.com"
}

// validates false with errors
console.log(mschema.validate(invalidUser, userSchema));

