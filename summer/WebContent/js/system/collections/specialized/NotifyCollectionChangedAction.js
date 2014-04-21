/**
 * NotifyCollectionChangedAction
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var NotifyCollectionChangedAction = declare("NotifyCollectionChangedAction", Object,{ 
    });	
    
    /// <summary> One or more items were added to the collection. </summary> 
    NotifyCollectionChangedAction.Add = 0;
    /// <summary> One or more items were removed from the collection. </summary> 
    NotifyCollectionChangedAction.Remove = 1;
    /// <summary> One or more items were replaced in the collection. </summary>
    NotifyCollectionChangedAction.Replace = 2;
    /// <summary> One or more items were moved within the collection. </summary> 
    NotifyCollectionChangedAction.Move = 3;
    /// <summary> The contents of the collection changed dramatically. </summary> 
    NotifyCollectionChangedAction.Reset = 4; 

    NotifyCollectionChangedAction.Type = new Type("NotifyCollectionChangedAction", NotifyCollectionChangedAction, [Object.Type]);
    return NotifyCollectionChangedAction;
});

///// <summary>
///// This enum describes the action that caused a CollectionChanged event.
///// </summary>
//[TypeForwardedFrom("WindowsBase, Version=3.0.0.0, Culture=Neutral, PublicKeyToken=31bf3856ad364e35")] 
//public enum NotifyCollectionChangedAction
//{ 
//    /// <summary> One or more items were added to the collection. </summary> 
//    Add,
//    /// <summary> One or more items were removed from the collection. </summary> 
//    Remove,
//    /// <summary> One or more items were replaced in the collection. </summary>
//    Replace,
//    /// <summary> One or more items were moved within the collection. </summary> 
//    Move,
//    /// <summary> The contents of the collection changed dramatically. </summary> 
//    Reset, 
//}