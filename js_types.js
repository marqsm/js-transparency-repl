"use strict"

var NO_HINT     = 0,
    NUMBER_HINT = 1,
    STRING_HINT = 2;

function ToNumber(x) {
    return Number(x);
}

function ToString(y) {
    return String(y);
}

function NonStringToString(x) {
    return String(x);
}

function STRICT_EQUALS(x, y) {
    return x === y;
}

function IS_DATE(x) {
    return x instanceof Date;
}

function IS_SYMBOL(x) {
    return false;
}

function IS_STRING(x) { 
    return typeof x == "string";
}

function IS_BOOLEAN(x) {
    return typeof x == "boolean";
}

function IS_NULL_OR_UNDEFINED(x) {
    return (x == null);
}

function IS_NUMBER(x) {
    return (typeof x == "number");
}

function IS_SPEC_OBJECT(x) {
    // checks for function, object, array - should it be so, or just
    //return (x typeof "object")
    return (x instanceof Object)
}

function IS_SPEC_FUNCTION(x) {
    return (typeof(x) == "function")
}

// ECMA-262, section 8.6.2.6, page 28.
function DefaultNumber(x) {
  var valueOf = x.valueOf;
  if (IS_SPEC_FUNCTION(valueOf)) {
    var v = x.valueOf();
    if (IsPrimitive(v)) return v;
  }

  var toString = x.toString;
  if (IS_SPEC_FUNCTION(toString)) {
    var s = x.toString();
    if (IsPrimitive(s)) return s;
  }

  //throw %MakeTypeError('cannot_convert_to_primitive', []);
  throw 'TypeError: cannot_convert_to_primitive';
}

// ECMA-262, section 8.6.2.6, page 28.
function DefaultString(x) {
  var toString = x.toString;
  if (IS_SPEC_FUNCTION(toString)) {
    var s = x.toString()
    if (IsPrimitive(s)) return s;
  }

  var valueOf = x.valueOf;
  if (IS_SPEC_FUNCTION(valueOf)) {
    var v = x.valueOf()
    if (IsPrimitive(v)) return v;
  }

  //throw %MakeTypeError('cannot_convert_to_primitive', []);
  throw 'TypeError: cannot_convert_to_primitive';
}

function IsPrimitive(x) {
  // Even though the type of null is "object", null is still
  // considered a primitive value. IS_SPEC_OBJECT handles this correctly
  // (i.e., it will return false if x is null).
  if (typeof(x) == "string" || typeof(x) == "number" || x === null || typeof(x) == "boolean") {
    return true
  }
  return false
  //return !IS_SPEC_OBJECT(x);
}

function ToPrimitive(x, hint) {
  console.log('V8: Called ToPrimitive(' + x + ', ' + hint + ')');
  var _x = IS_STRING(x) ? '"' + x + '"' : x;
  if (typeof x == "object") _x = '(Object)';
  if (x instanceof Array) _x = x.length == 0 ? '[]' : '[' + x.toString() + ']';
  if (x instanceof Date) _x = '(Date)';
  if (x instanceof RegExp) _x = '(RegExp)';

  if (typeof(x) == "string") return x;
  // Normal behavior.
  if (!IS_SPEC_OBJECT(x)) return x;
  //if (IS_SYMBOL_WRAPPER(x)) throw MakeTypeError('symbol_to_primitive', []);
  if (hint == NO_HINT) hint = (IS_DATE(x)) ? STRING_HINT : NUMBER_HINT;
  if (hint == NUMBER_HINT) {
    console.log('V8: ToPrimitive: ' + _x + ' with hint: ' + hint + ' returns: "' + DefaultNumber(x) + '"');
  } else {
    console.log('V8: ToPrimitive: ' + _x + ' with hint: ' + hint + ' returns: "' + DefaultString(x) + '"');
  }
  return (hint == NUMBER_HINT) ? DefaultNumber(x) : DefaultString(x);
}

var StringEquals  = STRICT_EQUALS,
    NumberEquals  = STRICT_EQUALS,
    _ObjectEquals = STRICT_EQUALS;

// ECMA-262 Section 11.9.3.
function EQUALS(x, y) {
  if (IS_STRING(this) && IS_STRING(y)) return StringEquals(this, y);
  //var x = this;

  while (true) {
    if (IS_NUMBER(x)) {
      while (true) {
        if (IS_NUMBER(y)) return NumberEquals(x, y);
        if (IS_NULL_OR_UNDEFINED(y)) return false;  // not equal
        if (!IS_SPEC_OBJECT(y)) {
          // String or boolean.
          return NumberEquals(x, ToNumber(y));
        }
        y = ToPrimitive(y, NO_HINT);
      }
    } else if (IS_STRING(x)) {
      while (true) {
        if (IS_STRING(y)) return StringEquals(x, y);
        if (IS_SYMBOL(y)) return false;  // not equal
        if (IS_NUMBER(y)) return NumberEquals(ToNumber(x), y);
        if (IS_BOOLEAN(y)) return NumberEquals(ToNumber(x), ToNumber(y));
        if (IS_NULL_OR_UNDEFINED(y)) return false;  // not equal
        y = ToPrimitive(y, NO_HINT);
      }
    } else if (IS_SYMBOL(x)) {
      if (IS_SYMBOL(y)) return _ObjectEquals(x, y) ? true : false;
      return 1; // not equal
    } else if (IS_BOOLEAN(x)) {
      if (IS_BOOLEAN(y)) return _ObjectEquals(x, y) ? true : false;
      if (IS_NULL_OR_UNDEFINED(y)) return 1;
      if (IS_NUMBER(y)) return NumberEquals(ToNumber(x), y);
      if (IS_STRING(y)) return NumberEquals(ToNumber(x), ToNumber(y));
      if (IS_SYMBOL(y)) return false;  // not equal
      // y is object.
      x = ToNumber(x);
      y = ToPrimitive(y, NO_HINT);
    } else if (IS_NULL_OR_UNDEFINED(x)) {
      return IS_NULL_OR_UNDEFINED(y) ? true : false;
    } else {
      // x is an object.
      if (IS_SPEC_OBJECT(y)) {
        return _ObjectEquals(x, y) ? true : false;
      }
      if (IS_NULL_OR_UNDEFINED(y)) return false;  // not equal
      if (IS_SYMBOL(y)) return false;  // not equal
      if (IS_BOOLEAN(y)) y = ToNumber(y);
      x = ToPrimitive(x, NO_HINT);
    }
  }
}

var NumberAdd = function(x, y) {

    return x + y;
}
var _StringAdd = NumberAdd;

// ECMA-262, section 11.6.1, page 50.
function ADD(y, x) {
  console.log('ADD: ', x, y);
  // Fast case: Check for number operands and do the addition.
  if (IS_NUMBER(y) && IS_NUMBER(x)) {
    console.log('V8: ' + y + ' && ' + x + ' are numbers. Return NumberAdd(' + y + ',' + x + ')')
    return NumberAdd(y, x);
  }
  if (IS_STRING(y) && IS_STRING(x)) {
    console.log('V8: ' + y + ' && ' + x + ' are strings. Return StringAdd(' + x + ',' + x + ')')
    return _StringAdd(y, x);
  }

  // Default implementation.
  var a = ToPrimitive(y, NO_HINT);
  var b = ToPrimitive(x, NO_HINT);

  if (IS_STRING(a)) {
    console.log('V8: ' + a + ' is string. Return StringAdd(' + a + ', ToString(' + b + '))')
    return _StringAdd(a, ToString(b));
  } else if (IS_STRING(b)) {
    console.log('V8: ' + a + ' is string. Return StringAdd(ToString(' + a + '), ' + b + ')')
    return _StringAdd(NonStringToString(a), b);
  } else {
    console.log('V8: ' + a + ' && ' + b + ' are not strings or numbers. Return NumberAdd(ToNumber(' + a + '), ToNumber(' + b + '))')
    return NumberAdd(ToNumber(a), ToNumber(b));
  }
}
