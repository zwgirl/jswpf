package org.summer.view.widget.data;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.Type;
import org.summer.view.widget.internal.UncommonValueTable;
import org.summer.view.widget.model.ICollectionView;
import org.summer.view.widget.threading.Dispatcher;

//Base class for binding workers. 
// Derived classes implement binding functionality depending on the 
// type of source, e.g.  ClrBindingWorker, XmlBindingWorker
/*internal*/ public abstract class BindingWorker 
{
    //-----------------------------------------------------
    //
    //  Constructors 
    //
    //----------------------------------------------------- 
    static //BindingWorker() 
    {
//        Debug.Assert((int)Feature.LastFeatureId <= 32, "UncommonValueTable supports only 32 Ids"); 
    }

    protected BindingWorker(BindingExpression b)
    { 
        _bindingExpression = b;
    } 

    //------------------------------------------------------
    // 
    //  Internal properties - used by parent BindingExpression
    //
    //-----------------------------------------------------

    /*internal*/ public /*virtual*/ Type SourcePropertyType      
    { 
    	get { return null; } 
    }
    /*internal*/ public /*virtual*/ boolean CanUpdate               
    { 
    	get { return false; } 
    } 
    /*internal*/ public BindingExpression ParentBindingExpression 
    { 
    	get { return _bindingExpression; } 
    } 
    /*internal*/ public Type   TargetPropertyType      
    { 
    	get { return TargetProperty.PropertyType; } 
    }
    /*internal*/ public /*virtual*/ boolean IsDBNullValidForUpdate  
    { 
    	get { return false; } 
    } 
    /*internal*/ public /*virtual*/ Object SourceItem              
    { 
    	get { return null; } 
    }
    /*internal*/ public /*virtual*/ String SourcePropertyName      
    { 
    	get { return null; } 
    }

    //------------------------------------------------------ 
    //
    //  Internal methods - used by parent BindingExpression 
    // 
    //------------------------------------------------------

    /*internal*/ public /*virtual*/ void AttachDataItem() {}
    /*internal*/ public /*virtual*/ void DetachDataItem() {}
    /*internal*/ public /*virtual*/ void OnCurrentChanged(ICollectionView collectionView, EventArgs args) {}
    /*internal*/ public /*virtual*/ Object RawValue() { return null; } 
    /*internal*/ public /*virtual*/ void UpdateValue(Object value) {}
    /*internal*/ public /*virtual*/ void RefreshValue() {} 
    /*internal*/ public /*virtual*/ boolean UsesDependencyProperty(DependencyObject d, DependencyProperty dp) { return false; } 
    /*internal*/ public /*virtual*/ void OnSourceInvalidation(DependencyObject d, DependencyProperty dp, boolean isASubPropertyChange) {}
    /*internal*/ public /*virtual*/ boolean IsPathCurrent() { return true; } 

    //-----------------------------------------------------
    //
    //  Protected Properties 
    //
    //------------------------------------------------------ 

    protected Binding ParentBinding { get { return ParentBindingExpression.ParentBinding; } }

    protected boolean IsDynamic { get { return ParentBindingExpression.IsDynamic; } }
    /*internal*/ public  boolean IsReflective { get { return ParentBindingExpression.IsReflective; } }
    protected boolean      IgnoreSourcePropertyChange { get { return ParentBindingExpression.IgnoreSourcePropertyChange; } }
    protected Object    DataItem { get { return ParentBindingExpression.DataItem; } } 
    protected DependencyObject TargetElement { get { return ParentBindingExpression.TargetElement; } }
    protected DependencyProperty TargetProperty { get { return ParentBindingExpression.TargetProperty; } } 
    protected DataBindEngine Engine { get { return ParentBindingExpression.Engine; } } 
    protected Dispatcher Dispatcher { get { return ParentBindingExpression.Dispatcher; } }

    protected BindingStatusInternal Status
    {
        get { return ParentBindingExpression.StatusInternal; }
        set { ParentBindingExpression.SetStatus(value); } 
    }

    //----------------------------------------------------- 
    //
    //  Protected Methods 
    //
    //-----------------------------------------------------

    protected void SetTransferIsPending(boolean value) 
    {
        ParentBindingExpression.IsTransferPending = value; 
    } 

    //----------------------------------------------------- 
    //
    //  Private Fields
    //
    //------------------------------------------------------ 

    BindingExpression _bindingExpression; 

//    #region Uncommon Values

    /*internal*/ public enum Feature
    {
        // ClrBindingWorker
        XmlWorker, 
        PendingGetValueRequest,
        PendingSetValueRequest, 

        // XmlBindingWorker

        // Sentinel, for error checking.   Must be last.
        LastFeatureId
    }

    /*internal*/ public boolean HasValue(Feature id) { return _values.HasValue((int)id); }
    /*internal*/ public Object GetValue(Feature id, Object defaultValue) { return _values.GetValue((int)id, defaultValue); } 
    /*internal*/ public void SetValue(Feature id, Object value) { _values.SetValue((int)id, value); } 
    /*internal*/ public void SetValue(Feature id, Object value, Object defaultValue) 
    { 
    	if (Object.Equals(value, defaultValue)) 
    		_values.ClearValue((int)id); 
    	else 
    		_values.SetValue((int)id, value); 
    }
    /*internal*/ public void ClearValue(Feature id) { _values.ClearValue((int)id); } 
    UncommonValueTable  _values;

//    #endregion Uncommon Values
} 