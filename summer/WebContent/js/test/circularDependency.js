// in "my/circularDependency.js"
require([ "a" ], function(a){
    a.stuff(); // "things", not "stuff"
});