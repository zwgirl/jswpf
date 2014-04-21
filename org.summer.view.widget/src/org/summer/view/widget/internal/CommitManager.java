package org.summer.view.widget.internal;

import java.util.List;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.data.BindingExpressionBase;
import org.summer.view.widget.data.BindingGroup;

/*internal*/public class CommitManager 
{ 
//    #region Internal Methods

    /*internal*/ boolean IsEmpty
    {
        get { return _bindings.Count == 0 && _bindingGroups.Count == 0; }
    } 

    /*internal*/ public void AddBindingGroup(BindingGroup bindingGroup) 
    { 
        _bindingGroups.Add(bindingGroup);
    } 

    /*internal*/ public void RemoveBindingGroup(BindingGroup bindingGroup)
    {
        _bindingGroups.Remove(bindingGroup); 
    }

    /*internal*/ public void AddBinding(BindingExpressionBase binding) 
    {
        _bindings.Add(binding); 
    }

    /*internal*/ public void RemoveBinding(BindingExpressionBase binding)
    { 
        _bindings.Remove(binding);
    } 

    /*internal*/ public List<BindingGroup> GetBindingGroupsInScope(DependencyObject element)
    { 
        // iterate over a copy of the full list - callouts can
        // change the original list
        List<BindingGroup> fullList = _bindingGroups.ToList();
        List<BindingGroup> list = EmptyBindingGroupList; 

        for/*each*/ (BindingGroup bindingGroup : fullList) 
        { 
            DependencyObject owner = bindingGroup.Owner;
            if (owner != null && IsInScope(element, owner)) 
            {
                if (list == EmptyBindingGroupList)
                {
                    list = new List<BindingGroup>(); 
                }

                list.Add(bindingGroup); 
            }
        } 

        return list;
    }

    /*internal*/ public List<BindingExpressionBase> GetBindingsInScope(DependencyObject element)
    { 
        // iterate over a copy of the full list - calling TargetElement can 
        // change the original list
        List<BindingExpressionBase> fullList = _bindings.ToList(); 
        List<BindingExpressionBase> list = EmptyBindingList;

        for/*each*/ (BindingExpressionBase binding : fullList)
        { 
            DependencyObject owner = binding.TargetElement;
            if (owner != null && 
                binding.IsEligibleForCommit && 
                IsInScope(element, owner))
            { 
                if (list == EmptyBindingList)
                {
                    list = new List<BindingExpressionBase>();
                } 

                list.Add(binding); 
            } 
        }

        return list;
    }

    // remove stale entries 
    /*internal*/ public boolean Purge()
    { 
        boolean foundDirt = false; 

        int count = _bindings.Count; 
        if (count > 0)
        {
            List<BindingExpressionBase> list = _bindings.ToList();
            for/*each*/ (BindingExpressionBase binding in list) 
            {
                // fetching TargetElement may detach the binding, removing it from _bindings 
                DependencyObject owner = binding.TargetElement; 
            }
        } 
        foundDirt = foundDirt || (_bindings.Count < count);

        count = _bindingGroups.Count;
        if (count > 0) 
        {
            List<BindingGroup> list = _bindingGroups.ToList(); 
            for/*each*/ (BindingGroup bindingGroup : list) 
            {
                // fetching Owner may detach the binding group, removing it from _bindingGroups 
                DependencyObject owner = bindingGroup.Owner;
            }
        }
        foundDirt = foundDirt || (_bindingGroups.Count < count); 

        return foundDirt; 
    } 

//    #endregion Internal Methods 

//    #region Private Methods

    // return true if element is a descendant of ancestor 
    boolean IsInScope(DependencyObject ancestor, DependencyObject element)
    { 
        boolean result = (ancestor == null) || VisualTreeHelper.IsAncestorOf(ancestor, element); 
        return result;
    } 

//    #endregion Private Methods

//    #region Private Data 

    Set<BindingGroup> _bindingGroups = new Set<BindingGroup>(); 
    Set<BindingExpressionBase> _bindings = new Set<BindingExpressionBase>(); 

    static final List<BindingGroup> EmptyBindingGroupList = new List<BindingGroup>(); 
    static final List<BindingExpressionBase> EmptyBindingList = new List<BindingExpressionBase>();

//    #endregion Private Data

//    #region Private types

    class Set<T> extends Dictionary<T, Object> implements IEnumerable<T> 
    {
        public Set() 
            : base()
        {
        }

        public Set(IDictionary<T, Object> other)
            : base(other) 
        { 
        }

        public Set(IEqualityComparer<T> comparer)
            : base(comparer)
        {
        } 

        public void Add(T item) 
        { 
            if (!ContainsKey(item))
            { 
                Add(item, null);
            }
        }

        IEnumerator<T> IEnumerable<T>.GetEnumerator()
        { 
            return Keys.GetEnumerator(); 
        }

        public List<T> ToList()
        {
            return new List<T>(Keys);
        } 
    }

//    #endregion Private types 
}