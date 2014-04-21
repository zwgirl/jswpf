package org.summer.view.widget.internal;

import org.summer.view.widget.WeakReference;

//#region CollectionRecord 

    // A ViewTable holds values of type CollectionRecord.  A CollectionRecord 
    // contains information relevant to a given collection.  This includes
    // information we create (e.g. the view records), and information the app
    // registers (e.g. the CollectionSynchronizationCallback).
 
    /*internal*/ class CollectionRecord
    { 
        public ViewTable ViewTable 
        {
            get { return (ViewTable)_wrViewTable.Target; } 
            set { _wrViewTable = new WeakReference(value); }
        }

        public boolean IsAlive 
        {
            get 
            { 
                return SynchronizationInfo.IsAlive ||
                    _wrViewTable.IsAlive; 
            }
        }

        public SynchronizationInfo SynchronizationInfo; 

        WeakReference _wrViewTable = ViewManager.NullWeakRef; 
    } 



//#endregion CollectionRecord 