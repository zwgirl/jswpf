package org.summer.view.widget.documents;
/// <summary> 
    /// Provide definition for a kind of text content in which measuring, hittesting
    /// and drawing of the entire content is done in whole. Example of that kind of 
    /// content is a button in the middle of the line.
    /// </summary>
    public abstract class TextEmbeddedObject extends TextRun
    { 
        /// <summary>
        /// Line break condition before text object 
        /// </summary> 
        public abstract LineBreakCondition BreakBefore
        { get; } 


        /// <summary>
        /// Line break condition after text object 
        /// </summary>
        public abstract LineBreakCondition BreakAfter 
        { get; } 

 
        /// <summary>
        /// Flag indicates whether text object has fixed size regardless of where
        /// it is placed within a line
        /// </summary> 
        public abstract bool HasFixedSize
        { get; } 
 

        /// <summary> 
        /// Get text object measurement metrics that will fit within the specified
        /// remaining width of the paragraph
        /// </summary>
        /// <param name="remainingParagraphWidth">remaining paragraph width</param> 
        /// <returns>text object metrics</returns>
        public abstract TextEmbeddedObjectMetrics Format( 
            double  remainingParagraphWidth 
            );
 

        /// <summary>
        /// Get computed bounding box of text object
        /// </summary> 
        /// <param name="rightToLeft">run is drawn from right to left</param>
        /// <param name="sideways">run is drawn with its side parallel to baseline</param> 
        /// <returns>computed bounding box size of text object</returns> 
        public abstract Rect ComputeBoundingBox(
            bool    rightToLeft, 
            bool    sideways
            );

 
        /// <summary>
        /// Draw text object 
        /// </summary> 
        /// <param name="drawingContext">drawing context</param>
        /// <param name="origin">origin where the object is drawn</param> 
        /// <param name="rightToLeft">run is drawn from right to left</param>
        /// <param name="sideways">run is drawn with its side parallel to baseline</param>
        public abstract void Draw(
            DrawingContext      drawingContext, 
            Point               origin,
            bool                rightToLeft, 
            bool                sideways 
            );
    } 



    /// <summary> 
    /// Text object properties
    /// </summary> 
    