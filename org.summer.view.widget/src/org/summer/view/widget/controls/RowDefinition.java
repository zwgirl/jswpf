/**
 */
package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.FrameworkPropertyMetadata;

public class RowDefinition extends DefinitionBase {
//    #region Public Fields
//    #region Dependency Properties
//    [TypeConverter("System.Windows.LengthConverter, PresentationFramework, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, Custom=null")]
    public static final DependencyProperty MaxHeightProperty = DependencyProperty.Register("MaxHeight", typeof(Double), typeof(RowDefinition), new FrameworkPropertyMetadata(double.PositiveInfinity, InvalidateGridMeasure));
//    [TypeConverter("System.Windows.LengthConverter, PresentationFramework, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, Custom=null")]
    public static final DependencyProperty MinHeightProperty = DependencyProperty.Register("MinHeight", typeof(Double), typeof(RowDefinition), new FrameworkPropertyMetadata(InvalidateGridMeasure));
    public static final DependencyProperty HeightProperty = DependencyProperty.Register("Height", typeof(GridLength), typeof(RowDefinition), new FrameworkPropertyMetadata(new GridLength(1, GridUnitType.Star), InvalidateGridMeasure));
//    #endregion
//    #endregion
//
//    #region Private Fields
    double actual_height;
    double offset;
    Grid grid;
//    #endregion

//    #region Public Constructors
    public RowDefinition() {
    }
//    #endregion

//    #region Public Properties
//    #region Dependency Properties
//    [TypeConverter(typeof(LengthConverter))]
    public double MaxHeight {
            get { return (double)GetValue(MaxHeightProperty); }
            set { SetValue(MaxHeightProperty, value); } 
    }

//    [TypeConverter(typeof(LengthConverter))]
    public double MinHeight {
            get { return (double)GetValue(MinHeightProperty); }
            set { SetValue(MinHeightProperty, value); }
    }

    public GridLength Height {
            get { return (GridLength)GetValue(HeightProperty); }
            set { SetValue(HeightProperty, value); }
    }
//    #endregion

    public double ActualHeight {
            get { return actual_height; }
            internal set { actual_height = value; }
    }

    public double Offset {
            get { return offset; }
            internal set { offset = value; }
    }
//    #endregion

//    #region Internal Properties
    internal Grid Grid {
            get { return grid; }
            set { grid = value; }
    }
//    #endregion

//    #region Private Methods
    static void InvalidateGridMeasure(DependencyObject d, DependencyPropertyChangedEventArgs e) {
            Grid grid = ((RowDefinition)d).grid;
            if (grid != null)
                    grid.InvalidateMeasure();
    }
//    #endregion
}