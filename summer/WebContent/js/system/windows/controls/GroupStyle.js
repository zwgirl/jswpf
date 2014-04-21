/**
 * Second check 12-20
 * GroupStyle
 */
/// <summary> 
/// The GroupStyle describes how to display the items in a GroupCollection,
/// such as the collection obtained from CollectionViewGroup.Items.
/// </summary>
define(["dojo/_base/declare", "system/Type", "componentmodel/INotifyPropertyChanged", "controls/ItemsPanelTemplate",
        "windows/FrameworkElementFactory", "controls/StackPanel"], 
		function(declare, Type, INotifyPropertyChanged, ItemsPanelTemplate,
				FrameworkElementFactory, StackPanel){
	var GroupStyle = declare("GroupStyle", INotifyPropertyChanged,{
		constructor:function(){
//			ItemsPanelTemplate      
			this._panel = null; 
//	        Style                   
			this._containerStyle = null;
//	        StyleSelector           
			this._containerStyleSelector = null;
//	        DataTemplate            
			this._headerTemplate = null;
//	        DataTemplateSelector    
			this._headerTemplateSelector = null; 
//	        string                  
			this._headerStringFormat = null;
//	        bool                    
			this._hidesIfEmpty = false; 
//	        bool                    
			this._isAlternationCountSet = false; 
//	        int                     
			this._alternationCount = 0;

		},

        /// <summary> 
        /// A subclass can call this method to raise the PropertyChanged event. 
        /// </summary>
//        protected virtual void 
        OnPropertyChanged:function(/*PropertyChangedEventArgs*/ e) 
        {
        	if(typeof e == "string"){
        		e = new PropertyChangedEventArgs(e);
        	}
            if (this.PropertyChanged != null)
            {
            	this.PropertyChanged.Invoke(this, e); 
            }
        }, 

////        private void 
//        OnPropertyChanged:function(/*string*/ propertyName) 
//        {
//            OnPropertyChanged(new PropertyChangedEventArgs(propertyName)); 
//        }
	});
	
	Object.defineProperties(GroupStyle.prototype,{
 
        /// <summary>
        /// PropertyChanged event (per <see cref="INotifyPropertyChanged" />).
        /// </summary>
//        protected virtual event PropertyChangedEventHandler 
        PropertyChanged:
        {
        	get:function(){
        		if(this._PropertyChanged === undefined){
        			this._PropertyChanged = new PropertyChangedEventHandler();
        		}
        		
        		return this._PropertyChanged;
        	}
        },
        /// <summary> 
        /// A template that creates the panel used to layout the items.
        /// </summary>
//        public ItemsPanelTemplate 
        Panel:
        { 
            get:function() { return this._panel; },
            set:function(value) 
            { 
                this._panel = value;
                this.OnPropertyChanged("Panel"); 
            }
        },

        /// <summary> 
        ///     ContainerStyle is the style that is applied to the GroupItem generated
        ///     for each item. 
        /// </summary> 
//        public Style 
        ContainerStyle: 
        {
            get:function() { return this._containerStyle; },
            set:function(value) { this._containerStyle = value;  this.OnPropertyChanged("ContainerStyle"); }
        }, 

        /// <summary> 
        ///     ContainerStyleSelector allows the app writer to provide custom style selection logic 
        ///     for a style to apply to each generated GroupItem.
        /// </summary> 
//        public StyleSelector 
        ContainerStyleSelector:
        {
            get:function() { return this._containerStyleSelector; }, 
            set:function(value) { this._containerStyleSelector = value;  this.OnPropertyChanged("ContainerStyleSelector"); }
        }, 
 
        /// <summary>
        ///     HeaderTemplate is the template used to display the group header. 
        /// </summary>
//        public DataTemplate 
        HeaderTemplate:
        { 
            get:function() { return this._headerTemplate; },
            set:function(value) { this._headerTemplate = value;  this.OnPropertyChanged("HeaderTemplate"); } 
        }, 

        /// <summary> 
        ///     HeaderTemplateSelector allows the app writer to provide custom selection logic
        ///     for a template used to display the group header.
        /// </summary>
//        public DataTemplateSelector 
        HeaderTemplateSelector:
        { 
            get:function() { return this._headerTemplateSelector; }, 
            set:function(value) { this._headerTemplateSelector = value;  this.OnPropertyChanged("HeaderTemplateSelector"); }
        }, 

        /// <summary>
        ///     HeaderStringFormat is the format used to display the header content as a string.
        ///     This arises only when no template is available. 
        /// </summary>
//        public String 
        HeaderStringFormat: 
        {
            get:function() { return this._headerStringFormat; }, 
            set:function(value) { this._headerStringFormat = value;  this.OnPropertyChanged("HeaderStringFormat"); }
        },

        /// <summary> 
        /// HidesIfEmpty allows the app writer to indicate whether items corresponding
        /// to empty groups should be displayed. 
        /// </summary> 
//        public bool 
        HidesIfEmpty: 
        {
            get:function() { return this._hidesIfEmpty; },
            set:function(value) { this._hidesIfEmpty = value;  this.OnPropertyChanged("HidesIfEmpty"); }
        }, 
        /// <summary> 
        /// AlternationCount controls the range of values assigned to the 
        /// ItemsControl.AlternationIndex property on containers generated
        /// for this level of grouping. 
//        public int 
        AlternationCount:
        {
            get:function() { return this._alternationCount; }, 
            set:function(value)
            { 
            	this._alternationCount = value; 
            	this._isAlternationCountSet = true;
            	this.OnPropertyChanged("AlternationCount"); 
            }
        },

//        internal bool 
        IsAlternationCountSet:
        { 
            get:function() { return this._isAlternationCountSet; }
        } 
	});
	
	Object.defineProperties(GroupStyle, {

//       /// <summary>The default panel template.</summary> 
////        public static readonly ItemsPanelTemplate 
//        DefaultGroupPanel:
//        {
//        	get:function(){
//        		if(GroupStyle._DefaultGroupPanel === undefined){
//                    /*ItemsPanelTemplate*/var template = new ItemsPanelTemplate(new FrameworkElementFactory(StackPanel.Type)); 
//                    template.Seal(); 
//                    GroupStyle._DefaultGroupPanel = template;
//        		}
//        		
//        		return GroupStyle._DefaultGroupPanel;
//        	}
//        },
//        
//        DefaultVirtualizingStackPanel:
//        {
//        	get:function(){
//        		if(GroupStyle._DefaultVirtualizingStackPanel === undefined){
//                    /*ItemsPanelTemplate*/var template = new ItemsPanelTemplate(new FrameworkElementFactory(VirtualizingStackPanel.Type)); 
//                    template.Seal(); 
//                    GroupStyle._DefaultVirtualizingStackPanel = template;
//        		}
//        		
//        		return GroupStyle._DefaultVirtualizingStackPanel;
//        	}
//        },
//        
////        internal static ItemsPanelTemplate 
//        DefaultStackPanel:
//        {
//        	get:function(){
//        		if(GroupStyle._DefaultStackPanel === undefined){
//                    /*ItemsPanelTemplate*/var template = new ItemsPanelTemplate(new FrameworkElementFactory(StackPanel.Type)); 
//                    template.Seal(); 
//                    GroupStyle._DefaultStackPanel = template;
//        		}
//        		
//        		return GroupStyle._DefaultStackPanel;
//        	}
//        },
 
        /// <summary>The default GroupStyle.</summary> 
//        public static GroupStyle 
        Default:
        { 
            get:function() 
            { 
            	return GroupStyle.s_DefaultGroupStyle; 
            }
        }
	});
	
//    static GroupStyle       s_DefaultGroupStyle;
//    /// <summary>The default panel template.</summary>
//    internal static ItemsPanelTemplate DefaultStackPanel; 
//    internal static ItemsPanelTemplate DefaultVirtualizingStackPanel;
//    /// <summary>The default panel template.</summary> 
//    public static readonly ItemsPanelTemplate DefaultGroupPanel;

//    static GroupStyle() 
    function Initialize(){
        /*ItemsPanelTemplate*/var template = new ItemsPanelTemplate(new FrameworkElementFactory(StackPanel.Type)); 
        template.Seal(); 
        GroupStyle.DefaultGroupPanel = template;
        GroupStyle.DefaultStackPanel = template; 

        template = new ItemsPanelTemplate(new FrameworkElementFactory(StackPanel.Type/*typeof(VirtualizingStackPanel)*/));
        template.Seal();
        GroupStyle.DefaultVirtualizingStackPanel = template; 

        s_DefaultGroupStyle = new GroupStyle(); 
    } 
	
	GroupStyle.Type = new Type("GroupStyle", GroupStyle, [INotifyPropertyChanged.Type]);
	Initialize();
	
	return GroupStyle;
});
