/**
 * BindingExpressionUncommonField
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var BindingExpressionUncommonField = declare("BindingExpressionUncommonField", UncommonField,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(BindingExpressionUncommonField.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	BindingExpressionUncommonField.Type = new Type("BindingExpressionUncommonField", 
			BindingExpressionUncommonField, [UncommonField.Type]);
	return BindingExpressionUncommonField;
});
//---------------------------------------------------------------------------- 
//
// <copyright file="BindingExpressionUncommonField.cs" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// Description: Defines an UncommonField of type BindingExpression. 
// 
//---------------------------------------------------------------------------
 
using System;
using System.Windows;
using System.Windows.Data;
 
namespace MS.Internal.Data
{ 
    /// <summary> 
    /// An UncommonField whose type is BindingExpression.
    /// </summary> 
    internal class BindingExpressionUncommonField : UncommonField<BindingExpression>
    {
        internal new void SetValue(DependencyObject instance, BindingExpression bindingExpr)
        { 
            base.SetValue(instance, bindingExpr);
            bindingExpr.Attach(instance); 
        } 

        internal new void ClearValue(DependencyObject instance) 
        {
            BindingExpression bindingExpr = GetValue(instance);
            if (bindingExpr != null)
            { 
                bindingExpr.Detach();
            } 
            base.ClearValue(instance); 
        }
    } 
}


