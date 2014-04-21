/**
 * MenuItemRole
 */
/// <summary>
///     Defines the different placement types of MenuItems.
/// </summary>
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var MenuItemRole = declare("MenuItemRole", null,{
	});
	
    /// <summary> 
    ///     A top-level menu item that can invoke commands. 
    /// </summary>
	MenuItemRole.TopLevelItem = 0, 

    /// <summary>
    ///     Header for top-level menus.
    /// </summary> 
	MenuItemRole.TopLevelHeader = 1,

    /// <summary> 
    ///     A menu item in a submenu that can invoke commands.
    /// </summary> 
	MenuItemRole.SubmenuItem = 2,

    /// <summary>
    ///     A header for a submenu. 
    /// </summary>
	MenuItemRole.SubmenuHeader = 3; 
	
	return MenuItemRole;
});
