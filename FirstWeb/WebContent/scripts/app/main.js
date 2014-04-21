require([
    "mylibs/utils",
    "mylibs/palette"
], function(utils, palette) {

	// create a view model to control the sliders
	  viewModel = kendo.observable({
	    red: 0,
	    green: 0,
	    blue: 0,
	    update: function () {
	      // create a new color object
	      var color = kendo.Color.fromBytes(this.get("red"), this.get("green"), this.get("blue"));
	      
	      // change the color of the pallete
	      colors.color(color);
	      
	      // change the color of the page
	      utils.setBackground("#" + color.toHex());
	    },
	    color: "#fff"
	  });
	  
	  // bind the sliders to the view model
	  kendo.bind(document.body, viewModel);
	  
// 
//	  // function to handle the pallete color selection
//	  var setColor = function (e) {
//	    // the color object contains all the hex, rgba, and hsl
//	    // conversions and utilities
//	    var color = e.sender.color().toBytes();
//	    
//	    // set the color
//	    setBackground(e.value);
//	    
//	    // change the sliders by updating the view model
//	    viewModel.set("red", color.r);
//	    viewModel.set("blue", color.b);
//	    viewModel.set("green", color.g);
//	  };
	  
	  
	  
	  // select and create the color pallete
	  var colors = $("#colors").kendoFlatColorPicker({
	    change: palette.setColor,
	    value: "#fff"
	  }).getKendoFlatColorPicker();   
	  
	}

);