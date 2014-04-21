/**
 * RowDefinition
 */

define(["dojo/_base/declare", "system/Type", "controls/DefinitionBase", "windows/GridLength",
        "windows/DependencyProperty", "windows/FrameworkPropertyMetadata", "windows/PropertyChangedCallback",
        "windows/ValidateValueCallback", "windows/GridUnitType"], 
		function(declare, Type, DefinitionBase, GridLength,
				DependencyProperty, FrameworkPropertyMetadata, PropertyChangedCallback,
				ValidateValueCallback, GridUnitType){
	var RowDefinition = declare("RowDefinition", DefinitionBase,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(RowDefinition.prototype,{
//		public GridLength 
		Height:
		{
			get:function()
			{
				return this.UserSizeValueCache;
			},
			set:function(value)
			{
				this.SetValue(RowDefinition.HeightProperty, value);
			}
		},
//		public double 
		MinHeight:
		{
			get:function()
			{
				return this.UserMinSizeValueCache;
			},
			set:function(value)
			{
				this.SetValue(RowDefinition.MinHeightProperty, value);
			}
		},
//		public double 
		MaxHeight:
		{
			get:function()
			{
				return this.UserMaxSizeValueCache;
			},
			set:function(value)
			{
				this.SetValue(RowDefinition.MaxHeightProperty, value);
			}
		},
//		public double 
		ActualHeight:
		{
			get:function()
			{
				var result = 0.0;
				if (this.InParentLogicalTree)
				{
					result = this.Parent.GetFinalRowDefinitionHeight(this.Index);
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
	
	Object.defineProperties(RowDefinition,{
//		public static readonly DependencyProperty 
		HeightProperty:
        {
        	get:function(){
        		if(RowDefinition._HeightProperty === undefined){
        			RowDefinition._HeightProperty = DependencyProperty.Register("Height", 
        	        		GridLength.Type, 
        	        		RowDefinition.Type, 
        	        		/*new FrameworkPropertyMetadata(new GridLength(1.0, GridUnitType.Star), 
        	        				new PropertyChangedCallback(null, DefinitionBase.OnUserSizePropertyChanged))*/
        	        		FrameworkPropertyMetadata.BuildWithDVandPCCB(new GridLength(1.0, GridUnitType.Star), 
        	        				new PropertyChangedCallback(null, DefinitionBase.OnUserSizePropertyChanged)), 
        	        				new ValidateValueCallback(null, DefinitionBase.IsUserSizePropertyValueValid));
        		}
        		
        		return RowDefinition._HeightProperty;
        	}
        }, 
//		public static readonly DependencyProperty 
		MinHeightProperty:
        {
        	get:function(){
        		if(RowDefinition._MinHeightProperty === undefined){
        			RowDefinition._MinHeightProperty = DependencyProperty.Register("MinHeight", 
        	        		Number.Type, RowDefinition.Type, 
        	        		/*new FrameworkPropertyMetadata(0.0, 
        	        				new PropertyChangedCallback(null, DefinitionBase.OnUserMinSizePropertyChanged))*/
        	        		FrameworkPropertyMetadata.BuildWithDVandPCCB(0.0, 
        	        				new PropertyChangedCallback(null, DefinitionBase.OnUserMinSizePropertyChanged)), 
        	        				new ValidateValueCallback(null, DefinitionBase.IsUserMinSizePropertyValueValid));
        		}
        		
        		return RowDefinition._MinHeightProperty;
        	}
        },
//		public static readonly DependencyProperty 
		MaxHeightProperty:
        {
        	get:function(){
        		if(RowDefinition._MaxHeightProperty === undefined){
        			RowDefinition._MaxHeightProperty= DependencyProperty.Register("MaxHeight", typeof(double), 
        	        		RowDefinition.Type,
        	        		/*new FrameworkPropertyMetadata(double.PositiveInfinity, 
        	        				new PropertyChangedCallback(null, DefinitionBase.OnUserMaxSizePropertyChanged))*/
        	        		FrameworkPropertyMetadata.BuildWithDVandPCCB(double.PositiveInfinity, 
        	        				new PropertyChangedCallback(null, DefinitionBase.OnUserMaxSizePropertyChanged)), 
        	        				new ValidateValueCallback(null, DefinitionBase.IsUserMaxSizePropertyValueValid));
        		}
        		
        		return RowDefinition._MaxHeightProperty;
        	}
        }, 
		  
	});
	
	RowDefinition.Type = new Type("RowDefinition", RowDefinition, [DefinitionBase.Type]);
	return RowDefinition;
});

		
