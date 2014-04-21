/**
 * DependencySource
 */

define(["dojo/_base/declare", "system/Type"], 
        function(declare, Type){
	var DependencySource = declare("DependencySource", null,{
		constructor:function( /*DependencyObject*/ d, /*DependencyProperty*/ dp)
        {
            this._d = d; 
            this._dp = dp;
        } 
	});
	
	Object.defineProperties(DependencySource.prototype,{
        /// <summary>
        ///     DependencyObject source 
        /// </summary>
//        public DependencyObject 
        DependencyObject:
        {
            get:function() { return this._d; } 
        },
 
        /// <summary> 
        ///     Property source
        /// </summary> 
//        public DependencyProperty 
        DependencyProperty:
        {
            get:function() { return this._dp; }
        } 
	});
	
	DependencySource.Type = new Type("DependencySource", DependencySource, [Object.Type]);
	return DependencySource;
});
