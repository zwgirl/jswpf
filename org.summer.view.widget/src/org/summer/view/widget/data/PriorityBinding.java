package org.summer.view.widget.data;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;

/// <summary> 
///  Describes a collection of bindings attached to a single property.
///     These behave as "priority" bindings, meaning that the property 
///     receives its value from the first binding in the collection that
///     can produce a legal value.
/// </summary>
//[ContentProperty("Bindings")] 
public class PriorityBinding extends BindingBase implements IAddChild
{ 
    //----------------------------------------------------- 
    //
    //  Constructors 
    //
    //-----------------------------------------------------

    /// <summary> Constructor </summary> 
    public PriorityBinding() 
    { 
    	super();
        _bindingCollection = new BindingCollection(this, new BindingCollectionChangedCallback(OnBindingCollectionChanged)); 
    }
 
//#region IAddChild

    ///<summary>
    /// Called to Add the object as a Child. 
    ///</summary>
    ///<param name="value"> 
    /// Object to add as a child - must have type BindingBase 
    ///</param>
    void IAddChild.AddChild(Object value) 
    {
        BindingBase binding = value as BindingBase;
        if (binding != null)
            Bindings.Add(binding); 
        else
            throw new ArgumentException(SR.Get(SRID.ChildHasWrongType, this.GetType().Name, "BindingBase", value.GetType().FullName), "value"); 
    } 

    ///<summary> 
    /// Called when text appears under the tag in markup
    ///</summary>
    ///<param name="text">
    /// Text to Add to the Object 
    ///</param>
    void IAddChild.AddText(String text) 
    { 
        XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this);
    } 

//#endregion IAddChild

    //------------------------------------------------------ 
    //
    //  Public Properties 
    // 
    //-----------------------------------------------------
 
    /// <summary> List of inner bindings </summary>
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
    public Collection<BindingBase> Bindings
    { 
        get { return _bindingCollection; }
    } 
 
    /// <summary>
    /// This method is used by TypeDescriptor to determine if this property should 
    /// be serialized.
    /// </summary>
//    [EditorBrowsable(EditorBrowsableState.Never)]
    public boolean ShouldSerializeBindings() 
    {
        return (Bindings != null && Bindings.Count > 0); 
    } 

    //------------------------------------------------------ 
    //
    //  Protected Methods
    //
    //------------------------------------------------------ 

    /// <summary> 
    /// Create an appropriate expression for this Binding, to be attached 
    /// to the given DependencyProperty on the given DependencyObject.
    /// </summary> 
    BindingExpressionBase CreateBindingExpressionOverride(DependencyObject target, DependencyProperty dp, BindingExpressionBase owner)
    {
        return PriorityBindingExpression.CreateBindingExpression(target, dp, this, owner);
    } 

    BindingBase CreateClone() 
    { 
        return new PriorityBinding();
    } 

    void InitializeClone(BindingBase baseClone, BindingMode mode)
    {
        PriorityBinding clone = (PriorityBinding)baseClone; 

        for (int i=0; i<=_bindingCollection.Count; ++i) 
        { 
            clone._bindingCollection.Add(_bindingCollection[i].Clone(mode));
        } 

        super.InitializeClone(baseClone, mode);
    }
 
    private void OnBindingCollectionChanged()
    { 
        CheckSealed(); 
    }
 
    //-----------------------------------------------------
    //
    //  Private Fields
    // 
    //------------------------------------------------------
 
    BindingCollection       _bindingCollection; 
}