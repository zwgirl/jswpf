// in "org.summer/view/control/TextBox.js"
define(["dojo/_base/declare", "dojo/_base/lang", "org/summer/view/controls/Control"], function(declare, lang, Control){
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