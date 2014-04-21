package org.summer.view.widget.internal;
import org.summer.view.widget.model.ICollectionView;


//#region ViewRecord
 
    // A ViewTable holds values of type ViewRecord.  A ViewRecord is a pair
    // [view, version], where view is the collection view and version is the
    // version number in effect when the CollectionViewSource last set the
    // view's properties. 

    /*internal*/public class ViewRecord 
    { 
        /*internal*/ ViewRecord(ICollectionView view)
        { 
            _view = view;
            _version = -1;
        }
 
        /*internal*/ public ICollectionView View
        { 
            get { return _view; } 
        }
 
        /*internal*/public int Version
        {
            get { return _version; }
            set { _version = value; } 
        }
 
        /*internal*/public boolean IsInitialized 
        {
            get { return _isInitialized; } 
        }

        /*internal*/public void InitializeView()
        { 
            _view.MoveCurrentToFirst();
            _isInitialized = true; 
        } 

        ICollectionView     _view; 
        int                 _version;
        boolean                _isInitialized = false;
    }
 
//#endregion ViewRecord