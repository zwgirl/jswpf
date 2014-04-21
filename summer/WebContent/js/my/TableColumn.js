/**
 * TableColumn
 */

define(["dojo/_base/declare", "system/Type", "windwos/FrameworkContentElement"], 
		function(declare, Type, FrameworkContentElement){
	var TableColumn = declare("TableColumn", [FrameworkContentElement, IIndexedChild],{
		constructor:function(){
		}
	});
	
	Object.defineProperties(TableColumn.prototype,{
		  
	});
	
	Object.defineProperties(TableColumn,{
		  
	});
	
	TableColumn.Type = new Type("TableColumn", TableColumn, [FrameworkContentElement.Type, IIndexedChild.Type]);
	return TableColumn;
});

//---------------------------------------------------------------------------- 
//
// <copyright file="TableColumn.cs" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// 
// Description: Table column object implementation. 
//
// History: 
//  06/19/2003 : olego - Created
//
//---------------------------------------------------------------------------
using System; 
using System.Diagnostics;
using System.Windows.Threading; 
 
using System.Windows;
using System.Windows.Controls; 
using System.Windows.Documents;
using System.Windows.Media;
using MS.Internal.PtsHost.UnsafeNativeMethods; // PTS restrictions
using System.Collections; 
using System.Collections.Generic;
 
using MS.Internal.Documents; 

namespace System.Windows.Documents 
{
    /// <summary>
    /// Table column.
    /// </summary> 
    public class TableColumn : FrameworkContentElement, IIndexedChild<Table>
    { 
        //----------------------------------------------------- 
        //
        //  Constructors 
        //
        //-----------------------------------------------------

        #region Constructors 

        /// <summary> 
        /// Creates an instance of a Column 
        /// </summary>
        public TableColumn() 
        {
            _parentIndex = -1;
        }
 
        #endregion Constructors
 
        //------------------------------------------------------ 
        //
        //  Public Methods 
        //
        //-----------------------------------------------------

        #region Public Methods 
        #endregion Public Methods
 
        //------------------------------------------------------ 
        //
        //  Public Properties 
        //
        //------------------------------------------------------

        #region Public Properties 

        /// <summary> 
        /// Width property. 
        /// </summary>
        public GridLength Width 
        {
            get { return (GridLength) GetValue(WidthProperty); }
            set { SetValue(WidthProperty, value); }
        } 

        /// <summary> 
        /// Background property. 
        /// </summary>
        public Brush Background 
        {
            get { return (Brush) GetValue(BackgroundProperty); }
            set { SetValue(BackgroundProperty, value); }
        } 

        #endregion Public Properties 
 
        //-----------------------------------------------------
        // 
        //  Protected Methods
        //
        //------------------------------------------------------
 
        #region Protected Methods
        #endregion Protected Methods 
 
        //-----------------------------------------------------
        // 
        //  Internal Methods
        //
        //-----------------------------------------------------
 
        #region Internal Methods
 
        #region IIndexedChild implementation 

        /// <summary> 
        /// Callback used to notify about entering model tree.
        /// </summary>
        void IIndexedChild<Table>.OnEnterParentTree()
        { 
            this.OnEnterParentTree();
        } 
 
        /// <summary>
        /// Callback used to notify about exitting model tree. 
        /// </summary>
        void IIndexedChild<Table>.OnExitParentTree()
        {
            this.OnExitParentTree(); 
        }
 
        void IIndexedChild<Table>.OnAfterExitParentTree(Table parent) 
        {
        } 

        int IIndexedChild<Table>.Index
        {
            get { return this.Index; } 
            set { this.Index = value; }
        } 
        #endregion IIndexedChild implementation 

        /// <summary> 
        /// Callback used to notify the Cell about entering model tree.
        /// </summary>
        internal void OnEnterParentTree()
        { 
            Table.InvalidateColumns();
        } 
 
        /// <summary>
        /// Callback used to notify the Cell about exitting model tree. 
        /// </summary>
        internal void OnExitParentTree()
        {
            Table.InvalidateColumns(); 
        }
 
        #endregion Internal Methods 

        //----------------------------------------------------- 
        //
        //  Internal Properties
        //
        //------------------------------------------------------ 

        #region Internal Properties 
 
        /// <summary>
        /// Table owner accessor 
        /// </summary>
        internal Table Table { get { return Parent as Table; } }

        /// <summary> 
        /// Column's index in the parents collection.
        /// </summary> 
        internal int Index 
        {
            get 
            {
                return (_parentIndex);
            }
            set 
            {
                Debug.Assert (value >= -1 && _parentIndex != value); 
                _parentIndex = value; 
            }
        } 

        /// <summary>
        /// DefaultWidth
        /// </summary> 
        internal static GridLength DefaultWidth { get { return (new GridLength(0, GridUnitType.Auto)); } }
 
        #endregion Internal Properties 

        //----------------------------------------------------- 
        //
        //  Private Methods
        //
        //------------------------------------------------------ 

        #region Private Methods 
 
        /// <summary>
        /// <see cref="DependencyProperty.ValidateValueCallback"/> 
        /// </summary>
        private static bool IsValidWidth(object value)
        {
            GridLength gridLength = (GridLength) value; 
            if ((gridLength.GridUnitType == GridUnitType.Pixel || gridLength.GridUnitType == GridUnitType.Star) &&
                (gridLength.Value < 0.0)) 
            { 
                return false;
            } 

            double maxPixel = Math.Min(1000000, PTS.MaxPageSize);
            if (gridLength.GridUnitType == GridUnitType.Pixel && (gridLength.Value > maxPixel))
            { 
                return false;
            } 
            return true; 
        }
 
        #endregion Private Methods

        //------------------------------------------------------
        // 
        //  Private Fields
        // 
        //----------------------------------------------------- 

        #region Private Fields 
        private int _parentIndex;                       //  column's index in parent's children collection
        #endregion Private Fields

        //------------------------------------------------------ 
        //
        //  Properties 
        // 
        //-----------------------------------------------------
 
        #region Properties

        /// <summary>
        /// Width property. 
        /// </summary>
        public static readonly DependencyProperty WidthProperty = 
                DependencyProperty.Register( 
                        "Width",
                        typeof(GridLength), 
                        typeof(TableColumn),
                        new FrameworkPropertyMetadata(
                                new GridLength(0, GridUnitType.Auto),
                                FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                new PropertyChangedCallback(OnWidthChanged)),
                        new ValidateValueCallback(IsValidWidth)); 
 
        /// <summary>
        /// DependencyProperty for <see cref="Background" /> property. 
        /// </summary>
        public static readonly DependencyProperty BackgroundProperty =
                Panel.BackgroundProperty.AddOwner(
                        typeof(TableColumn), 
                        new FrameworkPropertyMetadata(
                                null, 
                                FrameworkPropertyMetadataOptions.AffectsRender, 
                                new PropertyChangedCallback(OnBackgroundChanged)));
 
        #endregion Properties

        //-----------------------------------------------------
        // 
        //  Static Initialization
        // 
        //----------------------------------------------------- 

        #region Static Initialization 

        /// <summary>
        /// Called when the value of the WidthProperty changes
        /// </summary> 
        private static void OnWidthChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            Table table = ((TableColumn) d).Table; 
            if(table != null)
            { 
                table.InvalidateColumns();
            }
        }
 
        /// <summary>
        /// Called when the value of the BackgroundProperty changes 
        /// </summary> 
        private static void OnBackgroundChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            Table table = ((TableColumn) d).Table;
            if(table != null)
            {
                table.InvalidateColumns(); 
            }
        } 
 
        #endregion Static Initialization
 
    }
}
