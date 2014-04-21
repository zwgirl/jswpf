package org.summer.view.widget.documents;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.window.TextDecorationCollection;
import org.summer.view.window.Thickness;

/// <summary>
    /// Paragraph element
    /// </summary>
//    [ContentProperty("Inlines")] 
    public class Paragraph extends Block
    { 
        //------------------------------------------------------------------- 
        //
        // Constructors 
        //
        //-------------------------------------------------------------------

//        #region Constructors 

        /// <summary> 
        /// Static ctor.  Initializes property metadata. 
        /// </summary>
        static //Paragraph() 
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(Paragraph), new FrameworkPropertyMetadata(typeof(Paragraph)));
        }
 
        /// <summary>
        /// Public constructor. 
        /// </summary> 
        public Paragraph()
        {
        	super() ;
        }

        /// <summary> 
        /// Paragraph constructor.
        /// </summary> 
        public Paragraph(Inline inline) 
        { 
        	super();
            if (inline == null)
            {
                throw new ArgumentNullException("inline");
            } 

            this.Inlines.Add(inline); 
        } 

//        #endregion Constructors 

        //--------------------------------------------------------------------
        //
        // Public Properties 
        //
        //------------------------------------------------------------------- 
 
//        #region Public Properties
 
        /// <value>
        /// Collection of Inline items contained in this Paragraph.
        /// </value>
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)] 
        public InlineCollection Inlines
        { 
            get 
            {
                return new InlineCollection(this, /*isOwnerParent*/true); 
            }
        }

        /// <summary> 
        /// DependencyProperty for <see cref="TextDecorations" /> property.
        /// </summary> 
        public static final DependencyProperty TextDecorationsProperty = 
                Inline.TextDecorationsProperty.AddOwner(
                        typeof(Paragraph), 
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
        /// DependencyProperty for <see cref="TextIndent" /> property. 
        /// </summary>
        public static final DependencyProperty TextIndentProperty = 
                DependencyProperty.Register(
                        "TextIndent",
                        typeof(Double),
                        typeof(Paragraph), 
                        new FrameworkPropertyMetadata(
                                0.0, 
                                FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender), 
                        new ValidateValueCallback(IsValidTextIndent));
 
        /// <summary>
        /// The TextIndent property specifies the indentation of the first line of a paragraph.
        /// </summary>
//        [TypeConverter(typeof(LengthConverter))] 
        public double TextIndent
        { 
            get { return (double)GetValue(TextIndentProperty); } 
            set { SetValue(TextIndentProperty, value); }
        } 

        /// <summary>
        /// DependencyProperty for <see cref="MinOrphanLines" /> property.
        /// </summary> 
        public static final DependencyProperty MinOrphanLinesProperty =
                DependencyProperty.Register( 
                        "MinOrphanLines", 
                        typeof(Integer),
                        typeof(Paragraph), 
                        new FrameworkPropertyMetadata(
                                0,
                                FrameworkPropertyMetadataOptions.AffectsParentMeasure),
                        new ValidateValueCallback(IsValidMinOrphanLines)); 

        /// <summary> 
        /// The MinOrphanLines is the minimum number of lines that 
        /// can be left behind when a paragraph is broken on a page break
        /// or column break. 
        /// </summary>
        public int MinOrphanLines
        {
            get { return (int)GetValue(MinOrphanLinesProperty); } 
            set { SetValue(MinOrphanLinesProperty, value); }
        } 
 
        /// <summary>
        /// DependencyProperty for <see cref="MinWidowLines" /> property. 
        /// </summary>
        public static final DependencyProperty MinWidowLinesProperty =
                DependencyProperty.Register(
                        "MinWidowLines", 
                        typeof(Integer),
                        typeof(Paragraph), 
                        new FrameworkPropertyMetadata( 
                                0,
                                FrameworkPropertyMetadataOptions.AffectsParentMeasure), 
                        new ValidateValueCallback(IsValidMinWidowLines));

        /// <summary>
        /// The MinWidowLines is the minimum number of lines after a break 
        /// to be put on the next page or column.
        /// </summary> 
        public int MinWidowLines 
        {
            get { return (int)GetValue(MinWidowLinesProperty); } 
            set { SetValue(MinWidowLinesProperty, value); }
        }

        /// <summary> 
        /// DependencyProperty for <see cref="KeepWithNext" /> property.
        /// </summary> 
        public static final DependencyProperty KeepWithNextProperty = 
                DependencyProperty.Register(
                        "KeepWithNext", 
                        typeof(Boolean),
                        typeof(Paragraph),
                        new FrameworkPropertyMetadata(
                                false, 
                                FrameworkPropertyMetadataOptions.AffectsParentMeasure));
 
        /// <summary> 
        /// The KeepWithNext property indicates that this paragraph should be kept with
        /// the next paragraph in the track.  (This also implies that the paragraph itself 
        /// will not be broken.)
        /// </summary>
        public boolean KeepWithNext
        { 
            get { return (boolean)GetValue(KeepWithNextProperty); }
            set { SetValue(KeepWithNextProperty, value); } 
        } 

        /// <summary> 
        /// DependencyProperty for <see cref="KeepTogether" /> property.
        /// </summary>
        public static final DependencyProperty KeepTogetherProperty =
                DependencyProperty.Register( 
                        "KeepTogether",
                        typeof(Boolean), 
                        typeof(Paragraph), 
                        new FrameworkPropertyMetadata(
                                false, 
                                FrameworkPropertyMetadataOptions.AffectsParentMeasure));

        /// <summary>
        /// The KeepTogether property indicates that all the text in the paragraph 
        /// should be kept together.
        /// </summary> 
        public boolean KeepTogether 
        {
            get { return (boolean)GetValue(KeepTogetherProperty); } 
            set { SetValue(KeepTogetherProperty, value); }
        }

//        #endregion Public Properties 

        //-------------------------------------------------------------------- 
        // 
        // Internal Methods
        // 
        //--------------------------------------------------------------------

//        #region Internal Methods
 
        /*internal*/ public void GetDefaultMarginValue(/*ref*/ Thickness margin)
        { 
            double lineHeight = this.LineHeight; 
            if (IsLineHeightAuto(lineHeight))
            { 
                lineHeight = this.FontFamily.LineSpacing * this.FontSize;
            }
            margin = new Thickness(0, lineHeight, 0, lineHeight);
        } 

        /*internal*/ public static boolean IsMarginAuto(Thickness margin) 
        { 
            return (Double.IsNaN(margin.Left) && Double.IsNaN(margin.Right) && Double.IsNaN(margin.Top) && Double.IsNaN(margin.Bottom));
        } 

        /*internal*/ public static boolean IsLineHeightAuto(double lineHeight)
        {
            return (Double.IsNaN(lineHeight)); 
        }
 
        // Returns true if there is no text/embedded element content in passed paragraph, 
        // it may have zero or more inline formatting tags with no text.
        /*internal*/ public static boolean HasNoTextContent(Paragraph paragraph) 
        {
            ITextPointer navigator = paragraph.ContentStart.CreatePointer();
            ITextPointer end = paragraph.ContentEnd;
 
            while (navigator.CompareTo(end) < 0)
            { 
                TextPointerContext symbolType = navigator.GetPointerContext(LogicalDirection.Forward); 
                if (symbolType ==  TextPointerContext.Text ||
                    symbolType == TextPointerContext.EmbeddedElement || 
                    typeof(LineBreak).IsAssignableFrom(navigator.ParentType) ||
                    typeof(AnchoredBlock).IsAssignableFrom(navigator.ParentType))
                {
                    return false; 
                }
                navigator.MoveToNextContextPosition(LogicalDirection.Forward); 
            } 

            return true; 
        }

        /// <summary>
        /// This method is used by TypeDescriptor to determine if this property should 
        /// be serialized.
        /// </summary> 
//        [EditorBrowsable(EditorBrowsableState.Never)] 
        public boolean ShouldSerializeInlines(XamlDesignerSerializationManager manager)
        { 
            return manager != null && manager.XmlWriter == null;
        }

//        #endregion Internal Methods 

        //------------------------------------------------------------------- 
        // 
        // Private Methods
        // 
        //--------------------------------------------------------------------

//        #region Private Methods
        private static boolean IsValidMinOrphanLines(Object o) 
        {
            int value = (int)o; 
            /*const*/static final int maxLines = PTS.Restrictions.tscLineInParaRestriction; 
            return (value >= 0 && value <= maxLines);
        } 

        private static boolean IsValidMinWidowLines(Object o)
        {
            int value = (int)o; 
            /*const*/static final int maxLines = PTS.Restrictions.tscLineInParaRestriction;
            return (value >= 0 && value <= maxLines); 
        } 

        private static boolean IsValidTextIndent(Object o) 
        {
            double indent = (double)o;
            double maxIndent = Math.Min(1000000, PTS.MaxPageSize);
            double minIndent = -maxIndent; 
            if (Double.IsNaN(indent))
            { 
                return false; 
            }
            if (indent < minIndent || indent > maxIndent) 
            {
                return false;
            }
            return true; 
        }
 
//        #endregion Private Methods 
    }