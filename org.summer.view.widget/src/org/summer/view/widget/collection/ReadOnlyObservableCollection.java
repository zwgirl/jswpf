package org.summer.view.widget.collection;

import org.summer.view.widget.INotifyCollectionChanged;
import org.summer.view.widget.INotifyPropertyChanged;
import org.summer.view.widget.model.PropertyChangedEventArgs;

/// <summary> 
/// Read-only wrapper around an ObservableCollection.
/// </summary> 
//[Serializable()] 
//[TypeForwardedFrom("WindowsBase, Version=3.0.0.0, Culture=Neutral, PublicKeyToken=31bf3856ad364e35")]
public class ReadOnlyObservableCollection<T> extends ReadOnlyCollection<T> implements INotifyCollectionChanged, INotifyPropertyChanged 
{
//    #region Constructors

    //----------------------------------------------------- 
    //
    //  Constructors 
    // 
    //-----------------------------------------------------

    /// <summary>
    /// Initializes a new instance of ReadOnlyObservableCollection that
    /// wraps the given ObservableCollection.
    /// </summary> 
    public ReadOnlyObservableCollection(ObservableCollection<T> list)
    { 
    	 super(list);
        ((INotifyCollectionChanged)Items).CollectionChanged += new NotifyCollectionChangedEventHandler(HandleCollectionChanged); 
        ((INotifyPropertyChanged)Items).PropertyChanged += new PropertyChangedEventHandler(HandlePropertyChanged);
    } 

//    #endregion Constructors

//    #region Interfaces 

    //------------------------------------------------------ 
    // 
    //  Interfaces
    // 
    //-----------------------------------------------------

//    #region INotifyCollectionChanged

    /// <summary>
    /// CollectionChanged event (per <see cref="INotifyCollectionChanged" />). 
    /// </summary> 
    event NotifyCollectionChangedEventHandler INotifyCollectionChanged.CollectionChanged
    { 
        add     { CollectionChanged += value; }
        remove  { CollectionChanged -= value; }
    }

    /// <summary>
    /// Occurs when the collection changes, either by adding or removing an item. 
    /// </summary> 
    /// <remarks>
    /// see <seealso cref="INotifyCollectionChanged"/> 
    /// </remarks>
//    [field:NonSerializedAttribute()]
    protected /*virtual*/ event NotifyCollectionChangedEventHandler CollectionChanged;

    /// <summary>
    /// raise CollectionChanged event to any listeners 
    /// </summary> 
    protected /*virtual*/ void OnCollectionChanged(NotifyCollectionChangedEventArgs args)
    { 
        if (CollectionChanged != null)
        {
            CollectionChanged(this, args);
        } 
    }

//    #endregion INotifyCollectionChanged 

//    #region INotifyPropertyChanged 

    /// <summary>
    /// PropertyChanged event (per <see cref="INotifyPropertyChanged" />).
    /// </summary> 
    event PropertyChangedEventHandler INotifyPropertyChanged.PropertyChanged
    { 
        add     { PropertyChanged += value; } 
        remove  { PropertyChanged -= value; }
    } 

    /// <summary>
    /// Occurs when a property changes.
    /// </summary> 
    /// <remarks>
    /// see <seealso cref="INotifyPropertyChanged"/> 
    /// </remarks> 
//    [field:NonSerializedAttribute()]
    protected /*virtual*/ event PropertyChangedEventHandler PropertyChanged; 

    /// <summary>
    /// raise PropertyChanged event to any listeners
    /// </summary> 
    protected /*virtual*/ void OnPropertyChanged(PropertyChangedEventArgs args)
    { 
        if (PropertyChanged != null) 
        {
            PropertyChanged(this, args); 
        }
    }

//    #endregion INotifyPropertyChanged 

//    #endregion Interfaces 

//    #region Private Methods

    //------------------------------------------------------
    //
    //  Private Methods
    // 
    //------------------------------------------------------

    // forward CollectionChanged events from the base list to our listeners 
    void HandleCollectionChanged(Object sender, NotifyCollectionChangedEventArgs e)
    { 
        OnCollectionChanged(e);
    }

    // forward PropertyChanged events from the base list to our listeners 
    void HandlePropertyChanged(Object sender, PropertyChangedEventArgs e)
    { 
        OnPropertyChanged(e); 
    }

//    #endregion Private Methods

//    #region Private Fields

    //-----------------------------------------------------
    // 
    //  Private Fields 
    //
    //------------------------------------------------------ 

//    #endregion Private Fields
}