package org.summer.view.widget.controls;
/// <summary>
    ///     Defines the different placement types of MenuItems.
    /// </summary>
    public enum MenuItemRole 
    {
        /// <summary> 
        ///     A top-level menu item that can invoke commands. 
        /// </summary>
        TopLevelItem, 

        /// <summary>
        ///     Header for top-level menus.
        /// </summary> 
        TopLevelHeader,
 
        /// <summary> 
        ///     A menu item in a submenu that can invoke commands.
        /// </summary> 
        SubmenuItem,

        /// <summary>
        ///     A header for a submenu. 
        /// </summary>
        SubmenuHeader, 
    } 