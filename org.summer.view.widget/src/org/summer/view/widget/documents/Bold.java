package org.summer.view.widget.documents;

import org.summer.view.widget.FrameworkPropertyMetadata;
    /// <summary> 
    /// Bold element - markup helper for indicating bolded content.
    /// Equivalent to a Span with FontWeight property set to FontWeights.Bold. 
    /// Can contain other inline elements. 
    /// </summary>
    public class Bold extends Span 
    {
        //-------------------------------------------------------------------
        //
        // Connstructors 
        //
        //------------------------------------------------------------------- 
 
//        #region Constructors
 
        /// <summary>
        /// Static ctor.  Initializes property metadata.
        /// </summary>
        static //Bold() 
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(Bold), new FrameworkPropertyMetadata(typeof(Bold))); 
        } 

        /// <summary> 
        /// Initilizes a new instance of a Bold element
        /// </summary>
        /// <remarks>
        /// To become fully functional this element requires at least one other Inline element 
        /// as its child, typically Run with some text.
        /// In Xaml markup the Bold element may appear without Run child, 
        /// but please note that such Run was implicitly inserted by parser. 
        /// </remarks>
        public Bold() 
        {
        	super() ;
        }

        /// <summary> 
        /// Initializes a new instance of Bold element and adds a given Inline element as its first child.
        /// </summary> 
        /// <param name="childInline"> 
        /// Inline element added as an initial child to this Bold element
        /// </param> 
        public Bold(Inline childInline) 
        {
        	super(childInline);
        }
 
        /// <summary>
        /// Creates a new Bold instance. 
        /// </summary> 
        /// <param name="childInline">
        /// Optional child Inline for the new Bold.  May be null. 
        /// </param>
        /// <param name="insertionPosition">
        /// Optional position at which to insert the new Bold.  May be null.
        /// </param> 
        public Bold(Inline childInline, TextPointer insertionPosition) 
        { 
        	super(childInline, insertionPosition);
        } 

        /// <summary> 
        /// Creates a new Span instance covering existing content.
        /// </summary>
        /// <param name="start">
        /// Start position of the new Span. 
        /// </param>
        /// <param name="end"> 
        /// End position of the new Span. 
        /// </param>
        /// <remarks> 
        /// start and end must both be parented by the same Paragraph, otherwise
        /// the method will raise an ArgumentException.
        /// </remarks>
        public Bold(TextPointer start, TextPointer end) 
        {
        	super(start, end);
        } 
 
//        #endregion Constructors
    } 