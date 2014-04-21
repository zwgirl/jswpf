define(["dojo/_base/declare", "dojo/_base/lang","DependencyProperty", "DependencyObject"],  
		function(declare, lang,DependencyProperty) {
	var DependencySource = deflare(null,{
		constructor:function(d,dp){
            this._d = d; 
            this._dp = dp;
		}
		
	});
	
	Object.defineProperties(DependencySource.prototype,{
        /// <summary>
        ///     DependencyObject source 
        /// </summary>
        /*public DependencyObject */DependencyObject:
        {
            get:function() { return this._d; } 
        },
 
        /// <summary> 
        ///     Property source
        /// </summary> 
        /*public DependencyProperty */DependencyProperty:
        {
            get:function() { return this._dp; }
        } 
	});
	
	return DependencySource;
});
 