package org.summer.view.widget.documents;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.window.BaselineAlignment;
import org.summer.view.window.FlowDirection;

/// <summary>
/// Inline element. 
/// </summary>
//[TextElementEditingBehav/iorAttribute(IsMergeable = true, IsTypographicOnly = true)]
public abstract class Inline extends TextElement
{ 
    //-------------------------------------------------------------------
    // 
    // Constructors 
    //
    //------------------------------------------------------------------- 

//    #region Constructors

    /// <summary> 
    /// Public constructor.
    /// </summary> 
    protected Inline() 
    { 
    	super();
    }

//    #endregion Constructors

    //--------------------------------------------------------------------
    // 
    // Public Properties 
    //
    //------------------------------------------------------------------- 

//    #region Public Properties

    /// <value> 
    /// A collection of Inlines containing this one in its sequential tree.
    /// May return null if an element is not inserted into any tree. 
    /// </value> 
    public InlineCollection SiblingInlines
    { 
        get
        {
            if (this.Parent == null)
            { 
                return null;
            } 

            return new InlineCollection(this, /*isOwnerParent*/false);
        } 
    }

    /// <summary>
    /// Returns an Inline immediately following this one 
    /// on the same level of siblings
    /// </summary> 
    public Inline NextInline 
    {
        get 
        {
            return this.NextElement as Inline;
        }
    } 

    /// <summary> 
    /// Returns an Inline immediately preceding this one 
    /// on the same level of siblings
    /// </summary> 
    public Inline PreviousInline
    {
        get
        { 
            return this.PreviousElement as Inline;
        } 
    } 

    /// <summary> 
    /// DependencyProperty for <see cref="BaselineAlignment" /> property.
    /// </summary>
    public static final DependencyProperty BaselineAlignmentProperty =
            DependencyProperty.Register( 
                    "BaselineAlignment",
                    typeof(BaselineAlignment), 
                    typeof(Inline), 
                    new FrameworkPropertyMetadata(
                            BaselineAlignment.Baseline, 
                            FrameworkPropertyMetadataOptions.AffectsParentMeasure),
                    new ValidateValueCallback(IsValidBaselineAlignment));

    /// <summary> 
    ///
    /// </summary> 
    public BaselineAlignment BaselineAlignment 
    {
        get { return (BaselineAlignment) GetValue(BaselineAlignmentProperty); } 
        set { SetValue(BaselineAlignmentProperty, value); }
    }

    /// <summary> 
    /// DependencyProperty for <see cref="TextDecorations" /> property.
    /// </summary> 
    public static final DependencyProperty TextDecorationsProperty = 
            DependencyProperty.Register(
                    "TextDecorations", 
                    typeof(TextDecorationCollection),
                    typeof(Inline),
                    new FrameworkPropertyMetadata(
                            new FreezableDefaultValueFactory(TextDecorationCollection.Empty), 
                            FrameworkPropertyMetadataOptions.AffectsRender
                            )); 

    /// <summary>
    /// The TextDecorations property specifies decorations that are added to the text of an element. 
    /// </summary>
    public TextDecorationCollection TextDecorations
    {
        get { return (TextDecorationCollection) GetValue(TextDecorationsProperty); } 
        set { SetValue(TextDecorationsProperty, value); }
    } 

    /// <summary>
    /// DependencyProperty for <see cref="FlowDirection" /> property. 
    /// </summary>
    public static final DependencyProperty FlowDirectionProperty =
            FrameworkElement.FlowDirectionProperty.AddOwner(typeof(Inline));

    /// <summary>
    /// The FlowDirection property specifies the flow direction of the element. 
    /// </summary> 
    public FlowDirection FlowDirection
    { 
        get { return (FlowDirection)GetValue(FlowDirectionProperty); }
        set { SetValue(FlowDirectionProperty, value); }
    }

//    #endregion Public Properties

    //-------------------------------------------------------------------- 
    //
    //  Internal Methods 
    //
    //--------------------------------------------------------------------

//    #region Internal Methods 

    /*internal*/ public static Run CreateImplicitRun(DependencyObject parent) 
    { 
        return new Run();
    } 

    /*internal*/ public static InlineUIContainer CreateImplicitInlineUIContainer(DependencyObject parent)
    {
        return new InlineUIContainer(); 
    }

//    #endregion Internal Methods 

    //------------------------------------------------------------------- 
    //
    // Private Methods
    //
    //-------------------------------------------------------------------- 

//    #region Private Methods 
    private static boolean IsValidBaselineAlignment(Object o) 
    {
        BaselineAlignment value = (BaselineAlignment)o; 
        return value == BaselineAlignment.Baseline
            || value == BaselineAlignment.Bottom
            || value == BaselineAlignment.Center
            || value == BaselineAlignment.Subscript 
            || value == BaselineAlignment.Superscript
            || value == BaselineAlignment.TextBottom 
            || value == BaselineAlignment.TextTop 
            || value == BaselineAlignment.Top;
    } 

//    #endregion Private Methods
}