/**
 * GridViewRowPresenter
 */

define(["dojo/_base/declare", "system/Type", "primitives/GridViewRowPresenterBase"],
		function(declare, Type, GridViewRowPresenterBase){
	var GridViewRowPresenter = declare("GridViewRowPresenter", GridViewRowPresenterBase,{
		constructor:function(){
//	        private FrameworkElement 
	        this._viewPort = null; 
//	        private FrameworkElement 
	        this._viewItem = null; 
//	        private Type 
	        this._oldContentType = null;
//	        private bool 
	        this._viewPortValid = false; 
//	        private bool 
	        this._isOnCurrentPage = false;
//	        private bool 
	        this._isOnCurrentPageValid = false;
		},
		
		/// <summary> 
        ///     Returns a string representation of this object.
        /// </summary> 
        /// <returns></returns>
//        public override string 
        ToString:function()
        {
            return SR.Get(SRID.ToStringFormatString_GridViewRowPresenter, 
                this.GetType(),
                (this.Content != null) ? this.Content.ToString() : String.Empty, 
                (this.Columns != null) ? this.Columns.Count : 0); 
        },

        /// <summary>
        ///     Called when ContentProperty is invalidated on "d."
        /// </summary>
//        private static void 
        OnContentChanged:function(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
        {
            /*GridViewRowPresenter*/var gvrp = d; 
 
            //
            // If the old and new value have the same type then we can save a lot of perf by 
            // keeping the existing ContentPresenters
            //

            var oldType = (e.OldValue != null) ? e.OldValue.GetType() : null; 
            var newType = (e.NewValue != null) ? e.NewValue.GetType() : null;
 
            // DisconnectedItem doesn't count as a real type change 
            if (e.NewValue == BindingExpressionBase.DisconnectedItem)
            { 
                gvrp._oldContentType = oldType;
                newType = oldType;
            }
            else if (e.OldValue == BindingExpressionBase.DisconnectedItem) 
            {
                oldType = gvrp._oldContentType; 
            } 

            if (oldType != newType) 
            {
                gvrp.NeedUpdateVisualTree = true;
            }
            else 
            {
                gvrp.UpdateCells(); 
            } 
        },

        /// <summary>
        /// Override of <seealso cref="FrameworkElement.MeasureOverride" />.
        /// </summary> 
        /// <param name="constraint">Constraint size is an "upper limit" that the return value should not exceed.</param>
        /// <returns>The GridViewRowPresenter's desired size.</returns> 
//        protected override Size 
        MeasureOverride:function(/*Size*/ constraint) 
        {
//            GridViewColumnCollection columns = Columns; 
//            if (columns == null) { return new Size(); }
//
//            UIElementCollection children = InternalChildren;
//            double maxHeight = 0.0;           // Max height of children. 
//            double accumulatedWidth = 0.0;    // Total width consumed by children.
//            double constraintHeight = constraint.Height; 
//            bool desiredWidthListEnsured = false; 
//
//            foreach (GridViewColumn column in columns) 
//            {
//                UIElement child = children[column.ActualIndex];
//                if (child == null) { continue; }
// 
//                double childConstraintWidth = Math.Max(0.0, constraint.Width - accumulatedWidth);
// 
//                if (column.State == ColumnMeasureState.Init 
//                    || column.State == ColumnMeasureState.Headered)
//                { 
//                    if (!desiredWidthListEnsured)
//                    {
//                        EnsureDesiredWidthList();
//                        LayoutUpdated += new EventHandler(OnLayoutUpdated); 
//                        desiredWidthListEnsured = true;
//                    } 
// 
//                    // Measure child.
//                    child.Measure(new Size(childConstraintWidth, constraintHeight)); 
//
//                    // As long as this is the first round of measure that has data participate
//                    // the width should be ensured
//                    // only element on current page paticipates in calculating the shared width 
//                    if (IsOnCurrentPage)
//                    { 
//                        column.EnsureWidth(child.DesiredSize.Width); 
//                    }
// 
//                    DesiredWidthList[column.ActualIndex] = column.DesiredWidth;
//
//                    accumulatedWidth += column.DesiredWidth;
//                } 
//                else if (column.State == ColumnMeasureState.Data)
//                { 
//                    childConstraintWidth = Math.Min(childConstraintWidth, column.DesiredWidth); 
//
//                    child.Measure(new Size(childConstraintWidth, constraintHeight)); 
//
//                    accumulatedWidth += column.DesiredWidth;
//                }
//                else // ColumnMeasureState.SpecificWidth 
//                {
//                    childConstraintWidth = Math.Min(childConstraintWidth, column.Width); 
// 
//                    child.Measure(new Size(childConstraintWidth, constraintHeight));
// 
//                    accumulatedWidth += column.Width;
//                }
//
//                maxHeight = Math.Max(maxHeight, child.DesiredSize.Height); 
//            }
// 
//            // Reset this flag so that we will re-caculate it on every measure. 
//            _isOnCurrentPageValid = false;
// 
//            // reserve space for dummy header next to the last column
//            accumulatedWidth += c_PaddingHeaderMinWidth;
//
//            return (new Size(accumulatedWidth, maxHeight)); 
        },
 
        /// <summary> 
        /// GridViewRowPresenter computes the position of its children inside each child's Margin and calls Arrange
        /// on each child. 
        /// </summary>
        /// <param name="arrangeSize">Size the GridViewRowPresenter will assume.</param>
//        protected override Size
        ArrangeOverride:function()
        { 
//            GridViewColumnCollection columns = Columns;
//            if (columns == null) { return arrangeSize; } 
// 
//            UIElementCollection children = InternalChildren;
// 
//            double accumulatedWidth = 0.0;
//            double remainingWidth = arrangeSize.Width;
//
//            foreach (GridViewColumn column in columns) 
//            {
//                UIElement child = children[column.ActualIndex]; 
//                if (child == null) { continue; } 
//
//                // has a given value or 'auto' 
//                double childArrangeWidth = Math.Min(remainingWidth, ((column.State == ColumnMeasureState.SpecificWidth) ? column.Width : column.DesiredWidth));
//
//                child.Arrange(new Rect(accumulatedWidth, 0, childArrangeWidth, arrangeSize.Height));
// 
//                remainingWidth -= childArrangeWidth;
//                accumulatedWidth += childArrangeWidth; 
//            } 
//
//            return arrangeSize; 
        },

        /// <summary> 
        /// Called when the Template's tree has been generated
        /// </summary> 
//        internal override void 
        OnPreApplyTemplate:function() 
        {
            // +-- GridViewRowPresenter ------------------------------------+ 
            // |                                                            |
            // |  +- CtPstr1 ---+   +- CtPstr2 ---+   +- CtPstr3 ---+       |
            // |  |             |   |             |   |             |  ...  |
            // |  +-------------+   +-------------+   +-------------+       | 
            // +-----------------------------------------------------------+
 
            base.OnPreApplyTemplate(); 

            if (NeedUpdateVisualTree) 
            {
                InternalChildren.Clear();

                // build the whole collection from draft. 
                /*GridViewColumnCollection*/var columns = Columns;
                if (columns != null) 
                { 
                    for/*each*/ (/*GridViewColumn*/var column in columns.ColumnCollection)
                    { 
                        InternalChildren.AddInternal(CreateCell(column));
                    }
                }
 
                NeedUpdateVisualTree = false;
            } 
 
            // invalidate viewPort cache
            this._viewPortValid = false; 
        },

        /// <summary>
        /// Handler of column's PropertyChanged event. Update correspondent property 
        /// if change is of Width / CellTemplate / CellTemplateSelector.
        /// </summary> 
//        internal override void 
        OnColumnPropertyChanged:function(/*GridViewColumn*/ column, /*string*/ propertyName) 
        {
//            Debug.Assert(column != null); 
            var index;

            // ActualWidth change is a noise to RowPresenter, so filter it out.
            // Note-on-perf: ActualWidth property change of will fire N x M times 
            // on every start up. (N: number of column with Width set to 'auto',
            // M: number of visible items) 
            if (GridViewColumn.c_ActualWidthName.Equals(propertyName)) 
            {
                return; 
            }

            // Width is the #1 property that will be changed frequently. The others
            // (DisplayMemberBinding/CellTemplate/Selector) are not. 

            if (((index = column.ActualIndex) >= 0) && (index < InternalChildren.Count)) 
            { 
                if (GridViewColumn.WidthProperty.Name.Equals(propertyName))
                { 
                    InvalidateMeasure();
                }

                // Priority: DisplayMemberBinding > CellTemplate > CellTemplateSelector 
                else if (GridViewColumn.c_DisplayMemberBindingName.Equals(propertyName))
                { 
                    /*FrameworkElement*/var cell = InternalChildren.Get(index);
                    cell = cell instanceof FrameworkElement ? cell : null; 
                    if (cell != null)
                    { 
                        /*BindingBase*/var binding = column.DisplayMemberBinding;
                        if (binding != null && cell instanceof TextBlock)
                        {
                            cell.SetBinding(TextBlock.TextProperty, binding); 
                        }
                        else 
                        { 
                            RenewCell(index, column);
                        } 
                    }
                }
                else
                { 
                    /*ContentPresenter*/var cp = InternalChildren.Get(index);
                    cp = cp instanceof ContentPresenter ?  cp : null;
                    if (cp != null) 
                    { 
                        if (GridViewColumn.CellTemplateProperty.Name.Equals(propertyName))
                        { 
                            /*DataTemplate*/var dt;
                            if ((dt = column.CellTemplate) == null)
                            {
                                cp.ClearValue(ContentControl.ContentTemplateProperty); 
                            }
                            else 
                            { 
                                cp.ContentTemplate = dt;
                            } 
                        }

                        else if (GridViewColumn.CellTemplateSelectorProperty.Name.Equals(propertyName))
                        { 
                            /*DataTemplateSelector*/var dts;
                            if ((dts = column.CellTemplateSelector) == null) 
                            { 
                                cp.ClearValue(ContentControl.ContentTemplateSelectorProperty);
                            } 
                            else
                            {
                                cp.ContentTemplateSelector = dts;
                            } 
                        }
                    } 
 
                }
            } 
        },

        /// <summary>
        /// process GridViewColumnCollection.CollectionChanged event. 
        /// </summary>
//        internal override void 
        OnColumnCollectionChanged:function(/*GridViewColumnCollectionChangedEventArgs*/ e) 
        { 
            base.OnColumnCollectionChanged(e);
 
            if (e.Action == NotifyCollectionChangedAction.Move)
            {
                InvalidateArrange();
            } 
            else
            { 
                switch (e.Action) 
                {
                    case NotifyCollectionChangedAction.Add: 
                        // New child will always be appended to the very last, no matter it
                        // is actually add via 'Insert' or just 'Add'.
                        InternalChildren.AddInternal(CreateCell((GridViewColumn)(e.NewItems[0])));
                        break; 

                    case NotifyCollectionChangedAction.Remove: 
                        InternalChildren.RemoveAt(e.ActualIndex); 
                        break;
 
                    case NotifyCollectionChangedAction.Replace:
                        InternalChildren.RemoveAt(e.ActualIndex);
                        InternalChildren.AddInternal(CreateCell((GridViewColumn)(e.NewItems[0])));
                        break; 

                    case NotifyCollectionChangedAction.Reset: 
                        InternalChildren.Clear(); 
                        break;
 
                    default:
                        break;
                }
 
                InvalidateMeasure();
            } 
        }, 

//        private void 
        FindViewPort:function() 
        {
            // assume GridViewRowPresenter is in Item's template 
            this._viewItem = this.TemplatedParent instanceof FrameworkElement ? this.TemplatedParent : null; 

            if (this._viewItem != null) 
            {
                /*ItemsControl*/var itemsControl = ItemsControl.ItemsControlFromItemContainer(this._viewItem);
                itemsControl=itemsControl instanceof ItemsControl ? itemsControl : null;

                if (itemsControl != null) 
                {
                    /*ScrollViewer*/var scrollViewer = itemsControl.ScrollHost;
                    scrollViewer = scrollViewer instanceof ScrollViewer ? scrollViewer : null; 
                    if (scrollViewer != null) 
                    {
                        // check if Virtualizing Panel do works 
                        if (itemsControl.ItemsHost instanceof VirtualizingPanel &&
                            scrollViewer.CanContentScroll)
                        {
                            // find the 'PART_ScrollContentPresenter' in GridViewScrollViewer 
                        	this._viewPort = scrollViewer.GetTemplateChild(ScrollViewer.ScrollContentPresenterTemplateName);
                        	this._viewPort = this._viewPort instanceof FrameworkElement ? this._viewPort : null;
 
                            // in case GridViewScrollViewer is re-styled, say, cannot find PART_ScrollContentPresenter 
                            if (this._viewPort == null)
                            { 
                            	this._viewPort = scrollViewer;
                            }
                        }
                    } 
                }
            } 
        }, 

//        private bool 
        CheckVisibleOnCurrentPage:function() 
        {
            if (!this._viewPortValid)
            {
            	this.FindViewPort(); 
            }
 
            var result = true; 

            if (this._viewItem != null && this._viewPort != null) 
            {
                var viewPortBounds = new Rect(new Point(), this._viewPort.RenderSize);
                var itemBounds = new Rect(new Point(), this._viewItem.RenderSize);
                itemBounds = this._viewItem.TransformToAncestor(this._viewPort).TransformBounds(itemBounds); 

                // check if item bounds falls in view port bounds (in height) 
                result = CheckContains(viewPortBounds, itemBounds); 
            }
 
            return result;
        },

//        private bool 
        CheckContains:function(/*Rect*/ container, /*Rect*/ element) 
        {
            // Check if ANY part of the element reside in container 
            // return true if and only if (either case) 
            //
            // +-------------------------------------------+ 
            // +  #================================#       +
            // +--#--------------------------------#-------+
            //    #                                #
            //    #                                # 
            // +--#--------------------------------#-------+
            // +  #                                #       + 
            // +--#--------------------------------#-------+ 
            //    #                                #
            //    #                                # 
            // +--#--------------------------------#-------+
            // +  #================================#       +
            // +-------------------------------------------+
 
            // The tolerance here is to make sure at least 2 pixels are inside container
            /*const double*/var tolerance = 2.0; 
 
            return ((CheckIsPointBetween(container, element.Top) && CheckIsPointBetween(container, element.Bottom)) ||
                    CheckIsPointBetween(element, container.Top + tolerance) || 
                    CheckIsPointBetween(element, container.Bottom - tolerance));
        },

//        private bool 
        CheckIsPointBetween:function(/*Rect*/ rect, /*double*/ pointY) 
        {
            // return rect.Top <= pointY <= rect.Bottom 
            return (DoubleUtil.LessThanOrClose(rect.Top, pointY) && 
                    DoubleUtil.LessThanOrClose(pointY, rect.Bottom));
        }, 

//        private void 
        OnLayoutUpdated:function(/*object*/ sender, /*EventArgs*/ e)
        {
            var desiredWidthChanged = false; // whether the shared minimum width has been changed since last layout 

            /*GridViewColumnCollection*/var columns = this.Columns; 
            if(columns != null) 
            {
                for/*each*/ (/*GridViewColumn*/var column in columns) 
                {
                    if ((column.State != ColumnMeasureState.SpecificWidth))
                    {
                        column.State = ColumnMeasureState.Data; 

                        if (DesiredWidthList == null || column.ActualIndex >= DesiredWidthList.Count) 
                        { 
                            // How can this happen?
                            // Between the last measure was called and this update is called, there can be a 
                            // change done to the ColumnCollection and result in DesiredWidthList out of [....]
                            // with the columnn collection. What can we do is end this call asap and the next
                            // measure will fix it.
                            desiredWidthChanged = true; 
                            break;
                        } 
 
                        if (!DoubleUtil.AreClose(column.DesiredWidth, DesiredWidthList[column.ActualIndex]))
                        { 
                            // Update the record because collection operation latter on might
                            // need to verified this list again, e.g. insert an 'auto'
                            // column, so that we won't trigger unnecessary update due to
                            // inconsistency of this column. 
                            DesiredWidthList[column.ActualIndex] = column.DesiredWidth;
 
                            desiredWidthChanged = true; 
                        }
                    } 
                }
            }

            if (desiredWidthChanged) 
            {
                InvalidateMeasure(); 
            } 

            LayoutUpdated -= new EventHandler(OnLayoutUpdated); 
        },

//        private FrameworkElement 
        CreateCell:function(/*GridViewColumn*/ column)
        { 
//            Debug.Assert(column != null, "column shouldn't be null");
 
            /*FrameworkElement*/var cell; 
            /*BindingBase*/var binding;
 
            // Priority: DisplayMemberBinding > CellTemplate > CellTemplateSelector

            if ((binding = column.DisplayMemberBinding) != null)
            { 
                cell = new TextBlock();
 
                // Needed this. Otherwise can't size to content at startup time. 
                // The reason is cell.Text is empty after the first round of measure.
                cell.DataContext = Content; 

                cell.SetBinding(TextBlock.TextProperty, binding);
            }
            else 
            {
                /*ContentPresenter*/var cp = new ContentPresenter(); 
                cp.Content = Content; 

                /*DataTemplate*/var dt; 
                /*DataTemplateSelector*/var dts;
                if ((dt = column.CellTemplate) != null)
                {
                    cp.ContentTemplate = dt; 
                }
                if ((dts = column.CellTemplateSelector) != null) 
                { 
                    cp.ContentTemplateSelector = dts;
                } 

                cell = cp;
            }
 
            // copy alignment properties from ListViewItem
            // for perf reason, not use binding here 
            /*ContentControl*/var parent; 
            if ((parent = this.TemplatedParent instanceof ContentControl ? this.TemplatedParent : null) != null)
            { 
                cell.VerticalAlignment = parent.VerticalContentAlignment;
                cell.HorizontalAlignment = parent.HorizontalContentAlignment;
            }
 
            cell.Margin = _defalutCellMargin;
 
            return cell; 
        },
 
//        private void 
        RenewCell:function(/*int*/ index, /*GridViewColumn*/ column)
        {
            InternalChildren.RemoveAt(index);
            InternalChildren.Insert(index, CreateCell(column)); 
        },
 
 
        /// <summary>
        /// Updates all cells to the latest Content. 
        /// </summary>
//        private void 
        UpdateCells:function()
        {
            /*ContentPresenter*/var cellAsCP; 
            /*FrameworkElement*/var cell;
            /*UIElementCollection*/var children = InternalChildren; 
            /*ContentControl*/var parent = this.TemplatedParent instanceof ContentControl ? this.TemplatedParent : null; 

            for (var i = 0; i < children.Count; i++) 
            {
                cell = /*(FrameworkElement)*/children[i];

                if ((cellAsCP = cell instanceof ContentPresenter ? cell : null) != null) 
                {
                    cellAsCP.Content = Content; 
                } 
                else
                { 
//                    Debug.Assert(cell is TextBlock, "cells are either TextBlocks or ContentPresenters");
                    cell.DataContext = Content;
                }
 
                if (parent != null)
                { 
                    cell.VerticalAlignment = parent.VerticalContentAlignment; 
                    cell.HorizontalAlignment = parent.HorizontalContentAlignment;
                } 
            }
        }
	});
	
	Object.defineProperties(GridViewRowPresenter.prototype,{
 
        /// <summary>
        ///     Content is the data used to generate the child elements of this control.
        /// </summary>
//        public object 
        Content: 
        {
            get:function() { return this.GetValue(GridViewRowPresenter.ContentProperty); }, 
            set:function(value) { this.SetValue(GridViewRowPresenter.ContentProperty, value); } 
        },
 
     
        // Used in UIAutomation 
        // Return the actual cells array (If user reorder column, the cell in InternalChildren isn't in the correct order)
//        internal List<UIElement> 
        ActualCells:
        {
            get:function() 
            {
                /*List<UIElement>*/var list = new List/*<UIElement>*/(); 
                /*GridViewColumnCollection*/var columns = this.Columns; 
                if (columns != null)
                { 
                    /*UIElementCollection*/var children = this.InternalChildren;
                    /*List<int>*/var indexList = columns.IndexList;

                    if (children.Count == columns.Count) 
                    {
                        for (var i = 0, count = columns.Count; i < count; ++i) 
                        { 
                            /*UIElement*/var cell = children.Get(indexList.Get(i));
                            if (cell != null) 
                            {
                                list.Add(cell);
                            }
                        } 
                    }
                } 
 
                return list;
            } 
        },

        // if RowPresenter is not 'real' visible, it should not participating in measuring column width 
        // NOTE: IsVisible is force-inheriting parent's value, that's why we pick IsVisible instead of Visibility 
        //       e.g. if RowPresenter's parent is hidden/collapsed (e.g. in ListTreeView),
        //            then RowPresenter.Visiblity = Visible, but RowPresenter.IsVisible = false 
//        private bool 
        IsOnCurrentPage:
        {
            get:function()
            { 
                if (!this._isOnCurrentPageValid)
                { 
                	this._isOnCurrentPage = this.IsVisible && this.CheckVisibleOnCurrentPage(); 
                	this._isOnCurrentPageValid = true;
                } 

                return _isOnCurrentPage;
            }
        } 
	});
	
	Object.defineProperties(GridViewRowPresenter,{

        /// <summary>
        ///     The DependencyProperty for the Content property.
        ///     Flags:              None 
        ///     Default Value:      null
        /// </summary> 
        // Any change in Content properties affectes layout measurement since 
        // a new template may be used. On measurement,
        // ApplyTemplate will be invoked leading to possible application 
        // of a new template.
//        public static readonly DependencyProperty 
        ContentProperty:
        {
        	get:function(){
        		if(GridViewRowPresenter._ContentProperty===undefined){
        			GridViewRowPresenter._ContentProperty =
                        ContentControl.ContentProperty.AddOwner(
                        		GridViewRowPresenter.Type, 
                                new FrameworkPropertyMetadata(
                                    null, 
                                    FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                    new PropertyChangedCallback(null, OnContentChanged))); 
        		}
        		return GridViewRowPresenter._ContentProperty;
        	}
        },
        
//        private static readonly Thickness 
        _defalutCellMargin:
        {
        	get:function(){
        		if(GridViewRowPresenter.__defalutCellMargin===undefined){
            		GridViewRowPresenter.__defalutCellMargin = new Thickness(6, 0, 6, 0); 
            	}
            	
            	return GridViewRowPresenter.__defalutCellMargin;
        	}
        }
  
	});
	
    /// <summary>
    ///     Called when ContentProperty is invalidated on "d."
    /// </summary>
//    private static void 
    function OnContentChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        GridViewRowPresenter gvrp = (GridViewRowPresenter)d; 

        //
        // If the old and new value have the same type then we can save a lot of perf by 
        // keeping the existing ContentPresenters
        //

        var oldType = (e.OldValue != null) ? e.OldValue.GetType() : null; 
        var newType = (e.NewValue != null) ? e.NewValue.GetType() : null;

        // DisconnectedItem doesn't count as a real type change 
        if (e.NewValue == BindingExpressionBase.DisconnectedItem)
        { 
            gvrp._oldContentType = oldType;
            newType = oldType;
        }
        else if (e.OldValue == BindingExpressionBase.DisconnectedItem) 
        {
            oldType = d._oldContentType; 
        } 

        if (oldType != newType) 
        {
            d.NeedUpdateVisualTree = true;
        }
        else 
        {
            d.UpdateCells(); 
        } 
    }

	
	GridViewRowPresenter.Type = new Type("GridViewRowPresenter", GridViewRowPresenter, [GridViewRowPresenterBase.Type]);
	return GridViewRowPresenter;
});





