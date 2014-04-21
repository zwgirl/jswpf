package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;

//[DebuggerDisplay("Index: {Index}  Item: {Item}")]
/*internal*/public class ItemInfo 
{ 
  /*internal*/public Object Item { get; private set; }
  /*internal*/public DependencyObject Container { get; set; } 
  /*internal*/public int Index { get; set; }

  /*internal*/public static final DependencyObject SentinelContainer = new DependencyObject();
  /*internal*/public static final DependencyObject UnresolvedContainer = new DependencyObject(); 
  /*internal*/public static final DependencyObject KeyContainer = new DependencyObject();
  /*internal*/public static final DependencyObject RemovedContainer = new DependencyObject(); 

  public ItemInfo(Object item, DependencyObject container/*=null*/, int index/*=-1*/)
  { 
      Item = item;
      Container = container;
      Index = index;
  } 

  /*internal*/public boolean IsResolved { get { return Container != UnresolvedContainer; } } 
  /*internal*/public boolean IsKey { get { return Container == KeyContainer; } } 
  /*internal*/public boolean IsRemoved { get { return Container == RemovedContainer; } }

  /*internal*/public ItemInfo Clone()
  {
      return new ItemInfo(Item, Container, Index);
  } 

  /*internal*/public static ItemInfo Key(ItemInfo info) 
  { 
      return (info.Container == UnresolvedContainer)
          ? new ItemInfo(info.Item, KeyContainer, -1) 
          : info;
  }

  public /*override*/ int GetHashCode() 
  {
      return (Item != null) ? Item.GetHashCode() : 314159; 
  } 

  public /*override*/ boolean Equals(Object o) 
  {
      if (o == (Object)this)
          return true;

      ItemInfo that = o as ItemInfo;
      if (that == null) 
          return false; 

      return Equals(that, matchUnresolved:false); 
  }

  /*internal*/ boolean Equals(ItemInfo that, boolean matchUnresolved)
  { 
      // Removed matches nothing
      if (this.IsRemoved || that.IsRemoved) 
          return false; 

      // items must match (the paranoia for UnsetValue is to avoid problems with 
      // classes that implement Object.Equals poorly, as in Dev11 439664)
      if (this.Item == DependencyProperty.UnsetValue && that.Item != DependencyProperty.UnsetValue)
          return false;
      if (that.Item == DependencyProperty.UnsetValue && this.Item != DependencyProperty.UnsetValue) 
          return false;
      if (!Object.Equals(this.Item, that.Item)) 
          return false; 

      // Key matches anything, except Unresolved when matchUnresovled is false 
      if (this.Container == KeyContainer)
          return matchUnresolved || that.Container != UnresolvedContainer;
      else if (that.Container == KeyContainer)
          return matchUnresolved || this.Container != UnresolvedContainer; 

      // Unresolved matches nothing 
      if (this.Container == UnresolvedContainer || that.Container == UnresolvedContainer) 
          return false;

      return
          (this.Container == that.Container)
           ?  (this.Container == SentinelContainer)
               ?  (this.Index == that.Index)      // Sentinel => negative indices are significant 
               :  (this.Index < 0 || that.Index < 0 ||
                      this.Index == that.Index)   // ~Sentinel => ignore negative indices 
           :  (this.Container == SentinelContainer) ||    // sentinel matches non-sentinel 
              (that.Container == SentinelContainer) ||
              (   (this.Container == null || that.Container == null) &&   // null matches non-null 
                  (this.Index < 0 || that.Index < 0 ||                    // provided that indices match
                      this.Index == that.Index));
  }

  public static boolean operator ==(ItemInfo info1, ItemInfo info2)
  { 
      return Object.Equals(info1, info2); 
  }

  public static boolean operator !=(ItemInfo info1, ItemInfo info2)
  {
      return !Object.Equals(info1, info2);
  } 

  // update container and index with current values 
  /*internal*/ ItemInfo Refresh(ItemContainerGenerator generator) 
  {
      if (Container == null && Index < 0) 
      {
          Container = generator.ContainerFromItem(Item);
      }

      if (Index < 0 && Container != null)
      { 
          Index = generator.IndexFromContainer(Container); 
      }

      if (Container == null && Index >= 0)
      {
          Container = generator.ContainerFromIndex(Index);
      } 

      if (Container == SentinelContainer && Index >= 0) 
      { 
          Container = null;   // caller explicitly wants null container
      } 

      return this;
  }

  // Don't call this on entries used in hashtables - it changes the hashcode
  /*internal*/ void Reset(Object item) 
  { 
      Item = item;
  } 
}