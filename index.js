var mschema = {};

mschema.types = {
  "string": function (val) {
    return typeof val === "string";
  },
  "number": function (val) {
    return typeof val === "number";
  },
  "boolean": function (val) {
    return typeof val === "boolean";
  },
  "object": function (val) {
    return typeof val === "object";
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

var validate = mschema.validate = function (_data, _schema, options) {

  var result = { valid: true, instance: {} },
      errors = [],
      options = options || {};

  if (typeof options.strict === "undefined") {
    options.strict = true;
  }

  if (typeof _schema !== 'object') {
    return 'schema contains no properties, cannot validate';
  }

  function _parse (data, schema) {

    // iterate through properties and compare values to types
    for (var propertyName in schema) {

      // extract property type
      var property = schema[propertyName];

      // extract corresponding data value
      var value = data[propertyName];

      function parseConstraint (property, value) {

        if (typeof property === "string" && (property === 'string' || property === 'number' || property === 'object' || property === 'array' || property === 'boolean' || property === 'any')) {
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
          if (typeof value === "string" && (property === "number" || property.type === "number")) {
            _value = parseInt(data[propertyName], 10);
            if (_value.toString() !== "NaN") {
              // a non NaN number was parsed, assign it as validation value and to instance value
              value = _value;
              data[propertyName] = value;
            }
          }
          // determine if any incoming data might need to be changed from an html checkbox into a boolean
          if (typeof value === "string" && (property === "boolean" || property.type === "boolean")) {
            if (value === "on") {
              value = true;
            }
            if (value === "off") {
              value = false;
            }
            if (typeof value === "undefined") {
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
              actual: typeof value,
              value: value,
              message: 'Invalid value for properties'
            });
            return;
          }
          return;
        }

        if (typeof value === "object") {
          _parse(value, property);
          return;
        } else {

          if (nested === true) {

            if (property.required === true && typeof value !== 'object') {
              errors.push({
                property: propertyName,
                constraint: 'type',
                expected: "object",
                actual: typeof value,
                value: value,
                message: 'Invalid value for object type'
              });
            }

            if (property.required !== true && typeof value !== 'object') {

              if (typeof value === 'undefined') {
                value = {};
                data[propertyName] = {};
              } else {
                errors.push({
                  property: propertyName,
                  constraint: 'type',
                  expected: "object",
                  actual: typeof value,
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
                checkConstraint(propertyName, constraint, property[constraint], value, errors);
              }
            } else {
              checkConstraint(propertyName, constraint, property[constraint], value, errors);
            }
          }
        }

      }

      // TODO: remove this check and instead create object literal to represent array type
      // { type: 'array', required: false }
      // if the property is an array, assume it has a single value of either string or object type
      if (Array.isArray(property) === true) {
        /* TODO: can we remove this commented out line?
        if (typeof value === "undefined") {
          continue;
        }
        */
        // if the array has more then one element, it is most likely a syntax error in the schema definition from the user
        if (property.length > 1) {
          errors.push({
            property: property,
            constraint: 'type',
            expected: "Single element array",
            actual: value.length + " element array",
            value: value.toString(),
            message: 'Typed arrays can only be of one type'
          });
        }

        // check if the value provided is an array
        if (!Array.isArray(value)) {
          if (typeof value === "undefined") {
            value = [];
          } else {
            // if the value provided is not an array, validation fails
            errors.push({
              property: propertyName,
              constraint: 'type',
              expected: "array",
              actual: typeof value,
              value: value,
              message: 'Value is not an array'
            });
          }
          continue;
        }
        // iterate through every value in the array check and for validity
        if (property.length === 0) {
          continue;
        } else {
          value.forEach(function(item){
            parseConstraint(property[0], item);
          });
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

var checkConstraint = mschema.checkConstraint = function (property, constraint, expected, value, errors) {

  switch (constraint) {

    case 'type':
      if (!mschema.types[expected](value)) {
        errors.push({
          property: property,
          constraint: 'type',
          value: value,
          expected: expected,
          actual: typeof value,
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
          message: 'Value execeed max of property'
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