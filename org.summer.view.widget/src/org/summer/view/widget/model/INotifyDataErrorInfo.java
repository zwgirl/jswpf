package org.summer.view.widget.model;

import org.summer.view.widget.collection.IEnumerable;
public interface INotifyDataErrorInfo {
    boolean HasErrors { get; }

    IEnumerable GetErrors (String propertyName);
    /*event*/ EventHandler<DataErrorsChangedEventArgs> ErrorsChanged;
}