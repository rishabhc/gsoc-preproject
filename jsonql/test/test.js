var jsonql = require('../src/jsonql');
var assert = require('assert');

var testData= {
  store: {
    "book": [
      {
        "category":"reference",
        "author":"Nigel Rees",
        "title":"Sayings of the Century",
        "price":8.95
      },
      {
        "category":"fiction",
        "author":"Evelyn Waugh",
        "title":"Sword of Honour",
        "price":12.99
      },
      {
        "category":"fiction",
        "author":"Herman Melville",
        "title":"Moby Dick",
        "isbn":"0-553-21311-3",
        "price":8.99
      },
      {
        "category":"fiction",
        "author":"J. R. R. Tolkien",
        "title":"The Lord of the\nRings",
        "isbn":"0-395-19395-8",
        "price":22.99
      }
    ],
    "bicycle": {
        "color":"red",
        "price":19.95
    }
  },
  "symbols":{"@.$;":5}
};

function testBattery(a) {
  a.map(function(test) {
    console.log(' ', test.name);
    test.runTest.apply(test);
  });
}

testBattery(
  [
    {
      name: "$.store.book[=author]",
      runTest: function() {
        var result = jsonql(this.name,testData);
        result = JSON.stringify(result);
        var success =  '["Nigel Rees","Evelyn Waugh","Herman Melville","J. R. R. Tolkien"]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..author",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '["Nigel Rees","Evelyn Waugh","Herman Melville","J. R. R. Tolkien"]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.*",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success = '[[{"category":"reference","author":"Nigel Rees","title":"Sayings of the Century","price":8.95},{"category":"fiction","author":"Evelyn Waugh","title":"Sword of Honour","price":12.99},{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99},{"category":"fiction","author":"J. R. R. Tolkien","title":"The Lord of the\\nRings","isbn":"0-395-19395-8","price":22.99}],{"color":"red","price":19.95}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store..price",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success = '[8.95,12.99,8.99,22.99,19.95]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..book[0]?price=22.99",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[{"category":"fiction","author":"J. R. R. Tolkien","title":"The Lord of the\\nRings","isbn":"0-395-19395-8","price":22.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..book[0]?price>=20",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[{"category":"fiction","author":"J. R. R. Tolkien","title":"The Lord of the\\nRings","isbn":"0-395-19395-8","price":22.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..book[0][-1:]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[{"category":"fiction","author":"J. R. R. Tolkien","title":"The Lord of the\\nRings","isbn":"0-395-19395-8","price":22.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..book[0][0,1]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[{"category":"reference","author":"Nigel Rees","title":"Sayings of the Century","price":8.95},{"category":"fiction","author":"Evelyn Waugh","title":"Sword of Honour","price":12.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..book[0][:2]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[{"category":"reference","author":"Nigel Rees","title":"Sayings of the Century","price":8.95},{"category":"fiction","author":"Evelyn Waugh","title":"Sword of Honour","price":12.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.book[=category][^?true]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '["reference","fiction"]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..[^?author~'herman melville']",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,[testData,testData]));
        var success =  '[{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..[^?author='Herman*']",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,[testData,testData]));
        var success =  '[{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..[^?@['author']='Herman*']",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,[testData,testData]));
        var success =  '[{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..book[0][?(@.isbn)]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99},{"category":"fiction","author":"J. R. R. Tolkien","title":"The Lord of the\\nRings","isbn":"0-395-19395-8","price":22.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..book[0][?(@.price<10)]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[{"category":"reference","author":"Nigel Rees","title":"Sayings of the Century","price":8.95},{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..book[0]?author=$1&price=$2",
      runTest: function() {
        var query = jsonql(this.name);
        var result = JSON.stringify(query(testData,"Nigel Rees",8.95));
        var success =  '[{"category":"reference","author":"Nigel Rees","title":"Sayings of the Century","price":8.95}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..book[0]?author=$1&price=$2",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData,"Herman Melville",8.99));
        var success =  '[{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..book[0][?(@['price']<10)]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[{"category":"reference","author":"Nigel Rees","title":"Sayings of the Century","price":8.95},{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$..[?price<10]",
      runTest: function() {
        var query = jsonql(this.name);
        var result = JSON.stringify(query(testData));
        var success =  '[{"category":"reference","author":"Nigel Rees","title":"Sayings of the Century","price":8.95},{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store..[?price<10]",
      runTest: function() {
        var query = jsonql(this.name);
        var result = JSON.stringify(query(testData));
        var success =  '[{"category":"reference","author":"Nigel Rees","title":"Sayings of the Century","price":8.95},{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.book[/category][/price][=price]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[8.95,8.99,12.99,22.99]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.book[\\category,\\price][=price]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[8.95,22.99,12.99,8.99]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.book?title='*of the*'",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[{"category":"reference","author":"Nigel Rees","title":"Sayings of the Century","price":8.95},{"category":"fiction","author":"J. R. R. Tolkien","title":"The Lord of the\\nRings","isbn":"0-395-19395-8","price":22.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.book[?'?iction'=category][=price]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[12.99,8.99,22.99]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.book[?'?ICTion'~category][=price]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[12.99,8.99,22.99]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.book[\\price][0].price - $.store.book[/price][0].price",
      runTest: function() {
        var result = jsonql(this.name,testData);
        var success =  14;
        assert.equal(success,Math.round(result));
      }
    },
    {
      name: "$.symbols[*]",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success =  '[5]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.symbols['@.$;']",
      runTest: function() {
        var result = JSON.stringify(jsonql(this.name,testData));
        var success = '5';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.book[?(@.price<15)][1:3]",
      runTest: function() {
        var result = JSON.stringify(jsonql("$.store.book[?(@.price<15)][1:3]",testData));
        var success = '[{"category":"fiction","author":"Evelyn Waugh","title":"Sword of Honour","price":12.99},{"category":"fiction","author":"Herman Melville","title":"Moby Dick","isbn":"0-553-21311-3","price":8.99}]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.book[?(@.price<15)][=author]",
      runTest: function() {
        var result = JSON.stringify(jsonql("$.store.book[?(@.price<15)][=author]",testData));
        var success = '["Nigel Rees","Evelyn Waugh","Herman Melville"]';
        assert.equal(success,result);
      }
    },
    {
      name: "$.store.book[1].category",
      runTest: function() {
        var result = JSON.stringify(jsonql("$.store.book[1].category",testData));
        var success = '"fiction"';
        assert.equal(success,result);
      }
    },
    {
      name: "test $.store.bicycle",
      runTest: function() {
        var result = JSON.stringify(jsonql("$.store.bicycle",testData));
        var success = '{"color":"red","price":19.95}';
        assert.equal(success,result);
      }
    },
    {
      name: "test $.store.book[=category]",
      runTest: function() {
        var result = JSON.stringify(jsonql("$.store.book[=category]",testData));
        var success = '["reference","fiction","fiction","fiction"]';
        assert.equal(success,result);
      }
    },
    {
      name: "safeEval: Illegal Eval",
      runTest: function() {
        var safe = true, ex = null;
        try {
          var result = JSON.stringify(jsonql("$.store.book[?(push(5))]",testData));
          safe = false;
        } catch(e) {
          ex = e;
        }
        assert(safe);
        assert(ex, "Illegal eval permitted");
      }
    },
    {
      name: "safeEval: Illegal Eval 2",
      runTest: function() {
        var safe = true, ex = null;
        try {
          var result = JSON.stringify(jsonql("$.store.book[?(new Danger)]",testData ));
          safe = false;
        } catch(e) {
          ex = e;
        }
        assert(safe);
        assert(ex, "Illegal eval permitted");
      }
    },
    {
      name: "safeEval: Illegal Eval 3",
      runTest: function() {
        var safe = true, ex = null;
        try {
          var result = JSON.stringify(jsonql("$.store.book[?(@+=2)]",testData));
          safe = false;
        } catch(e) {
          ex = e;
        }
        assert(safe);
        assert(ex, "Illegal eval permitted");
      }
    }

  ]
);

function performanceTest(){
  var data = [];
  for(var c = 0; c < 200000; ++c) {
    data.push({foo:Math.random()});
  }
  var now = new Date().getTime();
  for (var n = 0; n < 20; ++n) {
    results = jsonql("$[?(@.foo < 0.0" + n + ")]",data);
  }
  console.log("query time, " + c + " items " + (new Date().getTime()-now) / n  + "ms");
}

performanceTest();

