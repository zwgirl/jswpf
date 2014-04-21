package org.summer.view.widget.controls;

import org.summer.view.widget.DataTemplate;
/// <summary>
    ///   The template that produces a container for an ItemsControl
    /// </summary>
//    [DictionaryKeyProperty("ItemContainerTemplateKey")] 
    public class ItemContainerTemplate extends DataTemplate
    { 
 
        /// <summary>
        ///     The key that will be used if the ItemContainerTemplate is added to a 
        ///     ResourceDictionary in Xaml without a specified Key (x:Key).
        /// </summary>
        public Object ItemContainerTemplateKey
        { 
            get
            { 
                return (DataType != null) ? new ItemContainerTemplateKey(DataType) : null; 
            }
        } 
    }