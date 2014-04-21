package org.summer.view.widget;

import org.summer.view.widget.internal.EventHandler;
import org.summer.view.widget.model.PropertyChangedEventArgs;

 public interface INotifyPropertyChanged<T>
    {
        /// <summary>
        /// The event fired when a property changes.  This custom version uses a
        /// generic version of PropertyChangedEventArgs which includes the new
        /// and old values of the property that changed.
        /// </summary>
        /*event*/ EventHandler<PropertyChangedEventArgs<T>> PropertyChanged;
    }