var mschema = require('../');

// see '/tests' folder for alternate syntax and examples

var blog = {
  "name": "string",
  "posts": [{"title": { "type": "string", "maxLength": 15 }, "author": "string", "content": "string" }]
};

var data = {
  "name": "My blog",
  "posts": [{
    "title": "An example blog post",
    "author": "Marak",
    "content": "This is an example blog post"
  }]
}

console.log(mschema.validate(blog, data));