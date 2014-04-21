package org.summer.view.widget;

/*internal*/ public class DeferredMutableDefaultReference extends DeferredReference 
{
//    #region Constructor

    /*internal*/ public DeferredMutableDefaultReference(PropertyMetadata metadata, DependencyObject d, DependencyProperty dp) 
    {
        _sourceObject = d; 
        _sourceProperty = dp; 
        _sourceMetadata = metadata;
    } 

//    #endregion Constructor

//    #region Methods 

    /*internal*/ public /*override*/ Object GetValue(BaseValueSourceInternal valueSource) 
    { 
        return _sourceMetadata.GetDefaultValue(_sourceObject, _sourceProperty);
    } 

    // Gets the type of the value it represents
    /*internal*/ public /*override*/ Type GetValueType()
    { 
        return _sourceProperty.PropertyType;
    } 

//    #endregion Methods

//    #region Properties

    /*internal*/ public PropertyMetadata SourceMetadata
    { 
        get { return _sourceMetadata; }
    } 

    protected DependencyObject SourceObject
    { 
        get { return _sourceObject; }
    }

    protected DependencyProperty SourceProperty 
    {
        get { return _sourceProperty; } 
    } 

//    #endregion Properties 

//    #region Data

    private final PropertyMetadata _sourceMetadata; 
    private final DependencyObject _sourceObject;
    private final DependencyProperty _sourceProperty; 

//    #endregion Data
} 