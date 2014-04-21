// in "org.summer/view/control/Control.js"
define(["dojo/_base/declare", "dojo/_base/lang", "org/summer/view/FrameworkElement"], function(declare, lang, FrameworkElement){
  return declare(null, {
    name: "Anonymous",
    age: null,
    residence: "Universe A",

    constructor: function(/*Object*/ kwArgs){
      lang.mixin(this, kwArgs);
    },

    moveTo: function(/*String*/ residence){
      this.residence = residence;
    }
  });
});