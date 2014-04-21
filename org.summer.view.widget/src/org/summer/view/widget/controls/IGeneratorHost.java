package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.data.CollectionViewGroup;

//-----------------------------------------------------
//
//  Interface - IGeneratorHost
// 
//-----------------------------------------------------
public interface IGeneratorHost{
/// <summary> 
/// The view of the data
/// </summary> 
ItemCollection View;

/// <summary> 
/// Return true if the item is (or is eligible to be) its own ItemContainer 
/// </summary>
boolean IsItemItsOwnContainer(Object item);

/// <summary>
/// Return the element used to display the given item 
/// </summary> 
DependencyObject GetContainerForItem(Object item);
/// <summary>
/// Prepare the element to act as the ItemContainer for the corresponding item.
/// </summary> 
void PrepareItemContainer(DependencyObject container, Object item);

/// <summary> 
/// Undo any initialization done on the element during GetContainerForItem and PrepareItemContainer
/// </summary> 
void ClearContainerForItem(DependencyObject container, Object item);



/// <summary> 
/// Determine if the given element was generated for this host as an ItemContainer. 
/// </summary>
boolean IsHostForItemContainer(DependencyObject container);

/// <summary>
/// Return the GroupStyle (if any) to use for the given group at the given level. 
/// </summary>
GroupStyle GetGroupStyle(CollectionViewGroup group, int level);

/// <summary>
/// Communicates to the host that the generator is using grouping. 
/// </summary>
void SetIsGrouping(boolean isGrouping);

/// <summary>
/// The AlternationCount
/// <summary> 
int AlternationCount;
