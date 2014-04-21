define(["dojo/_base/declare", "dojo/_base/lang", "my/DependencyProperty"], function(declare, lang){
	
	var DependencyObject= declare(null, {
        constructor:function()
        {
            this.Initialize(); 
        },
 
        Initialize:function()
        { 

        } 
	});
	
	DependencyObject.prototype.getValue=function(dp){

          if (dp == null)
          { 
              throw new Error("dp");
          }

//          // Call Forwarded 
//          return this.GetValueEntry(
//                  LookupEntry(dp.GlobalIndex), 
//                  dp, 
//                  null,
//                  RequestFlags.FullyResolved).Value; 
          console.log("getValue(" + dp + ")");
          return "GetValue";
	};
	
	DependencyObject.prototype.setValue=function(dp, value){

        if (dp == null)
        { 
            throw new Error("dp");
        }

//        // Call Forwarded 
//        return this.GetValueEntry(
//                LookupEntry(dp.GlobalIndex), 
//                dp, 
//                null,
//                RequestFlags.FullyResolved).Value; 
    	console.log("setValue(" + dp + ',' + value +')');
	};
	
	return DependencyObject;
});