/**
 * SortDescription
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var SortDescription = declare("SortDescription", null,{
		constructor:function(/*string*/ propertyName, /*ListSortDirection*/ direction) 
        { 
            if (direction != ListSortDirection.Ascending && direction != ListSortDirection.Descending)
                throw new InvalidEnumArgumentException("direction", direction, typeof(ListSortDirection)); 

            this._propertyName = propertyName;
            this._direction = direction;
            this._sealed = false; 
        },
        
        /// <summary> Override of Object.Equals </summary> 
//        public override bool 
        Equals:function(/*object*/ obj) 
        {
            return (obj instanceof SortDescription) ? (this == obj) : false; 
        },
 
        /// <summary> Override of Object.GetHashCode </summary> 
//        public override int 
        GetHashCode:function()
        { 
            var result = this.Direction.GetHashCode();
            if (this.PropertyName != null)
            {
                result = this.PropertyName.GetHashCode() + result;
            }
            return result; 
        }, 
 
//        internal void 
        Seal:function()
        {
            this._sealed = true;
        } 
	});
	
	Object.defineProperties(SortDescription.prototype,{
		/// <summary> 
        /// Property name to sort by.
        /// </summary>
//        public string 
        PropertyName:
        { 
            get:function() { return this._propertyName; },
            set:function(value) 
            { 
                if (this._sealed)
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SortDescription")); 

                this._propertyName = value;
            }
        },

        /// <summary> 
        /// Sort direction. 
        /// </summary>
//        public ListSortDirection 
        Direction: 
        {
            get:function() { return this._direction; },
            set:function(value)
            { 
                if (_sealed)
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SortDescription")); 
 
                if (value < ListSortDirection.Ascending || value > ListSortDirection.Descending)
                    throw new InvalidEnumArgumentException("value", value, typeof(ListSortDirection)); 

                this._direction = value;
            }
        }, 

        /// <summary> 
        /// Returns true if the SortDescription is in use (sealed). 
        /// </summary>
//        public bool 
        IsSealed: 
        {
            get:function() { return this._sealed; }
        }
	});
	
	SortDescription.Type = new Type("SortDescription", SortDescription, [Object.Type]);
	return SortDescription;
});

//---------------------------------------------------------------------------- 
//
// <copyright file="SortDescription.cs" company="Microsoft">
//    Copyright (C) 2003 by Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// 
// Description: Defines property and direction to sort. 
//
// See spec at http://avalon/connecteddata/M5%20Specs/IDataCollection.mht 
//
// History:
//  06/02/2003 : [....] - Created
// 
//---------------------------------------------------------------------------
 
using System; 
using System.ComponentModel;
using System.Windows;           // SR 
using MS.Internal.WindowsBase;

namespace System.ComponentModel
{ 
    /// <summary>
    /// Defines a property and direction to sort a list by. 
    /// </summary> 
    public struct SortDescription
    { 
        //-----------------------------------------------------
        //
        //  Public Constructors
        // 
        //-----------------------------------------------------
 
        #region Public Constructors 

        /// <summary> 
        /// Create a sort description.
        /// </summary>
        /// <param name="propertyName">Property to sort by</param>
        /// <param name="direction">Specifies the direction of sort operation</param> 
        /// <exception cref="InvalidEnumArgumentException"> direction is not a valid value for ListSortDirection </exception>
        public SortDescription(string propertyName, ListSortDirection direction) 
        { 
            if (direction != ListSortDirection.Ascending && direction != ListSortDirection.Descending)
                throw new InvalidEnumArgumentException("direction", (int)direction, typeof(ListSortDirection)); 

            _propertyName = propertyName;
            _direction = direction;
            _sealed = false; 
        }
 
        #endregion Public Constructors 

 
        //------------------------------------------------------
        //
        //  Public Properties
        // 
        //-----------------------------------------------------
 
        #region Public Properties 

        /// <summary> 
        /// Property name to sort by.
        /// </summary>
        public string PropertyName
        { 
            get { return _propertyName; }
            set 
            { 
                if (_sealed)
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SortDescription")); 

                _propertyName = value;
            }
        } 

        /// <summary> 
        /// Sort direction. 
        /// </summary>
        public ListSortDirection Direction 
        {
            get { return _direction; }
            set
            { 
                if (_sealed)
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SortDescription")); 
 
                if (value < ListSortDirection.Ascending || value > ListSortDirection.Descending)
                    throw new InvalidEnumArgumentException("value", (int) value, typeof(ListSortDirection)); 

                _direction = value;
            }
        } 

        /// <summary> 
        /// Returns true if the SortDescription is in use (sealed). 
        /// </summary>
        public bool IsSealed 
        {
            get { return _sealed; }
        }
 
        #endregion Public Properties
 
        //------------------------------------------------------ 
        //
        //  Public methods 
        //
        //------------------------------------------------------

        #region Public Methods 

        /// <summary> Override of Object.Equals </summary> 
        public override bool Equals(object obj) 
        {
            return (obj is SortDescription) ? (this == (SortDescription)obj) : false; 
        }

        /// <summary> Equality operator for SortDescription. </summary>
        public static bool operator==(SortDescription sd1, SortDescription sd2) 
        {
            return  sd1.PropertyName == sd2.PropertyName && 
                    sd1.Direction == sd2.Direction; 
        }
 
        /// <summary> Inequality operator for SortDescription. </summary>
        public static bool operator!=(SortDescription sd1, SortDescription sd2)
        {
            return !(sd1 == sd2); 
        }
 
        /// <summary> Override of Object.GetHashCode </summary> 
        public override int GetHashCode()
        { 
            int result = Direction.GetHashCode();
            if (PropertyName != null)
            {
                result = unchecked(PropertyName.GetHashCode() + result); 
            }
            return result; 
        } 

        #endregion Public Methods 

        //-----------------------------------------------------
        //
        //  Internal methods 
        //
        //------------------------------------------------------ 
 
        #region Internal Methods
 
        internal void Seal()
        {
            _sealed = true;
        } 

        #endregion Internal Methods 
 
        //-----------------------------------------------------
        // 
        //  Private Fields
        //
        //-----------------------------------------------------
 
        #region Private Fields
 
        private string              _propertyName; 
        private ListSortDirection   _direction;
        bool                        _sealed; 

        #endregion Private Fields
    }
} 





