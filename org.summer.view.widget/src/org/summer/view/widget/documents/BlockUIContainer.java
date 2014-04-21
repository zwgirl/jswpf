package org.summer.view.widget.documents;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.UIElement;
 /// <summary>
    /// BlockUIContainer - a wrapper for embedded UIElements in text 
    /// flow content block collections 
    /// </summary>
//    [ContentProperty("Child")] 
    public class BlockUIContainer extends Block
    {
        //-------------------------------------------------------------------
        // 
        // Constructors
        // 
        //------------------------------------------------------------------- 

//        #region Constructors 

        /// <summary>
        /// Initializes a new instance of BlockUIContainer element.
        /// </summary> 
        /// <remarks>
        /// The purpose of this element is to be a wrapper for UIElements 
        /// when they are embedded into text flow - as items of 
        /// BlockCollections.
        /// </remarks> 
        public BlockUIContainer()
        {
        	super();
        } 

        /// <summary> 
        /// Initializes an BlockUIContainer specifying its child UIElement 
        /// </summary>
        /// <param name="uiElement"> 
        /// UIElement set as a child of this block item
        /// </param>
        public BlockUIContainer(UIElement uiElement)
        {
        	super(); 
            if (uiElement == null) 
            { 
                throw new ArgumentNullException("uiElement");
            } 
            this.Child = uiElement;
        }

//        #endregion Constructors 

        //-------------------------------------------------------------------- 
        // 
        // Public Properties
        // 
        //-------------------------------------------------------------------

//        #region Properties
 
        /// <summary>
        /// The content spanned by this TextElement. 
        /// </summary> 
        public UIElement Child
        { 
            get
            {
                return this.ContentStart.GetAdjacentElement(LogicalDirection.Forward) as UIElement;
            } 

            set 
            { 
                TextContainer textContainer = this.TextContainer;
 
                textContainer.BeginChange();
                try
                {
                    TextPointer contentStart = this.ContentStart; 

                    UIElement child = Child; 
                    if (child != null) 
                    {
                        textContainer.DeleteContentInternal(contentStart, this.ContentEnd); 
                        ContainerTextElementField.ClearValue(child);
                    }

                    if (value != null) 
                    {
                        ContainerTextElementField.SetValue(value, this); 
                        contentStart.InsertUIElement(value); 
                    }
                } 
                finally
                {
                    textContainer.EndChange();
                } 
            }
        } 
 
//        #endregion
 
    }