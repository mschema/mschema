var mschema = {};

mschema.types = {
  "string": function (val) {
    return typeof val === "string";
  },
  "number": function (val) {
    return typeof val === "number";
  },
  "integer": function (val) {
    return typeof val === "number" && val % 1 === 0;
  },
  "boolean": function (val) {
    return typeof val === "boolean";
  },
  "object": function (val) {
    return type(val) === 'object';
  },
  "array": function (val) {
    return type(val) === 'array';
  },
  "any": function (val) {
    return true;
  },
  "file": function (val) {
    // TODO: add binary file detection
    return true;
  }
};

mschema.define = function (_schema) {
  return new Schema(_schema);
};

var validate = mschema.validate = function (_data, _schema, options, cb) {

  var result = { valid: true, instance: {} },
      errors = [],
      options = options || {};

  if (typeof options.strict === "undefined") {
    options.strict = true;
  }

  if (typeof _schema !== 'object') {
    return {
      valid: false,
      message: 'schema is not an object, cannot validate'
    }
  }

  function _parse (data, schema) {

    var types = Object.keys(mschema.types)

    // iterate through properties and compare values to types
    for (var propertyName in schema) {

      // extract property type
      var property = schema[propertyName];

      // extract corresponding data value
      var value = data[propertyName];

      function parseConstraint (property, value) {

        // auto-types on string values ( will turn "foo": "string" into { type: "string", required: false }), etc
        if (typeof property === "string" && (types.indexOf(property) !== -1)) {
          property = {
            "type": property,
            "required": false
          };
        }

        // if value is undefined and a default value is specified
        if (typeof property.default !== 'undefined' && typeof value === 'undefined' || value === null) {
          // assign default value
          value = property.default;
          data[propertyName] = value;
        }

        if (options.strict === false) {
          var _value;
          // determine if any incoming data might need to be changed from a string number into a Number type
          if (typeof value === "string" && property.type === "number") {
            _value = +value;
            if (_value.toString() !== "NaN") {
              value = _value;
              data[propertyName] = value;
            }
          }
          if (typeof value === "string" && property.type === "integer") {
            _value = parseInt(value, 10);
            if (_value.toString() !== "NaN") {
              value = _value;
              data[propertyName] = value;
            }
          }
          // undefined values for boolean should be considered false
          if (property.type === 'boolean' && typeof value === 'undefined') {
            value = false;
            data[propertyName] = value;
          }
          // determine if any incoming data might need to be changed from an html checkbox into a boolean
          if (typeof value === "string" && (property.type === "boolean")) {
            if (value === "on") {
              value = true;
            }
            if (value === "off") {
              value = false;
            }
            data[propertyName] = value;
          }

        }

        // check if it's value is required but undefined in value
        if (property.required && (value === null || value === undefined || value.length === 0)) {
          errors.push({
            property: propertyName,
            constraint: 'required',
            expected: true,
            actual: false,
            value: value,
            message: 'Required value is missing'
          });
          // if the value is required and missing, don't check for any other constraints
          return;
        }

        if (typeof property === 'object') {
          // determine if we are at the end of the branch ( constraints ), or simply another nested property
          var nested = false;
          for (var p in property) {
            if (typeof property[p] === 'object' && p !== 'enum' && p!== 'regex') { // enum and regex properties are a special case since they accept array / object as values
              nested = true;
            }
          }
          if(!nested) {
            property.required = false;
          }
        }


        // if an undefined value has been sent to a non-required property,
        // ignore the property and continue the validation
        if (value === undefined && property.required === false) {
          return;
        }

        if (typeof property.regex === 'object') {
          var re = property.regex,
              result;

          if (property.required === false && value.length === 0) {
            return;
          }

          result = re.exec(value);
          if (result === null) {
            errors.push({
              property: propertyName,
              constraint: 'regex',
              expected: property.regex,
              actual: value,
              value: value,
              message: 'Regex does not match string'
            });
            return;
          }
        }

        if (propertyName === "properties") {
          if(typeof data === "object") {
            Object.keys(data).forEach(function(key){
              _parse(data[key], property);
            });
            return;
          } else {
            errors.push({
              property: propertyName,
              constraint: 'type',
              expected: "object",
              actual: type(value),
              value: value,
              message: 'Invalid value for properties'
            });
            return;
          }
          return;
        }

        if (type(value) === "object") {
          _parse(value, property);
          return;
        } else {

          if (nested === true) {

            if (property.required === true && type(value) !== 'object') {
              errors.push({
                property: propertyName,
                constraint: 'type',
                expected: "object",
                actual: type(value),
                value: value,
                message: 'Invalid value for object type'
              });
            }

            if (property.required !== true && type(value) !== 'object') {

              if (typeof value === 'undefined') {
                value = {};
                data[propertyName] = {};
              } else {
                errors.push({
                  property: propertyName,
                  constraint: 'type',
                  expected: "object",
                  actual: type(value),
                  value: value,
                  message: 'Invalid value for object type'
                });
              }
            }

            return;
          }

          for (var constraint in property) {
            if (typeof property[constraint] === "object") {
              if (typeof value === 'object') {
                _parse(value, property);
                return;
              } else {
                checkConstraint(propertyName, constraint, property[constraint], value, data, errors);
              }
            } else {
              checkConstraint(propertyName, constraint, property[constraint], value, data, errors);
            }
          }
        }

      }

      // if the property is an array, its contents define the array typed property
      if (Array.isArray(property) === true) {
        property = {
          type: 'array',
          required: false,
          items: property.length <= 1 ? (property[0] || 'any') : property
        };
      }

      if (property.type === 'array') {
        // if we've hit an undefined value, just make it an empty array
        if (property.required !== true && typeof value === 'undefined') {
          value = [];
        }
       if (!Array.isArray(value)) {
            // if the value provided is not an array, validation fails
            errors.push({
              property: propertyName,
              constraint: 'type',
              expected: "array",
              actual: type(value),
              value: value,
              message: 'Value is not an array'
            });
            continue;
        } else {
          // each item corresponds to a member of a tuple
          if (Array.isArray(property.items)) {
            if (property.items.length !== value.length) {
              errors.push({
                property: propertyName,
                constraint: 'length',
                expected: property.items.length,
                actual: value.length,
                value: value,
                message: 'Value length does not match'
              });
            }
            property.items.forEach(function(item, index){
              parseConstraint(item, value[index]);
            });
          } else {
            if (typeof property.minItems === 'number' && value.length < property.minItems) {
              errors.push({
                property: propertyName,
                constraint: 'minItems',
                expected: property.minItems,
                actual: value.length,
                value: value,
                message: 'Array has too few items'
              });
            }
            if (typeof property.maxItems === 'number' && value.length > property.maxItems) {
              errors.push({
                property: propertyName,
                constraint: 'maxItems',
                expected: property.maxItems,
                actual: value.length,
                value: value,
                message: 'Array has too many items'
              });
            }

            // iterate through every value in the array check and for validity
            value.forEach(function(item){
              parseConstraint(property.items, item);
            });
          }
        }
      }
      else { // if property is not of type Array
        parseConstraint(property, value);
      }
    }

  }

  // create a clone of the schema so the original schema passed is not modifed by _parse()
  var schemaCopy = {};
  schemaCopy = clone(_schema);

  // if the incoming data is not an object or function, assume its a single value and create a single keyed object to represent it
  if (typeof _data !== "object" && typeof _data !== 'function') {
    _data = {
      key: _data
    };
    schemaCopy = {
      key: schemaCopy
    }
  }
  _parse(_data, schemaCopy);

  // TODO: clone data to fix immutable data issue
  // see: /test/immutable-data.js
  //  var dataCopy = clone(_data);
  // _parse(dataCopy, schemaCopy);

  result.instance = _data;

  if (errors.length > 0) {
    result.valid = false;
  }

  result.errors = errors;
  return result;
};

var checkConstraint = mschema.checkConstraint = function (property, constraint, expected, value, data, errors) {

  switch (constraint) {

    case 'type':
      if (!mschema.types[expected](value)) {
        errors.push({
          property: property,
          constraint: 'type',
          value: value,
          expected: expected,
          actual: type(value),
          message: 'Type does not match'
        });
      }
    break;

    case 'minLength':
      if (expected > value.length) {
        errors.push({
          property: property,
          constraint: 'minLength',
          value: value,
          expected: expected,
          actual: value.length,
          message: 'Value was below minLength of property'
        });
      }
    break;

    case 'maxLength':
      if (expected <= value.length) {
        errors.push({
          property: property,
          constraint: 'maxLength',
          value: value,
          expected: expected,
          actual: value.length,
          message: 'Value exceeded maxLength of property'
        });
      }
    break;

    case 'min':
      if (expected > value) {
        errors.push({
          property: property,
          constraint: 'min',
          expected: expected,
          actual: value,
          value: value,
          message: 'Value was below min of property'
        });
      }
    break;

    case 'max':
      if (expected < value) {
        errors.push({
          property: property,
          constraint: 'max',
          expected: expected,
          actual: value,
          value: value,
          message: 'Value exceed max of property'
        });
      }
    break;

    case 'enum':
      if (expected.indexOf(value) === -1) {
        errors.push({
          property: property,
          constraint: 'enum',
          expected: expected,
          actual: value,
          value: value,
          message: 'Value is not part of enum set'
        });
      }
    break;

    case 'conform':
      if (typeof expected !== 'function') {
        errors.push({
          property: property,
          constraint: 'conform',
          expected: 'function',
          actual: type(expected),
          value: value,
          message: 'conform property must be function'
        });
      } else {
        var _value = expected(value, data);
        if (_value !== true && _value !== false) {
          errors.push({
            property: property,
            constraint: 'conform',
            expected: 'boolean',
            actual: _value,
            value: value,
            message: 'conform function must return true or false'
          });
          return;
        }
        if (_value !== true) {
          errors.push({
            property: property,
            constraint: 'conform',
            expected: true,
            actual: _value,
            value: value,
            message: 'Value does not conform to function'
          });
        }
      }
    break;


    default:
      // console.log('missing constraint - ' + constraint);
    break;

  }

};

function clone (obj, copy) {
  if (obj == null || typeof obj != "object") {
    return obj;
  }
  if (obj.constructor != Object && obj.constructor != Array) {
    return obj;
  }
  if (obj.constructor == Date || obj.constructor == RegExp || obj.constructor == Function ||
      obj.constructor == String || obj.constructor == Number || obj.constructor == Boolean) {
    return new obj.constructor(obj);
  }
  copy = copy || new obj.constructor();
  for (var name in obj) {
    copy[name] = typeof copy[name] == "undefined" ? clone(obj[name], null) : copy[name];
  }
  return copy;
}

function type (val) {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}

function Schema (_schema) {
  if (!(this instanceof Schema)) {
    return new Schema(_schema);
  }
  this._schema = _schema;
}

Schema.prototype.validate = function (_data, options) {
  return mschema.validate(_data, this._schema, options);
};

module['exports'] = mschema;
