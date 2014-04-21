/**
 * InheritablePropertyChangeInfo
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
//	struct
	var InheritablePropertyChangeInfo = declare("InheritablePropertyChangeInfo", null,{
		constructor:function( 
	            /*DependencyObject*/ rootElement,
	            /*DependencyProperty*/  property, 
	            /*EffectiveValueEntry*/ oldEntry,
	            /*EffectiveValueEntry*/ newEntry)
	    {
            this._rootElement = rootElement; 
            this._property = property;
            this._oldEntry = oldEntry; 
            this._newEntry = newEntry; 
	    },
	    
	});
	
	Object.defineProperties(InheritablePropertyChangeInfo.prototype,{
//	  	internal DependencyObject 
	  	RootElement:
        { 
            get:function() { return this._rootElement; } 
        },
 
//        internal DependencyProperty 
        Property:
        {
            get:function() { return this._property; }
        }, 

//        internal EffectiveValueEntry 
        OldEntry: 
        { 
            get:function() { return this._oldEntry; }
        }, 

//        internal EffectiveValueEntry 
        NewEntry:
        {
            get:function() { return this._newEntry; } 
        }
	});
	
	InheritablePropertyChangeInfo.Type = new Type("InheritablePropertyChangeInfo", InheritablePropertyChangeInfo, [Object.Type]);
	return InheritablePropertyChangeInfo;
});

//---------------------------------------------------------------------------- 
//
// File: InheritablePropertyChangeInfo.cs
//
// Description: 
//   This data-structure is used
//   1. As the data that is passed around by the DescendentsWalker 
//      during an inheritable property change tree-walk. 
//
// Copyright (C) by Microsoft Corporation.  All rights reserved. 
//
//---------------------------------------------------------------------------

using System; 

namespace System.Windows 
{ 
    /// <summary>
    ///     This is the data that is passed through the DescendentsWalker 
    ///     during an inheritable property change tree-walk.
    /// </summary>
    internal struct InheritablePropertyChangeInfo
    { 
        #region Constructors
 
        internal InheritablePropertyChangeInfo( 
            DependencyObject rootElement,
            DependencyProperty  property, 
            EffectiveValueEntry oldEntry,
            EffectiveValueEntry newEntry)
        {
            _rootElement = rootElement; 
            _property = property;
            _oldEntry = oldEntry; 
            _newEntry = newEntry; 
        }
 
        #endregion Constructors

        #region Properties
 
        internal DependencyObject RootElement
        { 
            get { return _rootElement; } 
        }
 
        internal DependencyProperty Property
        {
            get { return _property; }
        } 

        internal EffectiveValueEntry OldEntry 
        { 
            get { return _oldEntry; }
        } 

        internal EffectiveValueEntry NewEntry
        {
            get { return _newEntry; } 
        }
 
        #endregion Properties 

        #region Data 

        private DependencyObject _rootElement;
        private DependencyProperty  _property;
        private EffectiveValueEntry _oldEntry; 
        private EffectiveValueEntry _newEntry;
 
        #endregion Data 
    }
} 

