// A dependency-free port of dojox.json.query
// http://livedocs.dojotoolkit.org/dojox/json/query

(function() {

var _map = function(a, f) { return a.map(f); }

var _filter = function(a, f) { return a.filter(f); }

var _slice = function(obj, start, end, step) {
  // handles slice operations: [3:6:2]
  var len = obj.length, results = [];
  end = end || len;
  start = (start < 0) ? Math.max(0, start+len) : Math.min(len, start);
  end = (end < 0) ? Math.max(0, end+len) : Math.min(len, end);
  for (var i=start; i<end; i+=step) {
    results.push(obj[i]);
  }
  return results;
};


var _find = function(obj, name) {
  // handles ..name, .*, [*], [val1, val2], [val]
  // name can be a property to search for, undefined
  // for full recursive, or an array for picking by index
  var results = [];
  function walk(obj) {
    if (name) {
      if (name === true && !(obj instanceof Array)) {
        //recursive object search
        results.push(obj);
      } else if (obj[name]) {
        // found the name, add to our results
        results.push(obj[name]);
      }
    }
    for (var i in obj) {
      var val = obj[i];
      if (!name) {
        // if we don't have a name we are just getting
        // all the properties values (.* or [*])
        results.push(val);
      } else if (val && typeof val == 'object') {
        walk(val);
      }
    }
  }
  if (name instanceof Array) {
    // this is called when multiple items are in the brackets: [3,4,5]
    if (name.length === 1) {
      // this can happen as a result of the parser becoming confused
      // about commas in the brackets like [@.func(4,2)]. Fixing the
      // parser would require recursive analysis, very expensive,
      // but this fixes the problem nicely.
      return obj[name[0]];
    }
    for (var i = 0; i < name.length; i++) {
      results.push(obj[name[i]]);
    }
  } else{
    // otherwise we expanding
    walk(obj);
  }
  return results;
};

var _distinctFilter = function(array, callback) {
  // does the filter with removal of duplicates in O(n)
  var outArr = [];
  var primitives = {};
  for (var i = 0, l = array.length; i < l; ++i) {
    var value = array[i];
    if (callback(value, i, array)) {
      if ((typeof value == 'object') && value) {
        // with objects we prevent duplicates with a marker property
        if (!value.__included) {
          value.__included = true;
          outArr.push(value);
        }
      } else if (!primitives[value + typeof value]) {
        // with primitives we prevent duplicates by putting it in a map
        primitives[value + typeof value] = true;
        outArr.push(value);
      }
    }
  }
  for (i = 0, l = outArr.length; i < l; ++i) {
    // cleanup the marker properties
    if (outArr[i]) {
      delete outArr[i].__included;
    }
  }
  return outArr;
};

// summary:
//  Performs a JSONQuery on the provided object and returns the results.
//  If no object is provided (just a query), it returns a "compiled"
//  function that evaluates objects according to the provided query.
// query:
//  Query string
// obj:
//  Target of the JSONQuery
// description:
//  JSONQuery provides a comprehensive set of data querying tools
//  including filtering, recursive search, sorting, mapping, range
//  selection, and powerful expressions with wildcard string
//  comparisons and various operators. JSONQuery generally supersets
//  JSONPath and provides syntax that matches and behaves like
//  JavaScript where possible.
//
//  JSONQuery evaluations begin with the provided object, which can
//  referenced with $. From the starting object, various operators
//  can be successively applied, each operating on the result of the
//  last operation.
//
//  Supported Operators
//  --------------------
//
//  - .property - This will return the provided property of the object,
//     behaving exactly like JavaScript.
//  - [expression] - This returns the property name/index defined by
//     the evaluation of the provided expression, behaving exactly like
//     JavaScript.
//  - [?expression] - This will perform a filter operation on an array,
//     returning all the items in an array that match the provided
//     expression. This operator does not need to be in brackets, you
//     can simply use ?expression, but since it does not have any
//     containment, no operators can be used afterwards when used
//     without brackets.
//  - [^?expression] - This will perform a distinct filter operation on
//     an array. This behaves as [?expression] except that it will
//     remove any duplicate values/objects from the result set.
//  - [/expression], [\expression], [/expression, /expression] - This
//     performs a sort operation on an array, with sort based on the
//     provide expression. Multiple comma delimited sort expressions can
//     be provided for multiple sort orders (first being highest priority).
//     / indicates ascending order and \ indicates descending order
//  - [=expression] - This performs a map operation on an array, creating
//     a new array with each item being the evaluation of the expression
//     for each item in the source array.
//  - [start:end:step] - This performs an array slice/range operation,
//     returning the elements from the optional start index to the optional
//     end index, stepping by the optional step number.
//  - [expr, expr] - This a union operator, returning an array of all
//     the property/index values from the evaluation of the comma delimited
//     expressions.
//  - .* or [*] - This returns the values of all the properties of the
//     current object.
//  - $ - This is the root object, If a JSONQuery expression does not
//     being with a $, it will be auto-inserted at the beginning.
//  - @ - This is the current object in filter, sort, and map expressions.
//     This is generally not necessary, names are auto-converted to
//     property references of the current object in expressions.
//  - ..property - Performs a recursive search for the given property
//     name, returning an array of all values with such a property name
//     in the current object and any subobjects
//  - expr = expr - Performs a comparison (like JS's ==). When comparing to
//     a string, the comparison string may contain wildcards *
//     (matches any number of characters) and ? (matches any single
//     character).
//  - expr ~ expr - Performs a string comparison with case insensitivity.
//  - ..[?expression] - This will perform a deep search filter operation
//    on all the objects and subobjects of the current data. Rather than
//    only searching an array, this will search property values, arrays,
//    and their children.
//  - $1,$2,$3, etc. - These are references to extra parameters passed
//    to the query function or the evaluator function.
//  - +, -, /, *, &, |, %, (, ), <, >, <=, >=, != - These operators behave
//    just as they do in JavaScript.
//
//  | query(queryString, object)
//  and
//  | query(queryString)(object)
//  always return identical results. The first one immediately evaluates,
//  the second one returns a function that then evaluates the object.
//
// example:
//  | query("foo",{foo:"bar"})
//  This will return "bar".
//
// example:
//  | evaluator = query("?foo='bar'&rating>3");
//  This creates a function that finds all the objects in an array with a property
//  foo that is equals to "bar" and with a rating property with a value greater
//  than 3.
//  | evaluator([{foo:"bar", rating:4},{foo:"baz", rating:2}])
//  This returns:
//  | {foo:"bar", rating:4}
//
// example:
//  | evaluator = query("$[?price<15.00][\rating][0:10]");
//  This finds objects in array with a price less than 15.00 and sorts then
//  by rating, highest rated first, and returns the first ten items in from this
//  filtered and sorted list.

var _compile = function(query) {
  var depth = 0;
  var str = [];
  // sanitize: remove newlines and tabs.
  query = query.replace(/\s/g, ' ')
  // sanitize: prohibit nonascii characters.
  query.replace(/[^\x20-\x7f]/, function(t) {
    throw new Error("Prohibited unescaped character " +
        t.charCodeAt(0).toString(16));
  });
  // temporarily remove quoted strings for easier regexp processing
  query = query.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|[\[\]]/g, function(t) {
    // keep track of bracket depth
    depth += t == '[' ? 1 : t == ']' ? -1 : 0;
    return (
      // mark all the inner brackets as skippable
      (t == ']' && depth > 0) ? '`]' :
      // and replace all the strings with `number
      (t.charAt(0) == '"' || t.charAt(0) == "'") ? "`" + (str.push(t) - 1) :
      t
    );
  });
  var prefix = '';
  function call(name) {
    // creates a function call and puts the expression so far in a
    // parameter for a call
    prefix = name + "(" + prefix;
  }
  function makeRegex(t, a, b, c, d, e, f, g) {
    // creates a regular expression matcher for when wildcards and
    // ignore case is used
    return str[g].match(/[\*\?]/) || f == '~' ?
      "/^" +
      // Strip quotes
      str[g].substring(1, str[g].length-1)
      // Backslash escape nonalphanumeric and specials
      .replace(/\\([btnfr\\"'])|([^\w\*\?])/g,"\\$1$2")
      // Convert * to \w* and ? to \w?
      .replace(/([\*\?])/g,"[\\w\\W]$1")
      // Use case-insensitive matching if requested
      + (f == '~' ? '$/i' : '$/') + ".test(" + a + ")" :
      // Do normal exact test.
      t;
  }
  // Prohibit comments
  query.replace(/\/\/|\/\*|\*\//, function() {
    throw new Error("Comments prohibited");
  });
  // Prohibit calls of functions that may mutate objects
  query.replace(
    /(\]|\)|push|pop|shift|splice|sort|reverse|watch|copyWithin|fill)\s*\(/,
    function() {
      throw new Error("Unsafe function call");
    });

  // change the equals to comparisons except operators ==, <=, >=
  query = query.replace(/([^<>=]=)([^=])/g, "$1=$2")
  // find leading variable names and qualify by ____.
  query = query.replace(/@|(\.\s*)?[a-zA-Z_\$][\w\$]*(\s*:)?/g, function(t) {
      // Prohibit unsafe property name access
      if (/^\.?\s*(constructor|__.*__)$/.test(t)) {
        throw new Error("Unsafe property access");
      }
      return (
        // leave .prop alone
        t.charAt(0) == '.' ? t :
        // @ is an explicit reference to the current object
        t === '@' ? "____" :
        // leave prop: alone; and expose true/false/null/Math/$.
        t.match(/:|^(\$[1-9]?|Math|true|false|null)$/) ? t :
        // plain names should be properties of root...
        "____." + t
      );
    });
  // push bracketed subexpressions into closures
  query = query .replace(/\.?\.?\[(`\]|[^\]])*\]|\?.*|\.\.([\w\$_]+)|\.\*/g,
      function(t, a, b) {
        // [?expr] and ?expr and [=expr and =expr
        var oper = t.match(/^\.?\.?(\[\s*\^?\?|\^?\?|\[\s*==)(.*?)\]?$/);
        if (oper) {
          var prefix = '';
          if (t.match(/^\./)) {
            // recursive object search
            call("_find");
            prefix = ", true)";
          }
          call(
            // map, filter, and distinct-filter operators
            oper[1].match(/\=/) ? "_map" :
            oper[1].match(/\^/) ? "_distinctFilter" :
            "_filter"
          );
          return prefix + ", function(____) {return " + oper[2] + "})";
        }
        // [/sortexpr,\sortexpr]
        oper = t.match(/^\[\s*([\/\\].*)\]/);
        if (oper) {
          // copy the array and then sort it using the sorting expression
          return ".concat().sort(function(a, b) {" + oper[1]
            .replace(/\s*,?\s*([\/\\])\s*([^,\\\/]+)/g, function(t, a, b) {
              // FIXME: Should check to make sure the ____ token isn't
              // followed by characters
              return "var av= " + b.replace(/\b____\b/,"a") +
                     ", bv= " + b.replace(/\b____\b/,"b") +
              "; if (av>bv||bv==null) {return " + (a == "/" ? 1 : -1) +";}\n" +
              "if (bv>av||av==null) {return " + (a == "/" ? -1 : 1) +";}\n";
          }) + "return 0;})";
        }
        // array index [3] or slice [0:10:2]
        oper = t.match(/^\[(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)\]/);
        if (oper) {
          call("_slice");
          return "," + (oper[1] || 0) +
                 "," + (oper[2] || 0) + "," + (oper[3] || 1) + ")";
        }
        // ..prop and [*]
        if (t.match(/^\.\.|\.\*|\[\s*\*\s*\]|,/)) {
          call("_find");
          return (t.charAt(1) ==
            // ..prop
            '.' ? ",'" + b + "'" :
            // [prop1, prop2]
            t.match(/,/) ?  "," + t :
            // [*]
            "") + ")";
        }
        // unknown; leave it.
        return t;
      });
  // do wildcard and case-insensitive matching
  query = query.replace(
    /(\b____\s*((\.\s*[\w_$]+\s*)|(\[\s*`([0-9]+)\s*`\]))*)(==|~)\s*`([0-9]+)/g,
    makeRegex);
  // and deal with reverse order matching
  query = query.replace(
    /`([0-9]+)\s*(==|~)\s*(____\s*((\.\s*[\w_$]+)|(\[\s*`([0-9]+)\s*`\]))*)/g,
    function(t, a, b, c, d, e, f, g) {
      return makeRegex(t, c, d, e, f, g, b, a);
    });
  query = prefix +
     (query.charAt(0) == '$' ? "" : "$") +
     query.replace(/`([0-9]+|\])/g, function(t, a) {
      // restore the strings
      return a == ']' ? ']' : str[a];
    });
  // create a function within this scope (so it can use expand and slice)
  return "1&&function($,$1,$2,$3,$4,$5,$6,$7,$8,$9) {var ____=$; return " +
      query + "}";
};

var query = function(query, obj) {
  var executor = eval(_compile(query));
  for (var i = 0; i<arguments.length-1; i++) {
    arguments[i] = arguments[i+1];
  }
  return obj ? executor.apply(this, arguments) : executor;
};

query.compile = _compile;

if (module && module.exports) {
  module.exports = query;
} else if (define && define.amd) {
  define(function() { return query; });
} else {
  this.jsonquery = query;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);
