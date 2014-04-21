/**
 * EntryIndex
 */

define(["dojo/_base/declare", "system/Type", "windows/Expression"], function(declare, Type, Expression){
	var EntryIndex = declare(Expression,{
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
	
	Object.defineProperties(EntryIndex.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	EntryIndex.Type = new Type("EntryIndex", EntryIndex, [Expression.Type]);
	return EntryIndex;
});

/****************************************************************************\ 
*
* File: TemplateBindingExpression.cs
*
*  Expression to represent a TemplateBindingExtension during editing of a 
*  template.
* 
* Copyright (C) 2005 by Microsoft Corporation.  All rights reserved. 
*
\***************************************************************************/ 

using System;
using System.ComponentModel;
using System.Windows; 
using System.Windows.Data;
using System.Windows.Markup; 
 
namespace System.Windows
{ 

    /// <summary>
    /// A TemplateBinding is used in templates (e.g. ControlTemplate).  When the content of
    /// a template is instantiated for inspection, the template bindings are represented with 
    ///  a TemplateBindingExpression.  (In this case, the expression returns the property's default
    /// value.) 
    /// </summary> 

    [TypeConverter(typeof(TemplateBindingExpressionConverter))] 
    public class TemplateBindingExpression : Expression
    {
        private TemplateBindingExtension _templateBindingExtension;
 
        internal TemplateBindingExpression( TemplateBindingExtension templateBindingExtension )
        { 
            _templateBindingExtension = templateBindingExtension; 
        }
 

        /// <summary>
        /// Constructor for TemplateBindingExpression
        /// </summary> 
        public TemplateBindingExtension TemplateBindingExtension
        { 
            get { return _templateBindingExtension; } 
        }
 

        /// <summary>
        ///     Called to evaluate the Expression value
        /// </summary> 
        /// <param name="d">DependencyObject being queried</param>
        /// <param name="dp">Property being queried</param> 
        /// <returns>Computed value. Default (of the target) if unavailable.</returns> 
        internal override object GetValue(DependencyObject d, DependencyProperty dp)
        { 
            return dp.GetDefaultValue(d.DependencyObjectType);
        }

 
    }
 
 
}