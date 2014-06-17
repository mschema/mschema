# mschema

<img src="https://travis-ci.org/mschema/mschema.svg?branch=master"/>

A concise schema language for describing the structure of JSON data

## Features

 - simple intuitive syntax
 - schemas are JSON
 - schemas can be linked using `require()`

### See Also

 - mschema-rpc(http://github.com/mschema/mschema-rpc)

### Install with npm

     npm install mschema

### Install with [component](https://github.com/component/component)

    component install mschema/mschema

## Example

*see '/test' folder for alternate syntax and examples*

```js

var mschema = require('mschema');

var user = {
  "name": {
    "type": "string",
    "minLength": 5,
    "maxLength": 20
  },
  "password": {
    "type": "string",
    "minLength": 8,
    "maxLength": 64
  },
  "email": "string"
}

var data = {
  "name": "Marak",
  "password": "atleasteight",
  "email": "foo@bar.com"
}

// validates true
var result = mschema.validate(data, user);
console.log(result);

var data = {
  "name": "M",
  "password": "1234",
  "email": "foo@bar.com"
}

// validates false with errors
var result = mschema.validate(data, user);
console.log(result);

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
};

// validates true
var result = mschema.validate(data, blog);
console.log(result);
```

# API

### mschema.validate(data, schema)

### data
the data to be validated

### schema
the schema to validate the data against

# Usage

see: `/examples` and `/test` folders for additional usage

### Type assignment as string

```json
 {
   "name": "string",
   "age": "number",
   "address": "object",
   "isActive": "boolean"
 }
```

### Type assignment as an object literal

```json
{ 
  "id": {
    "type": "string",
    "minLength": 5,
    "maxLength": 10
  }
}
```

### Nesting Types

```json
{ 
  "name": "string",
  "password": "string",
  "address": {
    "street": "string",
    "city": "string",
    "country": "string"
  }
}
```

## Typed arrays

### Generic types

```json
{ "posts": ["string"] }
```

### Typed with constraints

```json
{ "posts": [{ "type": "string", "minLength": 5, "maxLength": 10 }] }
```

### Array of objects

```js
{ "posts": [{
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
```

## Linking Schemas

Schemas can be linked together using JS

```js

var address = {
  "street": "string",
  "city": "string",
  "zipcode": "string"
}

var user = {
  "name": "string",
  "age": "number",
  "address": address

var data = {
  "name": "Marak",
  "age": 42,
  "address": {
    "street": "123 elm street",
    "city": "Canada",
    "zipcode": "12345-01"
  }
};

var validate = mschema.validate(data, user); 

// validates to true

```

## Relation to JSON-Schema

JSON-Schema was designed to the specifications of [XML-Schema](http://en.wikipedia.org/wiki/XML_schema), which was designed to express [Document Type Definitions](http://en.wikipedia.org/wiki/Document_Type_Definition).

Simply put: JSON-Schema has a lot of functionality that most developers don't need or want. The complexity of JSON-Schema makes it difficult to use and hard to build tools for.

### Key differences between mschema and JSON-Schema

mschema has...

- Brevity of syntax 
- Less features
- JavaScript Support