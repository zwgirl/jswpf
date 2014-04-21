/**
 * CommitManager
 */

define(["dojo/_base/declare", "system/Type", "generic/Dictionary", "collections/IEnumerable",
        "generic/List"], function(declare, Type, Dictionary, IEnumerable){
//	class 
	var Set = declare([Dictionary, IEnumerable], {
   	 	"-chains-": {
   	 		constructor: "manual"
    	},
        constructor:function(/*IDictionary*/ other) 
        {
        	if(other != undefined){
        		Dictionary.prototype.constructor.call(this.other);
        	}
        },

//        public void 
		Add:function(/*T*/ item) 
        { 
            if (!this.ContainsKey(item))
            { 
            	this.Add(item, null);
            }
        },

//        IEnumerator<T> IEnumerable<T>.
        GetEnumerator:function()
        { 
            return this.Keys.GetEnumerator(); 
        },

//        public List<T> 
        ToList:function()
        {
            return new List(this.Keys);
        } 
    });
	
//    static readonly List<BindingGroup>
	var EmptyBindingGroupList = new List/*<BindingGroup>*/(); 
//    static readonly List<BindingExpressionBase> 
	var EmptyBindingList = new List/*<BindingExpressionBase>*/();
    
	var CommitManager = declare("CommitManager", null,{
		constructor:function( ){
//	        Set<BindingGroup> 
			this._bindingGroups = new Set/*<BindingGroup>*/(); 
//	        Set<BindingExpressionBase> 
			this._bindings = new Set/*<BindingExpressionBase>*/(); 
		},
		

//        internal void 
        AddBindingGroup:function(/*BindingGroup*/ bindingGroup) 
        { 
            this._bindingGroups.Add(bindingGroup);
        },

//        internal void 
        RemoveBindingGroup:function(/*BindingGroup*/ bindingGroup)
        {
        	this._bindingGroups.Remove(bindingGroup); 
        },
 
//        internal void 
        AddBinding:function(/*BindingExpressionBase*/ binding) 
        {
        	this._bindings.Add(binding); 
        },

//        internal void 
        RemoveBinding:function(/*BindingExpressionBase*/ binding)
        { 
        	this._bindings.Remove(binding);
        }, 
 
//        internal List<BindingGroup> 
        GetBindingGroupsInScope:function(/*DependencyObject*/ element)
        { 
            // iterate over a copy of the full list - callouts can
            // change the original list
            /*List<BindingGroup>*/var fullList = this._bindingGroups.ToList();
            /*List<BindingGroup>*/var list = EmptyBindingGroupList; 

            for (var i=0; i< fullList.Count; i++) 
            { 
            	/*BindingGroup*/var bindingGroup = fullList.Get(i);
                /*DependencyObject*/var owner = bindingGroup.Owner;
                if (owner != null && IsInScope(element, owner)) 
                {
                    if (list == EmptyBindingGroupList)
                    {
                        list = new List/*<BindingGroup>*/(); 
                    }
 
                    list.Add(bindingGroup); 
                }
            } 

            return list;
        },
 
//        internal List<BindingExpressionBase> 
        GetBindingsInScope:function(/*DependencyObject*/ element)
        { 
            // iterate over a copy of the full list - calling TargetElement can 
            // change the original list
            /*List<BindingExpressionBase>*/var fullList = this._bindings.ToList(); 
            /*List<BindingExpressionBase>*/var list = EmptyBindingList;

            for ( var i=0; i<fullList.Count; i++)
            { 
            	/*BindingExpressionBase*/var binding = fullList.Get(i);
                /*DependencyObject*/var owner = binding.TargetElement;
                if (owner != null && 
                    binding.IsEligibleForCommit && 
                    this.IsInScope(element, owner))
                { 
                    if (list == EmptyBindingList)
                    {
                        list = new List/*<BindingExpressionBase>*/();
                    } 

                    list.Add(binding); 
                } 
            }
 
            return list;
        },

        // remove stale entries 
//        internal bool 
        Purge:function()
        { 
//            bool foundDirt = false; 
//
//            int count = _bindings.Count; 
//            if (count > 0)
//            {
//                List<BindingExpressionBase> list = _bindings.ToList();
//                foreach (BindingExpressionBase binding in list) 
//                {
//                    // fetching TargetElement may detach the binding, removing it from _bindings 
//                    DependencyObject owner = binding.TargetElement; 
//                }
//            } 
//            foundDirt = foundDirt || (_bindings.Count < count);
//
//            count = _bindingGroups.Count;
//            if (count > 0) 
//            {
//                List<BindingGroup> list = _bindingGroups.ToList(); 
//                foreach (BindingGroup bindingGroup in list) 
//                {
//                    // fetching Owner may detach the binding group, removing it from _bindingGroups 
//                    DependencyObject owner = bindingGroup.Owner;
//                }
//            }
//            foundDirt = foundDirt || (_bindingGroups.Count < count); 
//
//            return foundDirt; 
        },

        // return true if element is a descendant of ancestor 
//        bool 
        IsInScope:function(/*DependencyObject*/ ancestor, /*DependencyObject*/ element)
        { 
            /*bool*/var result = (ancestor == null) || VisualTreeHelper.IsAncestorOf(ancestor, element); 
            return result;
        } 
	});
	
	Object.defineProperties(CommitManager.prototype,{
//		internal bool 
		IsEmpty:
        {
            get:function() {
            	return this._bindings.Count == 0 && this._bindingGroups.Count == 0; 
            }
        } 
	});
	
	CommitManager.Type = new Type("CommitManager", CommitManager, [Object.Type]);
	return CommitManager;
});





        
