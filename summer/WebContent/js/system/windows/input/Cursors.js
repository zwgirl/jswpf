/**
 * Cursors
 */
define(["dojo/_base/declare"], function(declare){

    var Cursors=declare("Cursors", null,{ 
    });	
    
    Object.defineProperties(Cursors, {
    	Default:{
    		get:function() {
    			return "default";
    		}
    	},
    	Auto:{
    		get:function() {
    			return "auto";
    		}
    	},
    	Crosshair:{
    		get:function() {
    			return "crosshair";
    		}
    	},
    	Pointer:{
    		get:function() {
    			return "pointer";
    		}
    	},
    	Move:{
    		get:function() {
    			return "move";
    		}
    	},
    	E_resize:{
    		get:function() {
    			return "e-resize";
    		}
    	},
    	NE_resize:{
    		get:function() {
    			return "ne-resize";
    		}
    	},
    	NW_resize:{
    		get:function() {
    			return "nw-resize";
    		}
    	},
    	N_resize:{
    		get:function() {
    			return "n-resize";
    		}
    	},
    	SE_resize:{
    		get:function() {
    			return "se-resize";
    		}
    	},
    	SW_resize:{
    		get:function() {
    			return "sw-resize";
    		}
    	},
    	S_resize:{
    		get:function() {
    			return "s-resize";
    		}
    	},
    	W_resize:{
    		get:function() {
    			return "w-resize";
    		}
    	},
    	Text:{
    		get:function() {
    			return "text";
    		}
    	},
    	Wait:{
    		get:function() {
    			return "wait";
    		}
    	},
//    	Help:"help"
    });
    
    return Cursors;
});