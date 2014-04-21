// in "org.summer/view/FrameworkElement.js"
define(["dojo/_base/declare", "dojo/_base/lang", "org/summer/view/UIElement"], function(declare, lang, UIElement){
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