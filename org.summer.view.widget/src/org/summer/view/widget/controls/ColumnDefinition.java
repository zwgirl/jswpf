/**
 */
package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.FrameworkPropertyMetadata;

public class ColumnDefinition extends DefinitionBase {
//    #region Public Fields
//    #region Dependency Properties
//    [TypeConverter("System.Windows.LengthConverter, PresentationFramework, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, Custom=null")]
    public static final DependencyProperty MaxWidthProperty = DependencyProperty.Register("MaxWidth", typeof(double), typeof(ColumnDefinition), new FrameworkPropertyMetadata(double.PositiveInfinity, InvalidateGridMeasure));
//    [TypeConverter("System.Windows.LengthConverter, PresentationFramework, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, Custom=null")]
    public static final DependencyProperty MinWidthProperty = DependencyProperty.Register("MinWidth", typeof(double), typeof(ColumnDefinition), new FrameworkPropertyMetadata(InvalidateGridMeasure));
    public static final DependencyProperty WidthProperty = DependencyProperty.Register("Width", typeof(GridLength), typeof(ColumnDefinition), new FrameworkPropertyMetadata(new GridLength(1, GridUnitType.Star), InvalidateGridMeasure));
//    #endregion
//    #endregion

//    #region Private Fields
    double actual_width;
    double offset;
    Grid grid;
//    #endregion

//    #region Public Constructors
    public ColumnDefinition() {
    }
//    #endregion

//    #region Public Properties
//    #region Dependency Properties
//    [TypeConverter(typeof(LengthConverter))]
    public double MaxWidth {
            get { return (double)GetValue(MaxWidthProperty); }
            set { SetValue(MaxWidthProperty, value); } 
    }

//    [TypeConverter(typeof(LengthConverter))]
    public double MinWidth {
            get { return (double)GetValue(MinWidthProperty); }
            set { SetValue(MinWidthProperty, value); }
    }

    public GridLength Width {
            get { return (GridLength)GetValue(WidthProperty); }
            set { SetValue(WidthProperty, value); }
    }
//    #endregion

    public double ActualWidth {
            get { return actual_width; }
            /*internal*/ public set { actual_width = value; }
    }

    public double Offset {
            get { return offset; }
            /*internal*/ public set { offset = value; }
    }
//    #endregion

//    #region Internal Properties
    /*internal*/ public Grid Grid {
            get { return grid; }
            set { grid = value; }
    }
//    #endregion

//    #region Private Methods
    static void InvalidateGridMeasure(DependencyObject d, DependencyPropertyChangedEventArgs e) {
            Grid grid = ((ColumnDefinition)d).grid;
            if (grid != null)
                    grid.InvalidateMeasure();
    }
//    #endregion
}