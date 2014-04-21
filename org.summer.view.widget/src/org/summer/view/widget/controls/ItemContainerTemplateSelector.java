package org.summer.view.widget.controls;

import org.summer.view.widget.DataTemplate;
import org.summer.view.widget.FrameworkElement;

/// <summary> 
    ///   A class used to select an ItemContainerTemplate for each item within an ItemsControl
    /// </summary> 
    public abstract class ItemContainerTemplateSelector 
    {
        /// <summary> 
        /// Override this method to return an app specific ItemContainerTemplate
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns> 
        public /*virtual*/ DataTemplate SelectTemplate(Object item, ItemsControl parentItemsControl)
        { 
            return null; 
        }
    } 

    /*internal*/ class DefaultItemContainerTemplateSelector extends ItemContainerTemplateSelector
    {
        public /*override*/ DataTemplate SelectTemplate(Object item, ItemsControl parentItemsControl) 
        {
            // Do an implicit type lookup for an ItemContainerTemplate 
            return FrameworkElement.FindTemplateResourceInternal(parentItemsControl, item, typeof(ItemContainerTemplate)) as DataTemplate; 
        }
    } 