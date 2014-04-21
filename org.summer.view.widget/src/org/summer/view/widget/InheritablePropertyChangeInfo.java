package org.summer.view.widget;

/// <summary>
///     This is the data that is passed through the DescendentsWalker 
///     during an inheritable property change tree-walk.
/// </summary>
/*internal*/ public  class InheritablePropertyChangeInfo
{ 
//    #region Constructors

    /*internal*/ public  InheritablePropertyChangeInfo( 
        DependencyObject rootElement,
        DependencyProperty  property, 
        EffectiveValueEntry oldEntry,
        EffectiveValueEntry newEntry)
    {
        _rootElement = rootElement; 
        _property = property;
        _oldEntry = oldEntry; 
        _newEntry = newEntry; 
    }

//    #endregion Constructors

//    #region Properties

    /*internal*/ public  DependencyObject RootElement
    { 
        get { return _rootElement; } 
    }

    /*internal*/ public  DependencyProperty Property
    {
        get { return _property; }
    } 

    /*internal*/ public  EffectiveValueEntry OldEntry 
    { 
        get { return _oldEntry; }
    } 

    /*internal*/ public  EffectiveValueEntry NewEntry
    {
        get { return _newEntry; } 
    }

//    #endregion Properties 

//    #region Data 

    private DependencyObject _rootElement;
    private DependencyProperty  _property;
    private EffectiveValueEntry _oldEntry; 
    private EffectiveValueEntry _newEntry;

//    #endregion Data 
}
