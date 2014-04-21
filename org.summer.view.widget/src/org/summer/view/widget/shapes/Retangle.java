/**
 */
package org.summer.view.widget.shapes;

import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.Rect;
import org.summer.view.widget.Size;
import org.summer.view.widget.media.DrawingContext;
import org.summer.view.widget.media.Geometry;
import org.summer.view.widget.media.Pen;
import org.summer.view.widget.media.Transform;


/// <summary> 
/// The rectangle shape element
/// This element (like all shapes) belongs under a Canvas, 
/// and will be presented by the parent canvas.
/// </summary>
/// <ExternalAPI/>
public /*sealed*/ class Rectangle extends Shape 
{

//    #region Constructors 
    /// <summary>
    /// Instantiates a new instance of a Rectangle with no parent element. 
    /// </summary>
    /// <ExternalAPI/>
    public Rectangle()
    { 
    }

    // The default stretch mode of Rectangle is Fill 
    static //Rectangle()
    { 
        StretchProperty.OverrideMetadata(typeof(Rectangle), new FrameworkPropertyMetadata(Stretch.Fill));
    }

//    #endregion Constructors 

//    #region Dynamic Properties 

    /// <summary>
    /// RadiusX Dynamic Property - if set, this rectangle becomes rounded 
    /// </summary>
    /// <ExternalAPI/>
    public static final DependencyProperty RadiusXProperty =
        DependencyProperty.Register( "RadiusX", typeof(Double), typeof(Rectangle), 
            new FrameworkPropertyMetadata(0d, FrameworkPropertyMetadataOptions.AffectsRender));

    /// <summary> 
    /// Provide public access to RadiusX property.
    /// <seealso cref="RadiusXProperty"/> 
    /// </summary>
    /// <ExternalAPI/>
//    [TypeConverter(typeof(LengthConverter))]
    public double RadiusX 
    {
        get 
        { 
            return (double)GetValue(RadiusXProperty);
        } 
        set
        {
            SetValue(RadiusXProperty, value);
        } 
    }

    /// <summary> 
    /// RadiusY Dynamic Property - if set, this rectangle becomes rounded
    /// </summary> 
    /// <ExternalAPI/>
    public static final DependencyProperty RadiusYProperty =
        DependencyProperty.Register( "RadiusY", typeof(Double), typeof(Rectangle),
            new FrameworkPropertyMetadata(0d, FrameworkPropertyMetadataOptions.AffectsRender)); 

    /// <summary> 
    /// Provide public access to RadiusY property. 
    /// <seealso cref="RadiusYProperty"/>
    /// </summary> 
    /// <ExternalAPI/>
//    [TypeConverter(typeof(LengthConverter))]
    public double RadiusY
    { 
        get
        { 
            return (double)GetValue(RadiusYProperty); 
        }
        set 
        {
            SetValue(RadiusYProperty, value);
        }
    } 

    // For a Rectangle, RenderedGeometry = defining geometry and GeometryTransform = Identity 

    /// <summary>
    /// The RenderedGeometry property returns the final rendered geometry 
    /// </summary>
    public /*override*/ Geometry RenderedGeometry
    {
        get 
        {
            // RenderedGeometry = defining geometry 
            return new RectangleGeometry(_rect, RadiusX, RadiusY); 
        }
    } 

    /// <summary>
    /// Return the transformation applied to the geometry before rendering
    /// </summary> 
    public /*override*/ Transform GeometryTransform
    { 
        get 
        {
            return Transform.Identity; 
        }
    }

//    #endregion Dynamic Properties 

//    #region Protected 

    /// <summary>
    /// Updates DesiredSize of the Rectangle.  Called by parent UIElement.  This is the first pass of layout. 
    /// </summary>
    /// <param name="constraint">Constraint size is an "upper limit" that Rectangle should not exceed.</param>
    /// <returns>Rectangle's desired size.</returns>
    protected /*override*/ Size MeasureOverride(Size constraint) 
    {
        if (Stretch == Stretch.UniformToFill) 
        { 
            double width = constraint.Width;
            double height = constraint.Height; 

            if (Double.IsInfinity(width) && Double.IsInfinity(height))
            {
                return GetNaturalSize(); 
            }
            else if (Double.IsInfinity(width) || Double.IsInfinity(height)) 
            { 
                width = Math.Min(width, height);
            } 
            else
            {
                width = Math.Max(width, height);
            } 

            return new Size(width, width); 
        } 

        return GetNaturalSize(); 
    }

    /// <summary>
    /// Returns the final size of the shape and cachnes the bounds. 
    /// </summary>
    protected /*override*/ Size ArrangeOverride(Size finalSize) 
    { 
        // Since we do NOT want the RadiusX and RadiusY to change with the rendering transformation, we
        // construct the rectangle to fit finalSize with the appropriate Stretch mode.  The rendering 
        // transformation will thus be the identity.

        double penThickness = GetStrokeThickness();
        double margin = penThickness / 2; 

        _rect = new Rect( 
            margin, // X 
            margin, // Y
            Math.Max(0, finalSize.Width - penThickness),    // Width 
            Math.Max(0, finalSize.Height - penThickness));  // Height

        switch (Stretch)
        { 
            case Stretch.None:
                // A 0 Rect.Width and Rect.Height rectangle 
                _rect.Width = _rect.Height = 0; 
                break;

            case Stretch.Fill:
                // The most common case: a rectangle that fills the box.
                // _rect has already been initialized for that.
                break; 

            case Stretch.Uniform: 
                // The maximal square that fits in the final box 
                if (_rect.Width > _rect.Height)
                { 
                    _rect.Width = _rect.Height;
                }
                else  // _rect.Width <= _rect.Height
                { 
                    _rect.Height = _rect.Width;
                } 
                break; 

            case Stretch.UniformToFill: 

                // The minimal square that fills the final box
                if (_rect.Width < _rect.Height)
                { 
                    _rect.Width = _rect.Height;
                } 
                else  // _rect.Width >= _rect.Height 
                {
                    _rect.Height = _rect.Width; 
                }
                break;
        }


        ResetRenderedGeometry(); 

        return finalSize;
    } 

    /// <summary>
    /// Get the rectangle that defines this shape
    /// </summary> 
    protected /*override*/ Geometry DefiningGeometry
    { 
        get 
        {
            return new RectangleGeometry(_rect, RadiusX, RadiusY); 
        }
    }

    /// <summary> 
    /// Render callback.
    /// </summary> 
    protected /*override*/ void OnRender(DrawingContext drawingContext) 
    {
        Pen pen = GetPen(); 
        drawingContext.DrawRoundedRectangle(Fill, pen, _rect, RadiusX, RadiusY);
    }

//    #endregion Protected 

//    #region Internal Methods 

    /*internal*/ public /*override*/ void CacheDefiningGeometry()
    { 
        double margin = GetStrokeThickness() / 2;

        _rect = new Rect(margin, margin, 0, 0);
    } 


    /// <summary> 
    /// Get the natural size of the geometry that defines this shape
    /// </summary> 
    /*internal*/ public /*override*/ Size GetNaturalSize()
    {
        double strokeThickness = GetStrokeThickness();
        return new Size(strokeThickness, strokeThickness); 
    }

    /// <summary> 
    /// Get the bonds of the rectangle that defines this shape
    /// </summary> 
    /*internal*/ public /*override*/ Rect GetDefiningGeometryBounds()
    {
        return _rect;
    } 

    // 
    //  This property 
    //  1. Finds the correct initial size for the _effectiveValues store on the current DependencyObject
    //  2. This is a performance optimization 
    //
    /*internal*/ public /*override*/ int EffectiveValuesInitialSize
    {
        get { return 19; } 
    }

//    #endregion Internal Methods 

//    #region Private Fields 

    private Rect _rect = Rect.Empty;

//    #endregion Private Fields 
}
