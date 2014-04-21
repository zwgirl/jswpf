package org.summer.view.widget.controls.primitives;

import org.summer.view.widget.BaseValueSourceInternal;
import org.summer.view.widget.DataTemplate;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.FrameworkElementFactory;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.ResourceKey;
import org.summer.view.widget.SystemResourceKey;
import org.summer.view.widget.controls.ItemContainerTemplateSelector;
import org.summer.view.widget.controls.ItemsControl;
import org.summer.view.widget.controls.ItemsPanelTemplate;
import org.summer.view.widget.controls.Separator;
import org.summer.view.window.automation.peer.AutomationPeer;

/// <summary>
    /// StatusBar is a visual indicator of the operational status of an application and/or 
    /// its components running in a window.  StatusBar control consists of a series of zones 
    /// on a band that can display text, graphics, or other rich content. The control can
    /// group items within these zones to emphasize relational similarities or functional 
    /// connections. The StatusBar can accommodate multiple sets of UI or functionality that
    /// can be chosen even within the same application.
    /// </summary>
//    [StyleTypedProperty(Property = "ItemContainerStyle", StyleTargetType = typeof(StatusBarItem))] 
    public class StatusBar extends ItemsControl
    { 
        //------------------------------------------------------------------- 
        //
        //  Constructors 
        //
        //-------------------------------------------------------------------

//        #region Constructors 

        static //StatusBar() 
        { 
            DefaultStyleKeyProperty.OverrideMetadata(typeof(StatusBar), new FrameworkPropertyMetadata(typeof(StatusBar)));
            _dType = DependencyObjectType.FromSystemTypeInternal(typeof(StatusBar)); 

            IsTabStopProperty.OverrideMetadata(typeof(StatusBar), new FrameworkPropertyMetadata(BooleanBoxes.FalseBox));

            ItemsPanelTemplate template = new ItemsPanelTemplate(new FrameworkElementFactory(typeof(DockPanel))); 
            template.Seal();
            ItemsPanelProperty.OverrideMetadata(typeof(StatusBar), new FrameworkPropertyMetadata(template)); 
        } 

//        #endregion 

//        #region Public Properties

        /// <summary> 
        ///     DependencyProperty for ItemContainerTemplateSelector property.
        /// </summary> 
        public static final DependencyProperty ItemContainerTemplateSelectorProperty = 
            MenuBase.ItemContainerTemplateSelectorProperty.AddOwner(
                typeof(StatusBar), 
                new FrameworkPropertyMetadata(new DefaultItemContainerTemplateSelector()));

        /// <summary>
        ///     DataTemplateSelector property which provides the DataTemplate to be used to create an instance of the ItemContainer. 
        /// </summary>
        public ItemContainerTemplateSelector ItemContainerTemplateSelector 
        { 
            get { return (ItemContainerTemplateSelector)GetValue(ItemContainerTemplateSelectorProperty); }
            set { SetValue(ItemContainerTemplateSelectorProperty, value); } 
        }

        /// <summary>
        ///     DependencyProperty for UsesItemContainerTemplate property. 
        /// </summary>
        public static final DependencyProperty UsesItemContainerTemplateProperty = 
            MenuBase.UsesItemContainerTemplateProperty.AddOwner(typeof(StatusBar)); 

        /// <summary> 
        ///     UsesItemContainerTemplate property which says whether the ItemContainerTemplateSelector property is to be used.
        /// </summary>
        public boolean UsesItemContainerTemplate
        { 
            get { return (boolean)GetValue(UsesItemContainerTemplateProperty); }
            set { SetValue(UsesItemContainerTemplateProperty, value); } 
        } 

//        #endregion 

        //--------------------------------------------------------------------
        //
        //  Protected Methods 
        //
        //------------------------------------------------------------------- 
 
//        #region Protected Methods
 
        private Object _currentItem;

        /// <summary>
        /// Return true if the item is (or is eligible to be) its own ItemUI 
        /// </summary>
        protected /*override*/ boolean IsItemItsOwnContainerOverride(Object item) 
        { 
            boolean ret = (item instanceof StatusBarItem) || (item instanceof Separator);
            if (!ret) 
            {
                _currentItem = item;
            }
 
            return ret;
        } 
 
        protected /*override*/ DependencyObject GetContainerForItemOverride()
        { 
            Object currentItem = _currentItem;
            _currentItem = null;

            if (UsesItemContainerTemplate) 
            {
                DataTemplate itemContainerTemplate = ItemContainerTemplateSelector.SelectTemplate(currentItem, this); 
                if (itemContainerTemplate != null) 
                {
                    Object itemContainer = itemContainerTemplate.LoadContent(); 
                    if (itemContainer instanceof StatusBarItem || itemContainer instanceof Separator)
                    {
                        return itemContainer as DependencyObject;
                    } 
                    else
                    { 
                        throw new InvalidOperationException(SR.Get(SRID.InvalidItemContainer, this.GetType().Name, typeof(StatusBarItem).Name, typeof(Separator).Name, itemContainer)); 
                    }
                } 
            }

            return new StatusBarItem();
        } 
        /// <summary>
        /// Prepare the element to display the item.  This may involve 
        /// applying styles, setting bindings, etc. 
        /// </summary>
        protected /*override*/ void PrepareContainerForItemOverride(DependencyObject element, Object item) 
        {
            super.PrepareContainerForItemOverride(element, item);

            Separator separator = element as Separator; 
            if (separator != null)
            { 
                boolean hasModifiers; 
                BaseValueSourceInternal vs = separator.GetValueSource(StyleProperty, null, /*out*/ hasModifiers);
                if (vs <= BaseValueSourceInternal.ImplicitReference) 
                    separator.SetResourceReference(StyleProperty, SeparatorStyleKey);
                separator.DefaultStyleKey = SeparatorStyleKey;
            }
        } 

        /// <summary> 
        /// Determine whether the ItemContainerStyle/StyleSelector should apply to the container 
        /// </summary>
        /// <returns>false if item is a Separator, otherwise return true</returns> 
        protected /*override*/ boolean ShouldApplyItemContainerStyle(DependencyObject container, Object item)
        {
            if (item instanceof Separator)
            { 
                return false;
            } 
            else 
            {
                return super.ShouldApplyItemContainerStyle(container, item); 
            }
        }

//        #endregion 

//        #region Accessibility 
 
        /// <summary>
        /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>) 
        /// </summary>
        protected /*override*/ AutomationPeer OnCreateAutomationPeer()
        {
            return new StatusBarAutomationPeer(this); 
        }
 
//        #endregion 

//        #region DTypeThemeStyleKey 

        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will /*override*/ this method to return approriate types.
        /*internal*/ public /*override*/ DependencyObjectType DTypeThemeStyleKey 
        {
            get { return _dType; } 
        } 

        private static DependencyObjectType _dType; 

//        #endregion DTypeThemeStyleKey

//        #region ItemsStyleKey 

        /// <summary> 
        ///     Resource Key for the SeparatorStyle 
        /// </summary>
        public static ResourceKey SeparatorStyleKey 
        {
            get
            {
                return SystemResourceKey.StatusBarSeparatorStyleKey; 
            }
        } 
 
//        #endregion
    } 