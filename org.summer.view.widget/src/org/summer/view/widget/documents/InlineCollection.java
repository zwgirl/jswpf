package org.summer.view.widget.documents;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.controls.TextBlock;

/// <summary>
/// Collection of Inline elements - elements allowed as children 
/// of Paragraph, Span and TextBlock elements. 
/// </summary>
//[ContentWrapper(typeof(Run))] 
//[ContentWrapper(typeof(InlineUIContainer))]
//[WhitespaceSignificantCollection]
public class InlineCollection extends TextElementCollection<Inline> implements IList
{ 
    //-------------------------------------------------------------------
    // 
    //  Constructors 
    //
    //------------------------------------------------------------------- 

//    #region Constructors

    // Constructor is /*internal*/ public. We allow InlineCollection creation only from inside owning elements such as TextBlock or TextElement. 
    // Note that when a SiblingInlines collection is created for an Inline, the owner of collection is that member Inline Object.
    // Flag isOwnerParent indicates whether owner is a parent or a member of the collection. 
    /*internal*/ public InlineCollection(DependencyObject owner, boolean isOwnerParent) 
    { 
    	super(owner, isOwnerParent);
    }

//    #endregion Constructors

    //--------------------------------------------------------------------
    // 
    //  Public Methods 
    //
    //------------------------------------------------------------------- 

//    #region Public Methods

    /// <summary> 
    /// Implementation of Add method from IList
    /// </summary> 
    /*internal*/ public /*override*/ int OnAdd(Object value) 
    {
        int index; 

        String text = value as String;

        if (text != null) 
        {
            index = AddText(text, true /* returnIndex */); 
        } 
        else
        { 
            this.TextContainer.BeginChange();
            try
            {

                UIElement uiElement = value as UIElement;

                if (uiElement != null) 
                {
                    index = AddUIElement(uiElement, true /* returnIndex */); 
                }
                else
                {
                    index = super.OnAdd(value); 
                }

            } 
            finally
            { 
                this.TextContainer.EndChange();
            }
        }
        return index; 
    }

    /// <summary> 
    /// Adds an implicit Run element with a given text
    /// </summary> 
    /// <param name="text">
    /// Text set as a Text property for implicit Run.
    /// </param>
    public void Add(String text) 
    {
        AddText(text, false /* returnIndex */); 
    } 

    /// <summary> 
    /// Adds an implicit InlineUIContainer with a given UIElement in it.
    /// </summary>
    /// <param name="uiElement">
    /// UIElement set as a Child property for the implicit InlineUIContainer. 
    /// </param>
    public void Add(UIElement uiElement) 
    { 
        AddUIElement(uiElement, false /* returnIndex */);
    } 

//    #endregion Public Methods

    //-------------------------------------------------------------------- 
    //
    //  Public Properties 
    // 
    //--------------------------------------------------------------------

//    #region Public Properties

    /// <value>
    /// Returns a first Inline element of this collection 
    /// </value>
    public Inline FirstInline 
    { 
        get
        { 
            return this.FirstChild;
        }
    }

    /// <value>
    /// Returns a last Inline element of this collection 
    /// </value> 
    public Inline LastInline
    { 
        get
        {
            return this.LastChild;
        } 
    }

//    #endregion Public Properties 

    //------------------------------------------------------------------- 
    //
    //  Internal Methods
    //
    //-------------------------------------------------------------------- 

//    #region Internal Methods 

    /// <summary>
    /// This method performs schema validation for inline collections. 
    /// (1) We want to disallow nested Hyperlink elements.
    /// (2) Also, a Hyperlink element allows only these child types: Run, InlineUIContainer and Span elements other than Hyperlink.
    /// </summary>
    /*internal*/ public /*override*/ void ValidateChild(Inline child) 
    {
        super.ValidateChild(child); 

        if (this.Parent instanceof TextElement)
        { 
            TextSchema.ValidateChild((TextElement)this.Parent, child, true /* throwIfIllegalChild */, true /* throwIfIllegalHyperlinkDescendent */);
        }
        else
        { 
            if (!TextSchema.IsValidChildOfContainer(this.Parent.GetType(), child.GetType()))
            { 
                throw new InvalidOperationException(/*SR.Get(SRID.TextSchema_ChildTypeIsInvalid, this.Parent.GetType().Name, child.GetType().Name)*/); 
            }
        } 
    }

//    #endregion Internal Methods

    //-------------------------------------------------------------------
    // 
    //  Private Methods 
    //
    //------------------------------------------------------------------- 

//    #region Private Methods

    // Worker for OnAdd and Add(String). 
    // If returnIndex == true, uses the more costly IList.Add
    // to calculate and return the index of the newly inserted 
    // Run, otherwise returns -1. 
    private int AddText(String text, boolean returnIndex)
    { 
        if (text == null)
        {
            throw new ArgumentNullException("text");
        } 

        // Special case for TextBlock - to keep its simple content in simple state 
        if (this.Parent instanceof TextBlock) 
        {
            TextBlock textBlock = (TextBlock)this.Parent; 
            if (!textBlock.HasComplexContent)
            {
                textBlock.Text = textBlock.Text + text;
                return 0; // There's always one implicit Run with simple content, at index 0. 
            }
        } 

        this.TextContainer.BeginChange();
        try 
        {
            Run implicitRun = Run.CreateImplicitRun(this.Parent);
            int index;

            if (returnIndex)
            { 
                index = super.OnAdd(implicitRun); 
            }
            else 
            {
                this.Add(implicitRun);
                index = -1;
            } 

            // Set the Text property after inserting the Run to avoid allocating 
            // a temporary TextContainer. 
            implicitRun.Text = text;

            return index;
        }
        finally
        { 
            this.TextContainer.EndChange();
        } 

    }

    // Worker for OnAdd and Add(UIElement).
    // If returnIndex == true, uses the more costly IList.Add
    // to calculate and return the index of the newly inserted
    // Run, otherwise returns -1. 
    private int AddUIElement(UIElement uiElement, boolean returnIndex)
    { 
        if (uiElement == null) 
        {
            throw new ArgumentNullException("uiElement"); 
        }

        InlineUIContainer implicitInlineUIContainer = Run.CreateImplicitInlineUIContainer(this.Parent);
        int index; 

        if (returnIndex) 
        { 
            index = super.OnAdd(implicitInlineUIContainer);
        } 
        else
        {
            this.Add(implicitInlineUIContainer);
            index = -1; 
        }

        implicitInlineUIContainer.Child = uiElement; 

        return index; 
    }

//    #endregion Private Methods
}