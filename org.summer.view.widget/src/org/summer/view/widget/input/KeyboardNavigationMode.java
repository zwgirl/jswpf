package org.summer.view.widget.input;
//#region public enum types
    /// <summary> 
    /// These options specify how the container will move the focus when tab and directional navigation occurs 
    /// </summary>
    public enum KeyboardNavigationMode 
    {
        /**
         * The container does not handle the keyboard navigation;
         */
        Continue, 
 
        /**
         * The container and all of its child elements as a whole only receive focus once. 
         */
        Once,
 
	      /**
	       * Depending on the direction of the navigation, 
	       * the focus returns to the first or the last item when the end or 
	       * the beginning of the container is reached, respectively.
	       */
        Cycle,

        /**
         * No keyboard navigation is allowed inside this container 
         */
        None, 
 
        /**
         * Like cycle but does not move past the beginning or end of the container. 
         */
        Contained,

        /**
         * TabIndexes are considered on local subtree only inside this container
         */
        Local, 

        // NOTE: if you add or remove any values in this enum, be sure to update KeyboardNavigation.IsValidKeyNavigationMode() 
    }
//    #endregion public enum types

