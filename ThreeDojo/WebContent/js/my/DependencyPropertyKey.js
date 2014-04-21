define(["dojo/_base/declare", "dojo/_base/lang","DependencyProperty"],  
		function(declare, lang, DependencyProperty) {
	var DependencyPropertyKey= define(null, {
		 /// <summary>
        ///     The DependencyProperty associated with this access key.  This key
        /// does not authorize access to any other property.
        /// </summary>

 
        constructor:function(/*DependencyProperty*/ dp)
        {
            this._dp = dp;
        },
  
        /// <summary>
        ///     Override the metadata of a property that is already secured with
        /// this key.
        /// </summary>
        /*public void */OverrideMetadata:function( /*Type*/ forType, /*PropertyMetadata*/ typeMetadata )
        {
            if( this._dp == null )
            {
                throw new Error("InvalidOperationException");
            }
  
            this._dp.OverrideMetadata( forType, typeMetadata, this );
        },
 
        // This is not a property setter because we can't have a public
        //  property getter and a property setter on the same property.
        /*void */SetDependencyProperty:function(/*DependencyProperty*/ dp)
        {
//            Debug.Assert(_dp==null,"This should only be used when we need a placeholder and have a temporary value of null. It should not be used to change this property.");
            this._dp = dp;
        }
	});
	
	Object.defineProperties(DependencyPropertyKey.prototype,{
        /*public DependencyProperty */DependencyProperty:
        {
            get:function()
            {
                return this._dp;
            }
        }
	});
	return DependencyPropertyKey;
});