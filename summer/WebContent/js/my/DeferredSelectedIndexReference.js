/**
 * DeferredSelectedIndexReference
 */

define(["dojo/_base/declare", "system/Type", "windows/DeferredReference"], 
		function(declare, Type, DeferredReference){
	var DeferredSelectedIndexReference = declare("DeferredSelectedIndexReference", DeferredReference,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(DeferredSelectedIndexReference.prototype,{
		  
	});
	
	Object.defineProperties(DeferredSelectedIndexReference,{
		  
	});
	
	DeferredSelectedIndexReference.Type = new Type("DeferredSelectedIndexReference", 
			DeferredSelectedIndexReference, [DeferredReference.Type]);
	return DeferredSelectedIndexReference;
});




//---------------------------------------------------------------------------- 
//
// File: DeferredSelectedIndexReference.cs
//
// Copyright (C) Microsoft Corporation.  All rights reserved. 
//
// Description: Proxy object passed to the property system to delay load 
//              Selector.SelectedIndex values. 
//
//--------------------------------------------------------------------------- 

using System.Windows.Controls.Primitives;

namespace System.Windows.Controls 
{
    // Proxy object passed to the property system to delay load Selector.SelectedIndex 
    // values. 
    internal class DeferredSelectedIndexReference : DeferredReference
    { 
        //-----------------------------------------------------
        //
        //  Constructors
        // 
        //-----------------------------------------------------
 
        #region Constructors 

        internal DeferredSelectedIndexReference(Selector selector) 
        {
            _selector = selector;
        }
 
        #endregion Constructors
 
        //------------------------------------------------------ 
        //
        //  Internal Methods 
        //
        //-----------------------------------------------------

        #region Internal Methods 

        // Does the real work to calculate the current SelectedIndexProperty value. 
        internal override object GetValue(BaseValueSourceInternal valueSource) 
        {
            return _selector.InternalSelectedIndex; 
        }

        // Gets the type of the value it represents
        internal override Type GetValueType() 
        {
            return typeof(int); 
        } 

        #endregion Internal Methods 

        //------------------------------------------------------
        //
        //  Private Fields 
        //
        //------------------------------------------------------ 
 
        #region Private Fields
 
        // Selector mapped to this object.
        private readonly Selector _selector;

        #endregion Private Fields 
     }
} 

