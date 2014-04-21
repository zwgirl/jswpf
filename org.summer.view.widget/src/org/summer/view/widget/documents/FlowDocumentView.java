package org.summer.view.widget.documents;

import org.summer.view.widget.EventArgs;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.IServiceProvider;
import org.summer.view.widget.Rect;
import org.summer.view.widget.Size;
import org.summer.view.widget.Type;
import org.summer.view.widget.controls.ScrollViewer;
import org.summer.view.widget.controls.primitives.IScrollInfo;
import org.summer.view.widget.internal.EventHandler;
import org.summer.view.widget.media.Visual;
import org.summer.view.widget.utils.ArgumentOutOfRangeException;
import org.summer.view.window.DoubleUtil;
import org.summer.view.window.Vector;

/// <summary>
    /// Provides a view port for content of FlowDocument formatted bottomless area. 
    /// </summary>
    /*internal*/ public class FlowDocumentView extends FrameworkElement implements IScrollInfo, IServiceProvider
    {
        //------------------------------------------------------------------- 
        //
        //  Constructors 
        // 
        //-------------------------------------------------------------------
 
//        #region Constructors

        /// <summary>
        /// Static Constructor 
        /// </summary>
        static //FlowDocumentView() 
        { 
        }
 
        /// <summary>
        /// Constructor
        /// </summary>
        /*internal*/ public FlowDocumentView() 
        {
        } 
 
//        #endregion Constructors
 
        //--------------------------------------------------------------------
        //
        //  Protected Methods
        // 
        //-------------------------------------------------------------------
 
//        #region Protected Methods 

        /// <summary> 
        /// Content measurement.
        /// </summary>
        /// <param name="constraint">Constraint size.</param>
        /// <returns>Computed desired size.</returns> 
        protected /*sealed*/ /*override*/ Size MeasureOverride(Size constraint)
        { 
            Size desiredSize = new Size(); 

            if (_suspendLayout) 
            {
                desiredSize = this.DesiredSize;
            }
            else if (Document != null) 
            {
                // Create bottomless formatter, if necessary. 
                EnsureFormatter(); 

                // Format bottomless content. 
                _formatter.Format(constraint);

                // DesiredSize is set to the calculated size of the page.
                // If hosted by ScrollViewer, desired size is limited to constraint. 
                if (_scrollData != null)
                { 
                    desiredSize.Width = Math.Min(constraint.Width, _formatter.DocumentPage.Size.Width); 
                    desiredSize.Height = Math.Min(constraint.Height, _formatter.DocumentPage.Size.Height);
                } 
                else
                {
                    desiredSize = _formatter.DocumentPage.Size;
                } 
            }
            return desiredSize; 
        } 

        /// <summary> 
        /// Content arrangement.
        /// </summary>
        /// <param name="arrangeSize">Size that element should use to arrange itself and its children.</param>
        protected /*sealed*/ /*override*/ Size ArrangeOverride(Size arrangeSize) 
        {
            Rect viewport = Rect.Empty; 
            Vector offset; 
            boolean invalidateScrollInfo = false;
            Size safeArrangeSize = arrangeSize; 

            if (!_suspendLayout)
            {
                // Convert to TextDpi and convert back to double, to make sure that we are not 
                // getting rounding errors later.
                TextDpi.SnapToTextDpi(ref safeArrangeSize); 
 
                if (Document != null)
                { 
                    // Create bottomless formatter, if necessary.
                    EnsureFormatter();

                    // Arrange bottomless content. 
                    if (_scrollData != null)
                    { 
                        if (!DoubleUtil.AreClose(_scrollData.Viewport, safeArrangeSize)) 
                        {
                            _scrollData.Viewport = safeArrangeSize; 
                            invalidateScrollInfo = true;
                        }

                        if (!DoubleUtil.AreClose(_scrollData.Extent, _formatter.DocumentPage.Size)) 
                        {
                            _scrollData.Extent = _formatter.DocumentPage.Size; 
                            invalidateScrollInfo = true; 
                            // DocumentPage Size is calculated by converting double to int and then back to double.
                            // This conversion may produce rounding errors and force us to show scrollbars in cases 
                            // when extent is within 1px from viewport. To workaround this issue, snap extent to viewport
                            // if we are within 1px range.
                            if (Math.Abs(_scrollData.ExtentWidth - _scrollData.ViewportWidth) < 1)
                            { 
                                _scrollData.ExtentWidth = _scrollData.ViewportWidth;
                            } 
                            if (Math.Abs(_scrollData.ExtentHeight - _scrollData.ViewportHeight) < 1) 
                            {
                                _scrollData.ExtentHeight = _scrollData.ViewportHeight; 
                            }
                        }
                        offset = new Vector(
                            Math.Max(0, Math.Min(_scrollData.ExtentWidth - _scrollData.ViewportWidth, _scrollData.HorizontalOffset)), 
                            Math.Max(0, Math.Min(_scrollData.ExtentHeight - _scrollData.ViewportHeight, _scrollData.VerticalOffset)));
                        if (!DoubleUtil.AreClose(offset, _scrollData.Offset)) 
                        { 
                            _scrollData.Offset = offset;
                            invalidateScrollInfo = true; 
                        }
                        if (invalidateScrollInfo && _scrollData.ScrollOwner != null)
                        {
                            _scrollData.ScrollOwner.InvalidateScrollInfo(); 
                        }
                        viewport = new Rect(_scrollData.HorizontalOffset, _scrollData.VerticalOffset, safeArrangeSize.Width, safeArrangeSize.Height); 
                    } 
                    _formatter.Arrange(safeArrangeSize, viewport);
 
                    // Connect to visual tree.
                    if (_pageVisual != _formatter.DocumentPage.Visual)
                    {
                        if (_textView != null) 
                        {
                            _textView.OnPageConnected(); 
                        } 
                        if (_pageVisual != null)
                        { 
                            RemoveVisualChild(_pageVisual);
                        }
                        _pageVisual = (PageVisual)_formatter.DocumentPage.Visual;
                        AddVisualChild(_pageVisual); 
                    }
 
                    // Set appropriate content offset 
                    if (_scrollData != null)
                    { 
                        _pageVisual.Offset = new Vector(-_scrollData.HorizontalOffset, -_scrollData.VerticalOffset);
                    }

                    // DocumentPage.Visual is always returned in LeftToRight FlowDirection. 
                    // Hence, if the the current FlowDirection is RightToLeft,
                    // mirroring transform need to be applied to the content. 
                    PtsHelper.UpdateMirroringTransform(FlowDirection, FlowDirection.LeftToRight, _pageVisual, safeArrangeSize.Width); 
                }
                else 
                {
                    if (_pageVisual != null)
                    {
                        if (_textView != null) 
                        {
                            _textView.OnPageDisconnected(); 
                        } 
                        RemoveVisualChild(_pageVisual);
                        _pageVisual = null; 
                    }
                    // Arrange bottomless content.
                    if (_scrollData != null)
                    { 
                        if (!DoubleUtil.AreClose(_scrollData.Viewport, safeArrangeSize))
                        { 
                            _scrollData.Viewport = safeArrangeSize; 
                            invalidateScrollInfo = true;
                        } 
                        if (!DoubleUtil.AreClose(_scrollData.Extent, new Size()))
                        {
                            _scrollData.Extent = new Size();
                            invalidateScrollInfo = true; 
                        }
                        if (!DoubleUtil.AreClose(_scrollData.Offset, new Vector())) 
                        { 
                            _scrollData.Offset = new Vector();
                            invalidateScrollInfo = true; 
                        }
                        if (invalidateScrollInfo && _scrollData.ScrollOwner != null)
                        {
                            _scrollData.ScrollOwner.InvalidateScrollInfo(); 
                        }
                    } 
                } 
            }
            return arrangeSize; 
        }

        /// <summary>
        /// Returns visual child at specified index. FlowDocumentView has just one child. 
        /// </summary>
        protected /*override*/ Visual GetVisualChild(int index) 
        { 
            if (index != 0)
            { 
                throw new ArgumentOutOfRangeException("index"/*, index, SR.Get(SRID.Visual_ArgumentOutOfRange)*/);
            }
            return _pageVisual;
        } 

//        #endregion Protected Methods 
 
        //--------------------------------------------------------------------
        // 
        //  Protected Properties
        //
        //--------------------------------------------------------------------
 
//        #region Protected Properties
 
        /// <summary> 
        /// Returns number of children. FlowDocumentView has just one child.
        /// </summary> 
        protected /*override*/ int VisualChildrenCount
        {
            get
            { 
                return _pageVisual == null ? 0 : 1;
            } 
        } 

//        #endregion Protected Properties 

        //-------------------------------------------------------------------
        //
        //  Internal Methods 
        //
        //-------------------------------------------------------------------- 
 
//        #region Internal Methods
 
        /// <summary>
        /// Suspends page layout.
        /// </summary>
        /*internal*/ public void SuspendLayout() 
        {
            _suspendLayout = true; 
            if (_pageVisual != null) 
            {
                _pageVisual.Opacity = 0.5; 
            }
        }

        /// <summary> 
        /// Resumes page layout.
        /// </summary> 
        /*internal*/ public void ResumeLayout() 
        {
            _suspendLayout = false; 
            if (_pageVisual != null)
            {
                _pageVisual.Opacity = 1.0;
            } 
            InvalidateMeasure();
        } 
 
//        #endregion Internal Methods
 
        //-------------------------------------------------------------------
        //
        //  Internal Properties
        // 
        //-------------------------------------------------------------------
 
//        #region Internal Properties 

        /// <summary> 
        /// BreakRecordTable.
        /// </summary>
        /*internal*/ public FlowDocument Document
        { 
            get
            { 
                return _document; 
            }
            set 
            {
                if (_formatter != null)
                {
                    HandleFormatterSuspended(_formatter, EventArgs.Empty); 
                }
                _suspendLayout = false; 
                _textView = null; 
                _document = value;
                InvalidateMeasure(); 
                InvalidateVisual(); //ensure re-rendering
            }
        }
 
        /// <summary>
        /// DocumentPage. 
        /// </summary> 
        /*internal*/ public FlowDocumentPage DocumentPage
        { 
            get
            {
                if (_document != null)
                { 
                    EnsureFormatter();
                    return _formatter.DocumentPage; 
                } 
                return null;
            } 
        }

//        #endregion Internal Properties
 
        //-------------------------------------------------------------------
        // 
        //  Private Methods 
        //
        //-------------------------------------------------------------------- 

//        #region Private Methods

        /// <summary> 
        /// Ensures valid instance of FlowDocumentFormatter.
        /// </summary> 
        private void EnsureFormatter() 
        {
            Invariant.Assert(_document != null); 
            if (_formatter == null)
            {
                _formatter = _document.BottomlessFormatter;
                _formatter.ContentInvalidated += new EventHandler(HandleContentInvalidated); 
                _formatter.Suspended += new EventHandler(HandleFormatterSuspended);
            } 
            Invariant.Assert(_formatter == _document.BottomlessFormatter); 
        }
 
        /// <summary>
        /// Responds to content invalidation.
        /// </summary>
        private void HandleContentInvalidated(Object sender, EventArgs e) 
        {
            Invariant.Assert(sender == _formatter); 
            InvalidateMeasure(); 
            InvalidateVisual(); //ensure re-rendering
        } 

        /// <summary>
        /// Responds to formatter suspention.
        /// </summary> 
        private void HandleFormatterSuspended(Object sender, EventArgs e)
        { 
            Invariant.Assert(sender == _formatter); 

            // Disconnect formatter. 
            _formatter.ContentInvalidated -= new EventHandler(HandleContentInvalidated);
            _formatter.Suspended -= new EventHandler(HandleFormatterSuspended);
            _formatter = null;
 
            // Disconnect any content associated with the formatter.
            if (_pageVisual != null && !_suspendLayout) 
            { 
                if (_textView != null)
                { 
                    _textView.OnPageDisconnected();
                }
                RemoveVisualChild(_pageVisual);
                _pageVisual = null; 
            }
        } 
 
//        #endregion Private Methods
 
        //-------------------------------------------------------------------
        //
        //  Private Fields
        // 
        //--------------------------------------------------------------------
 
//        #region Private Fields 

        private FlowDocument _document;             // Hosted FlowDocument 
        private PageVisual _pageVisual;             // Visual representing the content
        private FlowDocumentFormatter _formatter;   // Bottomless formatter associated with FlowDocument
        private ScrollData _scrollData;             // IScrollInfo related data, if hosted by ScrollViewer
        private DocumentPageTextView _textView;     // TextView associated with this element. 
        private boolean _suspendLayout;                // Layout of the page is suspended.
 
//        #endregion Private Fields 

        //-------------------------------------------------------------------- 
        //
        //  IScrollInfo Members
        //
        //------------------------------------------------------------------- 

//        #region IScrollInfo Members 
 
        /// <summary>
        /// <see cref="IScrollInfo.LineUp"/> 
        /// </summary>
        public void /*IScrollInfo.*/LineUp()
        {
            if (_scrollData != null) 
            {
                _scrollData.LineUp(this); 
            } 
        }
 
        /// <summary>
        /// <see cref="/*IScrollInfo.*/LineDown"/>
        /// </summary>
        public void /*IScrollInfo.*/LineDown() 
        {
            if (_scrollData != null) 
            { 
                _scrollData.LineDown(this);
            } 
        }

        /// <summary>
        /// <see cref="IScrollInfo.LineLeft"/> 
        /// </summary>
        public void /*IScrollInfo.*/LineLeft() 
        { 
            if (_scrollData != null)
            { 
                _scrollData.LineLeft(this);
            }
        }
 
        /// <summary>
        /// <see cref="IScrollInfo.LineRight"/> 
        /// </summary> 
        public void /*IScrollInfo.*/LineRight()
        { 
            if (_scrollData != null)
            {
                _scrollData.LineRight(this);
            } 
        }
 
        /// <summary> 
        /// <see cref="IScrollInfo.PageUp"/>
        /// </summary> 
        public void /*IScrollInfo.*/PageUp()
        {
            if (_scrollData != null)
            { 
                _scrollData.PageUp(this);
            } 
        } 

        /// <summary> 
        /// <see cref="IScrollInfo.PageDown"/>
        /// </summary>
        public void /*IScrollInfo.*/PageDown()
        { 
            if (_scrollData != null)
            { 
                _scrollData.PageDown(this); 
            }
        } 

        /// <summary>
        /// <see cref="IScrollInfo.PageLeft"/>
        /// </summary> 
        public void /*IScrollInfo.*/PageLeft()
        { 
            if (_scrollData != null) 
            {
                _scrollData.PageLeft(this); 
            }
        }

        /// <summary> 
        /// <see cref="IScrollInfo.PageRight"/>
        /// </summary> 
        public void /*IScrollInfo.*/PageRight() 
        {
            if (_scrollData != null) 
            {
                _scrollData.PageRight(this);
            }
        } 

        /// <summary> 
        /// <see cref="IScrollInfo.MouseWheelUp"/> 
        /// </summary>
        public void /*IScrollInfo.*/MouseWheelUp() 
        {
            if (_scrollData != null)
            {
                _scrollData.MouseWheelUp(this); 
            }
        } 
 
        /// <summary>
        /// <see cref="IScrollInfo.MouseWheelDown"/> 
        /// </summary>
        public void /*IScrollInfo.*/MouseWheelDown()
        {
            if (_scrollData != null) 
            {
                _scrollData.MouseWheelDown(this); 
            } 
        }
 
        /// <summary>
        /// <see cref="IScrollInfo.MouseWheelLeft"/>
        /// </summary>
        public void /*IScrollInfo.*/MouseWheelLeft() 
        {
            if (_scrollData != null) 
            { 
                _scrollData.MouseWheelLeft(this);
            } 
        }

        /// <summary>
        /// <see cref="IScrollInfo.MouseWheelRight"/> 
        /// </summary>
        public void /*IScrollInfo.*/MouseWheelRight() 
        { 
            if (_scrollData != null)
            { 
                _scrollData.MouseWheelRight(this);
            }
        }
 
        /// <summary>
        /// <see cref="IScrollInfo.SetHorizontalOffset"/> 
        /// </summary> 
        public void /*IScrollInfo.*/SetHorizontalOffset(double offset)
        { 
            if (_scrollData != null)
            {
                _scrollData.SetHorizontalOffset(this, offset);
            } 
        }
 
        /// <summary> 
        /// <see cref="IScrollInfo.SetVerticalOffset"/>
        /// </summary> 
        public void /*IScrollInfo.*/SetVerticalOffset(double offset)
        {
            if (_scrollData != null)
            { 
                _scrollData.SetVerticalOffset(this, offset);
            } 
        } 

        /// <summary> 
        /// <see cref="IScrollInfo.MakeVisible"/>
        /// </summary>
        public  Rect /*IScrollInfo.*/MakeVisible(Visual visual, Rect rectangle)
        { 
            if (_scrollData == null)
            { 
                rectangle = Rect.Empty; 
            }
            else 
            {
                rectangle = _scrollData.MakeVisible(this, visual, rectangle);
            }
 
            return rectangle;
        } 
 
        /// <summary>
        /// <see cref="IScrollInfo.CanVerticallyScroll"/> 
        /// </summary>
        public boolean /*IScrollInfo.*/CanVerticallyScroll
        {
            get 
            {
                return (_scrollData != null) ? _scrollData.CanVerticallyScroll : false; 
            } 
            set
            { 
                if (_scrollData != null)
                {
                    _scrollData.CanVerticallyScroll = value;
                } 
            }
        } 
 
        /// <summary>
        /// <see cref="IScrollInfo.CanHorizontallyScroll"/> 
        /// </summary>
        public  boolean /*IScrollInfo.*/CanHorizontallyScroll
        {
            get 
            {
                return (_scrollData != null) ? _scrollData.CanHorizontallyScroll : false; 
            } 
            set
            { 
                if (_scrollData != null)
                {
                    _scrollData.CanHorizontallyScroll = value;
                } 
            }
        } 
 
        /// <summary>
        /// <see cref="IScrollInfo.ExtentWidth"/> 
        /// </summary>
        public  double /*IScrollInfo.*/ExtentWidth
        {
            get 
            {
                return (_scrollData != null) ? _scrollData.ExtentWidth : 0; 
            } 
        }
 
        /// <summary>
        /// <see cref="IScrollInfo.ExtentHeight"/>
        /// </summary>
        public  double /*IScrollInfo.*/ExtentHeight 
        {
            get 
            { 
                return (_scrollData != null) ? _scrollData.ExtentHeight : 0;
            } 
        }

        /// <summary>
        /// <see cref="IScrollInfo.ViewportWidth"/> 
        /// </summary>
        public  double /*IScrollInfo.*/ViewportWidth 
        { 
            get
            { 
                return (_scrollData != null) ? _scrollData.ViewportWidth : 0;
            }
        }
 
        /// <summary>
        /// <see cref="IScrollInfo.ViewportHeight"/> 
        /// </summary> 
        public   double /*IScrollInfo.*/ViewportHeight
        { 
            get
            {
                return (_scrollData != null) ? _scrollData.ViewportHeight : 0;
            } 
        }
 
        /// <summary> 
        /// <see cref="IScrollInfo.HorizontalOffset"/>
        /// </summary> 
        public  double /*IScrollInfo.*/HorizontalOffset
        {
            get
            { 
                return (_scrollData != null) ? _scrollData.HorizontalOffset : 0;
            } 
        } 

        /// <summary> 
        /// <see cref="IScrollInfo.VerticalOffset"/>
        /// </summary>
        public double /*IScrollInfo.*/VerticalOffset
        { 
            get
            { 
                return (_scrollData != null) ? _scrollData.VerticalOffset : 0; 
            }
        } 

        /// <summary>
        /// <see cref="IScrollInfo.ScrollOwner"/>
        /// </summary> 
        public  ScrollViewer /*IScrollInfo.*/ScrollOwner
        { 
            get 
            {
                return (_scrollData != null) ? _scrollData.ScrollOwner : null; 
            }

            set
            { 
                if (_scrollData == null)
                { 
                    // Create cached scroll info. 
                    _scrollData = new ScrollData();
                } 
                _scrollData.SetScrollOwner(this, value);
            }
        }
 
//        #endregion IScrollInfo Members
 
        //-------------------------------------------------------------------- 
        //
        //  IServiceProvider Members 
        //
        //-------------------------------------------------------------------

//        #region IServiceProvider Members 

        /// <summary> 
        /// Gets the service Object of the specified type. 
        /// </summary>
        /// <param name="serviceType"> 
        /// An Object that specifies the type of service Object to get.
        /// </param>
        /// <returns>
        /// A service Object of type serviceType. A null reference if there is no 
        /// service Object of type serviceType.
        /// </returns> 
        Object IServiceProvider.GetService(Type serviceType) 
        {
            Object service = null; 

            if (serviceType == typeof(ITextView))
            {
                if (_textView == null && _document != null) 
                {
                    _textView = new DocumentPageTextView(this, _document.StructuralCache.TextContainer); 
                } 
                service = _textView;
            } 
            else if (serviceType == typeof(ITextContainer))
            {
                if (Document != null)
                { 
                    service = Document.StructuralCache.TextContainer as TextContainer;
                } 
            } 

            return service; 
        }

//        #endregion IServiceProvider Members
    } 