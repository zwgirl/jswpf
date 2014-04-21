/**
 * ColumnDefinition
 */

define(["dojo/_base/declare", "system/Type", "controls/DefinitionBase", "windows/GridLength",
        "windows/DependencyProperty", "windows/FrameworkPropertyMetadata", "windows/PropertyChangedCallback",
        "windows/ValidateValueCallback", "windows/GridUnitType"], 
		function(declare, Type, DefinitionBase, GridLength,
				DependencyProperty, FrameworkPropertyMetadata, PropertyChangedCallback,
				ValidateValueCallback, GridUnitType){
	var ColumnDefinition = declare("ColumnDefinition", DefinitionBase,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(ColumnDefinition.prototype,{
//		public GridLength 
		Width:
		{
			get:function()
			{
				return this.UserSizeValueCache;
			},
			set:function(value)
			{
				this.SetValue(ColumnDefinition.WidthProperty, value);
			}
		},
//		public double 
		MinWidth:
		{
			get:function()
			{
				return this.UserMinSizeValueCache;
			},
			set:function(value)
			{
				this.SetValue(ColumnDefinition.MinWidthProperty, value);
			}
		},
//		public double 
		MaxWidth:
		{
			get:function()
			{
				return this.UserMaxSizeValueCache;
			},
			set:function(value)
			{
				this.SetValue(ColumnDefinition.MaxWidthProperty, value);
			}
		},
//		public double 
		ActualWidth:
		{
			get:function()
			{
				var result = 0.0;
				if (this.InParentLogicalTree)
				{
					result = this.Parent.GetFinalColumnDefinitionWidth(this.Index);
				}
				return result;
			}
		},
//		public double 
		Offset:
		{
			get:function()
			{
				var result = 0.0;
				if (this.Index != 0)
				{
					result = this.FinalOffset;
				}
				return result;
			}
		}  
	});
	
	Object.defineProperties(ColumnDefinition,{
//		public static readonly DependencyProperty 
		WidthProperty:
        {
        	get:function(){
        		if(ColumnDefinition._WidthProperty === undefined){
        			ColumnDefinition._WidthProperty  = DependencyProperty.Register("Width", 
        					GridLength.Type, 
        	        		ColumnDefinition.Type,
        	        		new FrameworkPropertyMetadata(new GridLength(1.0, GridUnitType.Star), 
        	        				new PropertyChangedCallback(DefinitionBase.OnUserSizePropertyChanged)), 
        	        				new ValidateValueCallback(DefinitionBase.IsUserSizePropertyValueValid));
        		}
        		
        		return ColumnDefinition._WidthProperty;
        	}
        },
//		public static readonly DependencyProperty 
		MinWidthProperty:
        {
        	get:function(){
        		if(ColumnDefinition._MinWidthProperty === undefined){
        			ColumnDefinition._MinWidthProperty = DependencyProperty.Register("MinWidth", 
        					Number.Type, ColumnDefinition.Type, 
        	        		new FrameworkPropertyMetadata(0.0, 
        	        				new PropertyChangedCallback(DefinitionBase.OnUserMinSizePropertyChanged)), 
        	        				new ValidateValueCallback(DefinitionBase.IsUserMinSizePropertyValueValid));
        		}
        		
        		return ColumnDefinition._MinWidthProperty;
        	}
        }, 
//		public static readonly DependencyProperty
		MaxWidthProperty:
        {
        	get:function(){
        		if(ColumnDefinition._MaxWidthProperty === undefined){
        			ColumnDefinition._MaxWidthProperty = DependencyProperty.Register("MaxWidth", 
        	        		Number.Type, ColumnDefinition.Type, 
        	        		new FrameworkPropertyMetadata(double.PositiveInfinity, 
        	        				new PropertyChangedCallback(DefinitionBase.OnUserMaxSizePropertyChanged)), 
        	        				new ValidateValueCallback(DefinitionBase.IsUserMaxSizePropertyValueValid));
        		}
        		
        		return ColumnDefinition._MaxWidthProperty;
        	}
        }, 
		  
	});
	
	ColumnDefinition.Type = new Type("ColumnDefinition", ColumnDefinition, [DefinitionBase.Type]);
	return ColumnDefinition;
});
