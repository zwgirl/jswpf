/**
 * Second Check 12-29
 * BindingWorker
 */
// Base class for binding workers. 
// Derived classes implement binding functionality depending on the 
// type of source, e.g.  ClrBindingWorker, XmlBindingWorker
define(["dojo/_base/declare", "system/Type", "data/BindingStatusInternal",
        "internal/UncommonValueTable"], 
        function(declare, Type, BindingStatusInternal,
        		UncommonValueTable){
	
	var Feature =
    {
        // ClrBindingWorker
        XmlWorker:0, 
        PendingGetValueRequest:1,
        PendingSetValueRequest:2, 

        // XmlBindingWorker

        // Sentinel, for error checking.   Must be last.
        LastFeatureId:3
    };
	
	var BindingWorker = declare("BindingWorker", null,{
		constructor:function(/*BindingExpression*/ b)
        { 
			this._values = new UncommonValueTable();
            this._bindingExpression = b;
        },
        
        
//        internal bool      
        HasValue:function(/*Feature*/ id) { return this._values.HasValue(id); },
//        internal object    
        GetValue:function(/*Feature*/ id, /*object*/ defaultValue) { return this._values.GetValue(id, defaultValue); }, 
////        internal void      
//        SetValue:function(/*Feature*/ id, /*object*/ value) { this._values.SetValue(id, value); } ,
//        internal void      
        SetValue:function(/*Feature*/ id, /*object*/ value, /*object*/ defaultValue) 
        { 	
        	if(defaultValue === undefined){
        		this._values.SetValue(id, value); 
        		return;
        	}
        	
        	if (Object.Equals(value, defaultValue)) 
        		this._values.ClearValue(id); 
        	else 
        		this._values.SetValue(id, value); 
        },
//        internal void      
        ClearValue:function(/*Feature*/ id) { this._values.ClearValue(id); }, 

//        protected void 
        SetTransferIsPending:function(/*bool*/ value) 
        {
            this.ParentBindingExpression.IsTransferPending = value; 
        },
 
//        internal virtual void           
        AttachDataItem:function() {},
//        internal virtual void           
        DetachDataItem:function() {},
//        internal virtual void           
        OnCurrentChanged:function(/*ICollectionView*/ collectionView, /*EventArgs*/ args) {},
//        internal virtual object         
        RawValue:function() { return null; }, 
//        internal virtual void           
        UpdateValue:function(/*object*/ value) {},
//        internal virtual void           
        RefreshValue:function() {},
//        internal virtual bool           
        UsesDependencyProperty:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp) { return false; }, 
//        internal virtual void           
        OnSourceInvalidation:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp, /*bool*/ isASubPropertyChange) {},
//        internal virtual bool           
        IsPathCurrent:function() { return true; },
	});
	
	Object.defineProperties(BindingWorker.prototype,{
//        internal virtual Type           
        SourcePropertyType:      { get:function() { return null; } },
//        internal virtual bool           
        CanUpdate:              { get:function() { return false; } }, 
//        internal BindingExpression      
        ParentBindingExpression: { get:function() { return this._bindingExpression; } }, 
//        internal Type                   
        TargetPropertyType:      { get:function() { return this.TargetProperty.PropertyType; } },
//        internal virtual bool           
        IsDBNullValidForUpdate:  { get:function() { return false; } }, 
//        internal virtual object         
        SourceItem:              { get:function() { return null; } },
//        internal virtual string         
        SourcePropertyName:      { get:function() { return null; } },
 
//        protected Binding      
        ParentBinding:          { get:function() { return this.ParentBindingExpression.ParentBinding; } },
 
//        protected bool      
        IsDynamic:           { get:function() { return this.ParentBindingExpression.IsDynamic; } },
//        internal  bool      
        IsReflective:        { get:function() { return this.ParentBindingExpression.IsReflective; } },
//        protected bool      
        IgnoreSourcePropertyChange: { get:function() { return this.ParentBindingExpression.IgnoreSourcePropertyChange; } },
//        protected object    
        DataItem:            { get:function() { return this.ParentBindingExpression.DataItem; } }, 
//        protected DependencyObject 
        TargetElement: { get:function() { return this.ParentBindingExpression.TargetElement; } },
//        protected DependencyProperty 
        TargetProperty: { get:function() { return this.ParentBindingExpression.TargetProperty; } }, 
//        protected DataBindEngine 
        Engine:         { get:function() { return this.ParentBindingExpression.Engine; } },
//        protected Dispatcher 
        Dispatcher:         { get:function() { return this.ParentBindingExpression.Dispatcher; } },
 
//        protected BindingStatusInternal 
        Status:
        {
            get:function() { return this.ParentBindingExpression.StatusInternal; },
            set:function(value) { this.ParentBindingExpression.SetStatus(value); } 
        }
	});
	
	BindingWorker.Feature = Feature;
	
	BindingWorker.Type = new Type("BindingWorker", BindingWorker, [Object.Type]);
	return BindingWorker;
});



