/**
 * ViewManager
 */
/***************************************************************************\
    Avalon data binding supports multiple views over a data collection.
    Each view (CollectionView) is identified by a key (CollectionViewSource), and
    can be sorted and filtered independently of other views. 

    Managing the lifetimes of the views involves some subtle challenges. 
    Do not modify the code in this file until you understand these issues! 

    The fundamental design goal is that a collection should not be responsible 
    for managing its own views.  A collection is a data-centric object, while a
    view (or a set of views) is UI-centric.  Therefore view management is a job
    for UI-related code.  The view manager cannot modify the collection in any
    way, nor can it can assume that the collection has a reference to the view. 

    This principle allows us to define the IDataCollection interface in a 
    system assembly, where it is visible to third-parties who can then 
    implement their own collection classes without having to know anything
    about view management.  It also allows us to create views over collections 
    that don't even implement IDataCollection;  for instance, we support
    views over an IList (and thus over any Array, ArrayList, etc.).

    However, this principle makes lifetime management very tricky.  An 
    application may create views named "A", "B", and "C" over a given
    data collection, and apply a particular sort order to each view.  Next 
    the application may release all its references to view "C", while keeping 
    references to views "A" and "B and to the collection itself.  Then the
    application may refer to view "C" again, and will expect it to still have 
    the same currency, sort order, etc.  Thus view "C" must be kept alive as long
    as the collection itself (or any other view on the collection).  However, once
    the application releases its references to the collection and all its views,
    they should become eligible for garbage collection. 

    If the collection managed its own views, there would be no problem.  You 
    could imagine drawing a dotted line surrounding the collection and its 
    views.  All references related to view management would be contained inside
    this line, so as soon as the application released its references, the 
    objects inside the line could be garbage collected.

    With "external" view management, it gets much harder.  The manager will
    obviously require some references to the collection and its views.  The 
    trick is to create these references in such a way that they keep the objects
    alive as long as necessary, but no longer.  Here's how we do it. 
 
    For each collection, the manager has a ViewTable - a dictionary that maps
    keys into views.  The table contains strong references to the views, and of 
    course each view has a strong reference to its underlying collection.  This
    guarantees that the collection stays alive as long as any view.

    The view manager has a master ViewManager - a dictionary that maps 
    collections to ViewTables.  This is a "global" table, so it must not contain
    a strong reference to a collection (which would keep the collection alive 
    forever).  Instead, it contains weak references to the collection and to 
    its ViewTable.  Now you can draw a dotted line around the collection and
    its ViewTable;  all strong references are either inside the line, or 
    correspond to the application's references to the collection or its views.
    Thus when the application releases all its references, the collection and
    its views can be garbage collected.  This will invalidate the weak references
    in the master ViewManager;  we occasionally purge the table of dead 
    references.
 
    So far, the only reference to the ViewTable is the weak reference stored in 
    the master ViewManager.  This is not enough to keep the ViewTable alive;
    we need some way to keep it alive as long as any of the views in it are alive. 
    We do this by giving each view a strong reference back to its ViewTable,
    using the mysterious ViewManagerData property of a DataCollectionView.  This
    adds more strong references inside the dotted line.  These do not affect
    our garbage collection goal, but do keep the ViewTable alive. 

    The picture:  (arrows with bulbs are weak references:  o---> ) 
 
            ________________________________
           |                |               | 
        /--|-o(collection)  |  (ViewTable)o-|--\
        |  |                |               |   |
        |  |________________________________|   |
        |                                       | 
      _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    |   |                                       v              | 
        |                               _______________ 
    |   |                              |               |<--\   |
        |    /-------------------------|---- View "A" -|---| 
    |   v   v                          |               |   |   |
      Collection <---------------------|---- View "B" -|---|
    |       ^                          |               |   |   |
             \-------------------------|---- View "C" -|---| 
    |                                  |_______________|       |
 
    | _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _| 

    not shown:  Strong references from collection to view due to 
    event listeners.


    Dev10 bug 452676 exposed a small flaw in this scheme.  The "not shown" 
    strong reference from the collection to a view (via the CollectionChanged event)
    turns out to be important.  It keeps the view alive at least as 
    long as the collection, even if the app releases all its references to views. 
    If the collection doesn't expose INotifyCollectionChanged, this reference isn't
    present, and you can draw a smaller dotted line around the views and the view 
    table that has no incoming strong references.  This means the view table (and
    the views) can get GC'd.

    We can't fix this.  We need that strong reference, but without an event there's 
    no way to get it (remember, we can't touch the collection itself).  But we can
    mitigate it. 
 
    Here's the mitigation.  The view manager keeps a list of strong references to the
    relevant view tables, each with an "expiration date" (an integer).  At 
    each purge cycle, decrease the expiration dates and discard the ones that reach
    zero.  Whenever there is actual activity on a view table, reset its expiration
    date to the initial value N.  This keeps the view table alive for N purge cycles
    after its last activity, so it can survive a short transition period of inactivity 
    such as the one in bug 452676.  This will also keep the collection alive for up
    to N purge cycles longer than before, which customer may perceive as a leak. 
 
\***************************************************************************/
define(["dojo/_base/declare", "system/Type", "internal.data/DataBindEngine", "specialized/HybridDictionary", 
        "internal.data/SynchronizationInfo", "componentmodel/ICollectionViewFactory",
        "componentmodel/IBindingList", "data/ListCollectionView", "data/BindingOperations"], 
		function(declare, Type, DataBindEngine, HybridDictionary, 
				SynchronizationInfo, ICollectionViewFactory,
				IBindingList, ListCollectionView, BindingOperations){
	 
    // This is the N from the mitigation description (see the comment at the 
    // top of the file.  Increasing this value enables views to 
    // survive a longer period of inactivity, but also means
    // the collection will live past its normal lifetime a longer time. 
    // There's a tradeoff between robustness and perceived leaking.
//    const int 
    var InactivityThreshold = 2;
//    static object
    var StaticObject = {};
    
//    // for use as the key to a hashtable, when the "real" key is an object 
//    // that we should not keep alive by a strong reference.
////    internal struct 
//    var WeakRefKey = declare(null, {
// 
//        constructor:function(/*object*/ target)
//        { 
////            _weakRef = new WeakReference(target);
//        	this._target = target;
//            this._hashCode = (target != null) ? target.GetHashCode() : 314159;
//        },
// 
////        public override int 
//        GetHashCode:function() 
//        {
//            return this._hashCode; 
//        }, 
//
////        public override bool 
//        Equals:function(/*object*/ o) 
//        {
//            if (o instanceof WeakRefKey)
//            {
//                return (this.Target == o.Target); 
//            }
//            return false; 
//        }
//    });
//    
//    Object.defineProperties(WeakRefKey.prototype, {
////        internal object 
//    	Target:
//        {
//            get:function() { return this._target; } 
//        }
//    });
    
	//  internal class 
	var ViewTable = declare("ViewTable", HybridDictionary, {
		Get:function(/*CollectionViewSource*/ cvs) { 
			return HybridDictionary.prototype.Get.call(this, cvs); 
		}, 
		Set:function(/*CollectionViewSource*/ cvs, value)
		{ 
			HybridDictionary.prototype.Set.call(this, cvs, value);
		},
	      
	      // remove entries whose key (CVS) has been GC'd, and whose collection
	      // view is no longer in use.  Return true if anything got removed, 
	      // or if there are no entries left
	//      internal bool 
	      Purge:function() 
	      { 
	          /*ArrayList*/var al = new ArrayList();
	          for/*each*/ (/*DictionaryEntry*/ de in this) 
	          {
	              /*WeakRefKey*/var key = de.Key;
	              if (key.Target == null)
	              { 
	                  /*ViewRecord*/var vr = de.Value;
	                  /*CollectionView*/var cv = vr.View instanceof CollectionView ? vr.View : null; 
	
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
	
	          for (var k=0; k<al.Count; ++k) 
	          { 
	              this.Remove(al[k]);
	          } 
	
	          return (al.Count > 0 || this.Count == 0);
	      }
	  });
	
	  // A ViewTable holds values of type ViewRecord.  A ViewRecord is a pair
      // [view, version], where view is the collection view and version is the
      // version number in effect when the CollectionViewSource last set the
      // view's properties. 
	  //  internal class
	  var ViewRecord = declare("ViewRecord", null, {
	  	constructor:function(view)
	      { 
	          this._view = view;
	          this._version = -1;
	      },
	//      internal void 
	      InitializeView:function()
	      { 
	          this._view.MoveCurrentToFirst();
	          this._isInitialized = true; 
	      } 
	      
	  });
	  
	  Object.defineProperties(ViewRecord.prototype, {
	//  	 internal ICollectionView 
	  	 View:
	  	 { 
	  		 get:function() { return this._view; } 
	  	 },
   
	//       internal int 
	  	 Version:
	  	 {
	  		 get:function() { return this._version; },
	  		 set:function(value) { this._version = value; } 
	  	 },
	
	//       internal bool 
	  	 IsInitialized: 
	  	 {
	  		 get:function() { return this._isInitialized; } 
	  	 }
	  });
	  
	
	  // A ViewTable holds values of type CollectionRecord.  A CollectionRecord 
	  // contains information relevant to a given collection.  This includes
	  // information we create (e.g. the view records), and information the app
	  // registers (e.g. the CollectionSynchronizationCallback).
	
	  //  internal class 
	  var CollectionRecord = declare("CollectionRecord", null , {
		  constructor:function(){
			  this._wrViewTable = null;
		  }
	  });
	  
	  Object.defineProperties(CollectionRecord.prototype, {
	//  	public ViewTable 
	  	ViewTable: 
	      {
	          get:function() { return this._wrViewTable/*.Target*/; }, 
	          set:function(value) { this._wrViewTable = value; }//new WeakReference(value); }
	      },
	
	//      public bool 
	      IsAlive:
	      {
	          get:function() 
	          { 
	              return SynchronizationInfo.IsAlive /*|| this._wrViewTable.IsAlive*/; 
	          }
	      }
	  });
	  
	
	  var ViewManager = declare("ViewManager", HybridDictionary, {
		  constructor:function(){
			   this._inactiveViewTables = new HybridDictionary();
		  },
	//      internal void 
	      Add:function(/*object*/ collection, /*CollectionRecord*/ cr)
	      {
	    	  HybridDictionary.prototype.Add.call(this, collection, cr);
	      }, 
	
	      /// <summary> 
	      /// Return the object associated with (collection, cvs, type). 
	      /// If this is the first reference to this view, add it to the tables.
	      /// </summary> 
	      /// <exception cref="ArgumentException">
	      /// Thrown when the collectionViewType does not implement ICollectionView
	      /// or does not have a constructor that accepts the type of collection.
	      /// Also thrown when the named collection view already exists and is 
	      /// not the specified collectionViewType.
	      /// </exception> 
	//      internal ViewRecord 
	      GetViewRecord:function(/*object*/ collection, 
	    		  /*CollectionViewSource*/ cvs, /*Type*/ collectionViewType, 
	    		  /*bool*/ createView, /*Func<object, object>*/ GetSourceItem) 
	      {
	          // Order of precendence in acquiring the View: 
	          // 0) If  collection is already a CollectionView, return it.
	          // 1) If the CollectionView for this collection has been cached, then
	          //    return the cached instance.
	          // 2) If a CollectionView derived type has been passed in collectionViewType 
	          //    create an instance of that Type
	          // 3) If the collection is an ICollectionViewFactory use ICVF.CreateView() 
	          //    from the collection 
	          // 4) If the collection is an IListSource call GetList() and perform 5),
	          //    etc. on the returned list 
	          // 5) If the collection is an IBindingList return a new BindingListCollectionView
	          // 6) If the collection is an IList return a new ListCollectionView
	          // 7) If the collection is an IEnumerable, return a new CollectionView
	          //    (it uses the ListEnumerable wrapper) 
	          // 8) return null
	          // An IListSource must share the view with its underlying list. 
	
	          // if the view already exists, just return it
	          // Also, return null if it doesn't exist and we're called in "lazy" mode 
	          /*ViewRecord*/
	    	  var viewRecord = this.GetExistingView(collection, cvs, collectionViewType, GetSourceItem);
	          if (viewRecord != null || !createView)
	          {
	              return viewRecord; 
	          }
	
	          // If the collection is an IListSource, it uses the same view as its 
	          // underlying list.
	          /*IListSource*/
	          var ils = collection instanceof IListSource ? collection : null; 
	          /*IList*/var ilsList = null;
	          if (ils != null)
	          {
	              ilsList = ils.GetList(); 
	              viewRecord = this.GetExistingView(ilsList, cvs, collectionViewType, GetSourceItem);
	
	              if (viewRecord != null) 
	              {
	                  return this.CacheView(collection, cvs, viewRecord.View, viewRecord); 
	              }
	          }
	
	          // Create a new view 
	          /*ICollectionView*/
	          var icv = collection instanceof ICollectionView ? collection : null;
	
	          if (icv != null) 
	          {
	              icv = new CollectionViewProxy(icv); 
	          }
	          else if (collectionViewType == null)
	          {
	              // Caller didn't specify a type for the view. 
	              /*ICollectionViewFactory*/var icvf = collection instanceof ICollectionViewFactory ? collection: null;
	              if (icvf != null) 
	              { 
	                  // collection is a view factory - call its factory method
	                  icv = icvf.CreateView(); 
	              }
	              else
	              {
	                  // collection is not a factory - create an appropriate view 
	                  /*IList*/var il = (ilsList != null) ? ilsList : collection instanceof IList ? collection : null;
	                  if (il != null) 
	                  { 
	                      // create a view on an IList or IBindingList
	                      /*IBindingList*/var ibl = il instanceof IBindingList ? il : null; 
	                      if (ibl != null)
	                          icv = new BindingListCollectionView(ibl);
	                      else
	                          icv = new ListCollectionView(il); 
	                  }
	                  else 
	                  { 
	                      // collection is not IList, wrap it
	                      /*IEnumerable*/var ie = collection instanceof IEnumerable ? collection : null; 
	                      if (ie != null)
	                      {
	                          icv = new EnumerableCollectionView(ie);
	                      } 
	                  }
	              } 
	          } 
	          else
	          { 
	              // caller specified a type for the view.  Try to honor it.
	              if (!ICollectionView.Type.IsAssignableFrom(collectionViewType))
	                  throw new ArgumentException(SR.Get(SRID.CollectionView_WrongType, collectionViewType.Name));
	
	              // if collection is IListSource, get its list first (bug 1023903)
	              /*object*/var arg = (ilsList != null) ? ilsList : collection; 
	
	              try
	              { 
	                  icv = Activator.CreateInstance(collectionViewType,
	                                  System.Reflection.BindingFlags.CreateInstance, null,
	                                  [arg], null);
	                  icv = icv instanceof ICollectionView ? icv : null;
	              } 
	              catch (/*MissingMethodException*/ e)
	              { 
	                  throw new ArgumentException(SR.Get(SRID.CollectionView_ViewTypeInsufficient, 
	                                  collectionViewType.Name, collection.GetType()), e);
	              } 
	          }
	
	          // if we got a view, add it to the tables
	          if (icv != null) 
	          {
	              // if the view doesn't derive from CollectionView, create a proxy that does 
	              /*CollectionView*/
	        	  var cv = icv instanceof CollectionView ? icv : null; 
	              if (cv == null)
	                  cv = new CollectionViewProxy(icv); 
	
	              if (ilsList != null)    // IListSource's list shares the same view
	                  viewRecord = this.CacheView(ilsList, cvs, cv, null);
	
	              viewRecord = this.CacheView(collection, cvs, cv, viewRecord);   //cym comment
	
	              // raise the event for a new view 
	              BindingOperations.OnCollectionViewRegistering(cv);
	          } 
	
	          return viewRecord;
	      },
	
	      // return the CollectionRecord for the given collection.  If one doesn't
	      // exist yet, create it and raise the CollectionRegistering event 
	//      CollectionRecord 
	      EnsureCollectionRecord:function(/*object*/ collection, /*Func<object, object>*/ GetSourceItem/*=null*/) 
	      {
	    	  if(GetSourceItem === undefined){
	    		  GetSourceItem = null;
	    	  }
	    	  
	          /*CollectionRecord*/
	    	  var cr = this.Get(collection); 
	          if (cr == null)
	          {
	              cr = new CollectionRecord();
	              this.Add(collection, cr); 
	
	              var parent = (GetSourceItem != null) ? GetSourceItem(collection) : null; 
	              var ie = collection instanceof IEnumerable ? collection : null; 
	              if (ie != null)
	              { 
	                  BindingOperations.OnCollectionRegistering(ie, parent);
	              }
	          }
	
	          return cr;
	      },
	      
		//      internal void 
	      RegisterCollectionSynchronizationCallback:function(
	                          /*IEnumerable*/ collection, 
	                          /*object*/ context,
	                          /*CollectionSynchronizationCallback*/ synchronizationCallback)
	      {
	          /*CollectionRecord*/
	    	  var cr = this.EnsureCollectionRecord(collection); 
	          cr.SynchronizationInfo = new SynchronizationInfo(context, synchronizationCallback);
	
	          /*ViewTable*/
	          var vt = cr.ViewTable; 
	          if (vt != null)
	          { 
	              var isSynchronized = cr.SynchronizationInfo.IsSynchronized;
	              for/*each*/ (var i=0; i<vt.Count; i++) ///*DictionaryEntry*/var de in vt)
	              {
	                  /*ViewRecord*/
	            	  var vr = vt.Get(i).Value; 
	                  /*CollectionView*/
	            	  var cv = vr.View instanceof CollectionView ? vr.View : null;
	                  if (cv != null) 
	                  { 
	                      cv.SetAllowsCrossThreadChanges(isSynchronized);
	                  } 
	              }
	          }
	      },
	
	//      internal SynchronizationInfo 
	      GetSynchronizationInfo:function(/*IEnumerable*/ collection)
	      { 
	          /*CollectionRecord*/
	    	  var cr = this.Get(collection); 
	          return (cr != null)? cr.SynchronizationInfo : SynchronizationInfo.None;
	      }, 
	//      public void 
	      AccessCollection:function(
	                          /*IEnumerable*/ collection,
	                          /*Action*/ accessMethod, 
	                          /*bool*/ writeAccess)
	      { 
	          /*SynchronizationInfo*/
	    	  var si = this.GetSynchronizationInfo(collection); 
	          si.AccessCollection(collection, accessMethod, writeAccess);
	      },
	      
	//      private ViewRecord 
	      GetExistingView:function(/*object*/ collection, /*CollectionViewSource*/ cvs, 
	      		/*Type*/ collectionViewType, /*Func<object, object>*/ GetSourceItem)
	      { 
	          /*ViewRecord*/
	    	  var result;
	          /*CollectionView*/
	    	  var cv = collection instanceof CollectionView ? collection : null;
	
	          if (cv == null) 
	          {
	              // look up cached entry 
	              /*CollectionRecord*/
	        	  var cr = this.EnsureCollectionRecord(collection, GetSourceItem); 
	              /*ViewTable*/
	        	  var vt = cr.ViewTable;
	              if (vt != null) 
	              {
	                  /*ViewRecord*/var vr = vt.Get(cvs);
	                  if (vr != null)
	                  { 
	                      cv = vr.View;
	                  } 
	                  result = vr; 
	
	                  // activity on the VT - reset its expiration date 
	                  if (this._inactiveViewTables.Contains(vt))
	                  {
	                	  this._inactiveViewTables.Set(vt, this.InactivityThreshold);
	                  } 
	              }
	              else 
	              { 
	                  result = null;
	              } 
	          }
	          else
	          {
	              // the collection is already a view, just use it directly (no tables needed) 
	              result = new ViewRecord(cv);
	          } 
	
	          if (cv != null)
	          { 
	        	  this.ValidateViewType(cv, collectionViewType);
	          }
	
	          return result; 
	      },
	
	//      private ViewRecord 
	      CacheView:function(/*object*/ collection, /*CollectionViewSource*/ cvs, /*CollectionView*/ cv, /*ViewRecord*/ vr) 
	      {
	          // create the view table, if necessary 
	          /*CollectionRecord*/
	    	  var cr = this.Get(collection);
	          /*ViewTable*/
	    	  var vt = cr.ViewTable;
	          if (vt == null)
	          { 
	              vt = new ViewTable();
	              cr.ViewTable = vt; 
	
	              // if the collection doesn't implement INCC, it won't hold a strong
	              // reference to its views.  To mitigate Dev10 bug 452676, keep a 
	              // strong reference to the ViewTable alive for at least a few
	              // Purge cycles.  (See comment at the top of the file.)
	              if (!(collection instanceof INotifyCollectionChanged))
	              { 
	                  this._inactiveViewTables.Add(vt, InactivityThreshold);
	              } 
	          } 
	
	          // keep the view and the view table alive as long as any view 
	          // (or the collection itself) is alive
	          if (vr == null)
	              vr = new ViewRecord(cv);
	          else if (cv == null) 
	              cv = vr.View;
	          cv.SetViewManagerData(vt); 
	
	          // add the view to the table
	          vt.Set(cvs, vr); 
	          return vr;
	      },
	
	      // purge the table of dead entries 
	//      internal bool 
	      Purge:function()
	      { 
	          // decrease the expiration dates of ViewTables on the inactive 
	          // list, and remove the ones that have expired.
	          var n = this._inactiveViewTables.Count; 
	          if (n > 0)
	          {
	             /* ViewTable[]*/var keys = new ViewTable.Get(n);
	              this._inactiveViewTables.Keys.CopyTo(keys, 0); 
	
	              for (var i=0; i<n; ++i) 
	              { 
	                  /*ViewTable*/var vt = keys.Get(i);
	                  var expirationDate = this._inactiveViewTables.Get(vt); 
	                  if (--expirationDate > 0)
	                  {
	                  	this._inactiveViewTables.Set(vt, expirationDate);
	                  } 
	                  else
	                  { 
	                  	this._inactiveViewTables.Remove(vt); 
	                  }
	              } 
	          }
	
	          // purge the table of entries whose collection has been GC'd.
	          /*ArrayList*/var al = new ArrayList(); 
	          var foundViewTableDirt = false;
	
	          for (/*DictionaryEntry*/var de in this) 
	          {
	              /*WeakRefKey*/var key = de.Key; 
	              /*CollectionRecord*/var cr = de.Value;
	
	              if (key.Target == null || !cr.IsAlive)
	              { 
	                  al.Add(key);
	              } 
	              else 
	              {
	                  // also purge ViewTable entries whose key (CVS) has been GC'd 
	                  /*ViewTable*/var vt = cr.ViewTable;
	                  if (vt != null && vt.Purge())
	                  {
	                      foundViewTableDirt = true; 
	                      if (vt.Count == 0)
	                      { 
	                          // remove the ViewTable (it has no views remaining) 
	                          cr.ViewTable = null;
	
	                          if (!cr.IsAlive)
	                          {
	                              al.Add(key);
	                          } 
	                      }
	                  } 
	              } 
	          }
	
	          for (var k=0; k<al.Count; ++k)
	          {
	              this.Remove(al[k]);
	          } 
	
	          return (al.Count > 0 || foundViewTableDirt); 
	      },
	
	//      private void 
	      ValidateViewType:function(/*CollectionView*/ cv, /*Type*/ collectionViewType) 
	      {
	          if (collectionViewType != null)
	          {
	              // If the view contained in the ViewTable is a proxy of another 
	              // view, then what we really want to compare is the type of that
	              // other view. 
	              /*CollectionViewProxy*/
	        	  var cvp = cv instanceof CollectionViewProxy ? cv : null; 
	              /*Type*/
	        	  var cachedViewType = (cvp == null) ? cv.GetType() : cvp.ProxiedView.GetType();
	
	              if (cachedViewType != collectionViewType)
	                  throw new ArgumentException(SR.Get(SRID.CollectionView_NameTypeDuplicity, collectionViewType, cachedViewType));
	          }
	      },
	      
	//      public new CollectionRecord 
	      Get:function(/*object*/ o)
	      {
//	    	  var key = new WeakRefKey(o); 
	          /*CollectionRecord*/
//	    	  var cr = HybridDictionary.prototype.Get.call(this, key); 
	    	  var cr = HybridDictionary.prototype.Get.call(this, o); 
	
	          return cr; 
	      },
	  });
	
	  
	  Object.defineProperties(ViewManager, {
	//      static internal ViewManager 
	      Current:
	      {
	          get:function() { return DataBindEngine.CurrentDataBindEngine.ViewManager; } 
	      }
	  });
	
	ViewManager.Type = new Type("ViewManager", ViewManager, [HybridDictionary.Type]);
	return ViewManager;
});
 

