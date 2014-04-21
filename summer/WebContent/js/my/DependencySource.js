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

//using System; 
//using System.Threading;
//
//namespace System.Windows
//{ 
//    /// <summary>
//    ///     Represents dependency scope of an <see cref="Expression"/> 
//    /// </summary> 
//    /// <remarks>
//    ///     Expressions are responsible for propagating invalidation to 
//    ///     dependents when a property changes. The property that changes is
//    ///     known as the "source".
//    /// </remarks>
//    internal sealed class DependencySource 
//    {
//        /// <summary> 
//        ///     Dependency source construction 
//        /// </summary>
//        /// <param name="d">DependencyObject source</param> 
//        /// <param name="dp">Property source</param>
//        public DependencySource(DependencyObject d, DependencyProperty dp)
//        {
//            _d = d; 
//            _dp = dp;
//        } 
// 
//        /// <summary>
//        ///     DependencyObject source 
//        /// </summary>
//        public DependencyObject DependencyObject
//        {
//            get { return _d; } 
//        }
// 
//        /// <summary> 
//        ///     Property source
//        /// </summary> 
//        public DependencyProperty DependencyProperty
//        {
//            get { return _dp; }
//        } 
//
//        private DependencyObject _d; 
//        private DependencyProperty _dp; 
//    }
//} 
