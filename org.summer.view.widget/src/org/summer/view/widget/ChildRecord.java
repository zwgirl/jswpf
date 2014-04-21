package org.summer.view.widget;

import org.summer.view.widget.utils.ItemStructMap;

// 
//  Stores a list of properties set via explicit SetValue or Triggers or 
//  Storyboards on a TemplateNode.
// 
/*internal*/ public  class ChildRecord
{
    public ItemStructMap<ItemStructList<ChildValueLookup>> ValueLookupListFromProperty;  // Indexed by DP.GlobalIndex
} 