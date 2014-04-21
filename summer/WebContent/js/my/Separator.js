/**
 * Separator
 */

define(["dojo/_base/declare", "system/Type", "controls/Control"], 
		function(declare, Type, Control){
	var Separator = declare("Separator", Control,{
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
	
	Object.defineProperties(Separator.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	Separator.Type = new Type("Separator", Separator, [Control.Type]);
	return Separator;
});
//---------------------------------------------------------------------------- 
//
// Copyright (C) Microsoft Corporation.  All rights reserved.
//
//--------------------------------------------------------------------------- 

using MS.Internal.KnownBoxes; 
using System.Windows.Automation.Peers; 

namespace System.Windows.Controls 
{
    /// <summary>
    ///     Separator control is a simple Control subclass that is used in different styles
    /// depend on container control. Common usage is inside ListBox, ComboBox, MenuItem and ToolBar. 
    /// </summary>
    [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // cannot be read & localized as string 
    public class Separator : Control 
    {
        static Separator() 
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(Separator), new FrameworkPropertyMetadata(typeof(Separator)));
            _dType = DependencyObjectType.FromSystemTypeInternal(typeof(Separator));
 
            IsEnabledProperty.OverrideMetadata(typeof(Separator), new FrameworkPropertyMetadata(BooleanBoxes.FalseBox));
        } 
 
        internal static void PrepareContainer(Control container)
        { 
            if (container != null)
            {
                // Disable the control and set the alignment to stretch
                container.IsEnabled = false; 
                container.HorizontalContentAlignment = HorizontalAlignment.Stretch;
            } 
        } 

        /// <summary> 
        /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>)
        /// </summary>
        protected override AutomationPeer OnCreateAutomationPeer()
        { 
            return new SeparatorAutomationPeer(this);
        } 
 
        #region DTypeThemeStyleKey
 
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types.
        internal override DependencyObjectType DTypeThemeStyleKey
        { 
            get { return _dType; }
        } 
 
        private static DependencyObjectType _dType;
 
        #endregion DTypeThemeStyleKey
    }
}

