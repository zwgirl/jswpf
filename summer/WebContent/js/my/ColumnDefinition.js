/**
 * ColumnDefinition
 */

define(["dojo/_base/declare", "system/Type", "controls/DefinitionBase"], 
		function(declare, Type, DefinitionBase){
	var ColumnDefinition = declare("ColumnDefinition", DefinitionBase,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(ColumnDefinition.prototype,{
		  
	});
	
	Object.defineProperties(ColumnDefinition,{
		  
	});
	
	ColumnDefinition.Type = new Type("ColumnDefinition", ColumnDefinition, [DefinitionBase.Type]);
	return ColumnDefinition;
});




using MS.Internal.PresentationFramework;
using System;
using System.ComponentModel;
namespace System.Windows.Controls
{
	public class ColumnDefinition : DefinitionBase
	{
		[CommonDependencyProperty]
		public static readonly DependencyProperty WidthProperty = DependencyProperty.Register("Width", typeof(GridLength), typeof(ColumnDefinition), new FrameworkPropertyMetadata(new GridLength(1.0, GridUnitType.Star), new PropertyChangedCallback(DefinitionBase.OnUserSizePropertyChanged)), new ValidateValueCallback(DefinitionBase.IsUserSizePropertyValueValid));
		[CommonDependencyProperty, TypeConverter("System.Windows.LengthConverter, PresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, Custom=null")]
		public static readonly DependencyProperty MinWidthProperty = DependencyProperty.Register("MinWidth", typeof(double), typeof(ColumnDefinition), new FrameworkPropertyMetadata(0.0, new PropertyChangedCallback(DefinitionBase.OnUserMinSizePropertyChanged)), new ValidateValueCallback(DefinitionBase.IsUserMinSizePropertyValueValid));
		[CommonDependencyProperty, TypeConverter("System.Windows.LengthConverter, PresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, Custom=null")]
		public static readonly DependencyProperty MaxWidthProperty = DependencyProperty.Register("MaxWidth", typeof(double), typeof(ColumnDefinition), new FrameworkPropertyMetadata(double.PositiveInfinity, new PropertyChangedCallback(DefinitionBase.OnUserMaxSizePropertyChanged)), new ValidateValueCallback(DefinitionBase.IsUserMaxSizePropertyValueValid));
		public GridLength Width
		{
			get
			{
				return base.UserSizeValueCache;
			}
			set
			{
				base.SetValue(ColumnDefinition.WidthProperty, value);
			}
		}
		[TypeConverter(typeof(LengthConverter))]
		public double MinWidth
		{
			get
			{
				return base.UserMinSizeValueCache;
			}
			set
			{
				base.SetValue(ColumnDefinition.MinWidthProperty, value);
			}
		}
		[TypeConverter(typeof(LengthConverter))]
		public double MaxWidth
		{
			get
			{
				return base.UserMaxSizeValueCache;
			}
			set
			{
				base.SetValue(ColumnDefinition.MaxWidthProperty, value);
			}
		}
		public double ActualWidth
		{
			get
			{
				double result = 0.0;
				if (base.InParentLogicalTree)
				{
					result = ((Grid)base.Parent).GetFinalColumnDefinitionWidth(base.Index);
				}
				return result;
			}
		}
		public double Offset
		{
			get
			{
				double result = 0.0;
				if (base.Index != 0)
				{
					result = base.FinalOffset;
				}
				return result;
			}
		}
		public ColumnDefinition() : base(true)
		{
		}
	}
}
