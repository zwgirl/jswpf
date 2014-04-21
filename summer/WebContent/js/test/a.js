// in "my/a.js"
define([ "test/b" ], function (b){
//    var b = null;
//
//    // note the inline require within our module definition
//    require([ "test/b" ], function (b1) {
//        b = b1;
//     });
//
//    // we can still return a module
//    return {
//        stuff: function(){
//            return b.useStuff ? "stuff" : "things";
//        }
//    };
    
    var a = {};
    a.stuff = function(){
        return b.useStuff ? "stuff" : "things";
    };
 
    return a;
});

