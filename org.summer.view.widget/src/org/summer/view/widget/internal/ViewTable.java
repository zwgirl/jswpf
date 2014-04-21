package org.summer.view.widget.internal;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.CollectionViewSource;
import org.summer.view.widget.collection.ArrayList;
import org.summer.view.widget.collection.DictionaryEntry;
import org.summer.view.widget.collection.HybridDictionary;
import org.summer.view.widget.data.CollectionView;

 
//#region ViewTable

    /*internal*/ class ViewTable extends HybridDictionary
    { 
        //-----------------------------------------------------
        // 
        //  Internal Properties 
        //
        //----------------------------------------------------- 

        /*internal*/ ViewRecord this[CollectionViewSource cvs]
        {
            get { return (ViewRecord)super[new WeakRefKey(cvs)]; } 
            set
            { 
//                Debug.Assert(cvs != null, "Required CVS key is missing"); 
                super[new WeakRefKey(cvs)] = value;
            } 
        }

        // remove entries whose key (CVS) has been GC'd, and whose collection
        // view is no longer in use.  Return true if anything got removed, 
        // or if there are no entries left
        /*internal*/public boolean Purge() 
        { 
            ArrayList al = new ArrayList();
            for/*each*/ (DictionaryEntry de : this) 
            {
                WeakRefKey key = (WeakRefKey)de.Key;
                if (key.Target == null)
                { 
                    ViewRecord vr = (ViewRecord)de.Value;
                    CollectionView cv = vr.View as CollectionView; 
 
                    if (cv != null)
                    { 
                        if (!cv.IsInUse)
                        {
                            // tell the corresponding CollectionView to detach
                            cv.DetachFromSourceCollection(); 
                            al.Add(key);    // mark this entry for removal
                        } 
                    } 
                    else
                    { 
                        al.Add(key);
                    }
                }
            } 

            for (int k=0; k<al.Count; ++k) 
            { 
                this.Remove(al[k]);
            } 

            return (al.Count > 0 || this.Count == 0);
        }
    } 

//#endregion ViewTable 
 

 



