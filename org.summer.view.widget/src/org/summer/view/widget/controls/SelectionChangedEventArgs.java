package org.summer.view.widget.controls;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.Delegate;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.controls.primitives.Selector;
/// <summary> 
    /// The delegate type for handling a selection changed event
    /// </summary>
//    public delegate void SelectionChangedEventHandler(
//        Object sender, 
//        SelectionChangedEventArgs e);
 
    /// <summary> 
    /// The inputs to a selection changed event handler
    /// </summary> 
    public class SelectionChangedEventArgs extends RoutedEventArgs
    {
        #region Constructors
 
        /// <summary>
        /// The constructor for selection changed args 
        /// </summary> 
        /// <param name="id">The event ID for the event about to fire -- should probably be Selector.SelectionChangedEvent</param>
        /// <param name="removedItems">The items that were unselected during this event</param> 
        /// <param name="addedItems">The items that were selected during this event</param>
        public SelectionChangedEventArgs(
            RoutedEvent id,
            IList removedItems, 
            IList addedItems)
        { 
            if (id == null) 
                throw new ArgumentNullException("id");
            if (removedItems == null) 
                throw new ArgumentNullException("removedItems");
            if (addedItems == null)
                throw new ArgumentNullException("addedItems");
 
            RoutedEvent = id;
 
            _removedItems = new Object[removedItems.Count]; 
            removedItems.CopyTo(_removedItems, 0);
 
            _addedItems = new Object[addedItems.Count];
            addedItems.CopyTo(_addedItems, 0);
        }
 
        /*internal*/ public SelectionChangedEventArgs(List</*ItemsControl.*/ItemInfo> unselectedInfos, List</*ItemsControl.*/ItemInfo> selectedInfos)
        { 
            RoutedEvent = Selector.SelectionChangedEvent; 

            _removedItems = new Object[unselectedInfos.Count]; 
            for (int i=0; i<unselectedInfos.Count; ++i)
            {
                _removedItems[i] = unselectedInfos[i].Item;
            } 

            _addedItems = new Object[selectedInfos.Count]; 
            for (int i=0; i<selectedInfos.Count; ++i) 
            {
                _addedItems[i] = selectedInfos[i].Item; 
            }

            _removedInfos = unselectedInfos;
            _addedInfos = selectedInfos; 
        }
 
//        #endregion 

//        #region Public Properties 

        /// <summary>
        /// An IList containing the items that were unselected during this event
        /// </summary> 
        public IList RemovedItems
        { 
            get { return _removedItems; } 
        }
 
        /// <summary>
        /// An IList containing the items that were selected during this event
        /// </summary>
        public IList AddedItems 
        {
            get { return _addedItems; } 
        } 

//        #endregion 

//        #region Internal Properties

        /// <summary> 
        /// A list containing the ItemInfos that were unselected during this event
        /// </summary> 
        /*internal*/ public List</*ItemsControl.*/ItemInfo> RemovedInfos 
        {
            get { return _removedInfos; } 
        }

        /// <summary>
        /// A list containing the ItemInfos that were selected during this event 
        /// </summary>
        /*internal*/ public List</*ItemsControl.*/ItemInfo> AddedInfos 
        { 
            get { return _addedInfos; }
        } 

//        #endregion

//        #region Protected Methods 

        /// <summary> 
        /// This method is used to perform the proper type casting in order to 
        /// call the type-safe SelectionChangedEventHandler delegate for the SelectionChangedEvent event.
        /// </summary> 
        /// <param name="genericHandler">The handler to invoke.</param>
        /// <param name="genericTarget">The current Object along the event's route.</param>
        protected /*override*/ void InvokeEventHandler(Delegate genericHandler, Object genericTarget)
        { 
            SelectionChangedEventHandler handler = (SelectionChangedEventHandler)genericHandler;
 
            handler(genericTarget, this); 
        }
 
//        #endregion

//        #region Data
 
        private Object[] _addedItems;
        private Object[] _removedItems; 
        private List</*ItemsControl.*/ItemInfo> _addedInfos; 
        private List</*ItemsControl.*/ItemInfo> _removedInfos;
 
//        #endregion
    }