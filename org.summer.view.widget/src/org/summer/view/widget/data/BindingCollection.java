package org.summer.view.widget.data;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.collection.Collection;

/// <summary>
///  A list of bindingss, used by MultiBinding classes. 
/// </summary>
/*internal*/ public class BindingCollection extends Collection<BindingBase>
{

  //-----------------------------------------------------
  // 
  //  Constructors 
  //
  //----------------------------------------------------- 

  /// <summary> Constructor </summary>
  /*internal*/ public BindingCollection(BindingBase owner, BindingCollectionChangedCallback callback)
  { 
//      Invariant.Assert(owner != null && callback != null);
      _owner = owner; 
      _collectionChangedCallback = callback; 
  }

  // disable default constructor
  private BindingCollection()
  {
  } 



  //------------------------------------------------------
  // 
  //  Protected Methods
  //
  //-----------------------------------------------------

//  #region Protected Methods

  /// <summary> 
  /// called by base class Collection&lt;T&gt; when the list is being cleared;
  /// raises a CollectionChanged event to any listeners 
  /// </summary>
  protected /*override*/ void ClearItems()
  {
      _owner.CheckSealed(); 
      super.ClearItems();
      OnBindingCollectionChanged(); 
  } 

  /// <summary> 
  /// called by base class Collection&lt;T&gt; when an item is removed from list;
  /// raises a CollectionChanged event to any listeners
  /// </summary>
  protected /*override*/ void RemoveItem(int index) 
  {
      _owner.CheckSealed(); 
      super.RemoveItem(index); 
      OnBindingCollectionChanged();
  } 

  /// <summary>
  /// called by base class Collection&lt;T&gt; when an item is added to list;
  /// raises a CollectionChanged event to any listeners 
  /// </summary>
  protected /*override*/ void InsertItem(int index, BindingBase item) 
  { 
      if (item == null)
          throw new ArgumentNullException("item"); 
      ValidateItem(item);
      _owner.CheckSealed();

      super.InsertItem(index, item); 
      OnBindingCollectionChanged();
  } 

  /// <summary>
  /// called by base class Collection&lt;T&gt; when an item is added to list; 
  /// raises a CollectionChanged event to any listeners
  /// </summary>
  protected /*override*/ void SetItem(int index, BindingBase item)
  { 
      if (item == null)
          throw new ArgumentNullException("item"); 
      ValidateItem(item); 
      _owner.CheckSealed();

      super.SetItem(index, item);
      OnBindingCollectionChanged();
  }

//  #endregion Protected Methods


  //------------------------------------------------------
  // 
  //  Private Methods
  //
  //------------------------------------------------------

  void ValidateItem(BindingBase binding)
  { 
      // for V1, we only allow Binding as an item of BindingCollection. 
      if (!(binding instanceof Binding))
          throw new NotSupportedException(SR.Get(SRID.BindingCollectionContainsNonBinding, binding.GetType().Name)); 
  }

  void OnBindingCollectionChanged()
  { 
      if (_collectionChangedCallback != null)
          _collectionChangedCallback(); 
  } 

  //----------------------------------------------------- 
  //
  //  Private Fields
  //
  //------------------------------------------------------ 

  BindingBase _owner; 
  private BindingCollectionChangedCallback _collectionChangedCallback; 
}

//the delegate to use for getting BindingListChanged notifications
///*internal*/ public delegate void BindingCollectionChangedCallback();

