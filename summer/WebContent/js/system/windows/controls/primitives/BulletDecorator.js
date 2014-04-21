/**
 * BulletDecorator
 */
/// <summary>
///     BulletDecorator is used for decorating a generic content of type UIElement. 
/// Usually, the content is a text and the bullet is a glyph representing
/// something similar to a checkbox or a radiobutton. 
/// Bullet property is used to decorate the content by aligning itself with the first line of the content text. 
/// </summary>
define(["dojo/_base/declare", "system/Type", "controls/Decorator", "media/VisualTreeHelper", "collections/IEnumerator",
        "controls/TextBlock", "windows/FrameworkPropertyMetadataOptions", "controls/Panel",
        "windows/FrameworkPropertyMetadata", "controls/ContentPresenter", "controls/TextBlock"], 
		function(declare, Type, Decorator, VisualTreeHelper, IEnumerator,
				TextBlock, FrameworkPropertyMetadataOptions, Panel,
				FrameworkPropertyMetadata, ContentPresenter, TextBlock){
	
//	private class 
	var DoubleChildEnumerator = declare(IEnumerator,  
    { 
        constructor:function(/*object*/ child1, /*object*/ child2)
        { 
//            Debug.Assert(child1 != null, "First child should be non-null.");
//            Debug.Assert(child2 != null, "Second child should be non-null.");

            this._child1 = child1; 
            this._child2 = child2;
        }, 
//        bool IEnumerator.
        MoveNext:function() 
        { 
        	this._index++;
            return this._index < 2; 
        },

//        void IEnumerator.
        Reset:function()
        { 
        	this._index = -1;
        } 

//        private int _index = -1;
//        private object _child1; 
//        private object _child2;
    });
	
	Object.defineProperties(DoubleChildEnumerator.prototype, {
//        object IEnumerator.
		Current:
        { 
            get:function()
            {
                switch (this._index)
                { 
                    case 0:
                        return this._child1; 
                    case 1: 
                        return this._child2;
                    default: 
                        return null;
                }
            }
        } 
	});
	
	var BulletDecorator = declare("BulletDecorator", Decorator,{
		constructor:function(){
//	        UIElement 
			this._bullet = null; 
		},

        /// <summary> 
        /// Override from UIElement
        /// </summary> 
//        protected override void 
		OnRender:function(/*DrawingContext*/ dc) 
        {
            // Draw background in rectangle inside border. 
            var background = this.Background;
            if (background != null)
            {
                dc.DrawRectangle(background, 
                                 null,
                                 new Rect(0, 0, RenderSize.Width, RenderSize.Height)); 
            } 
        },
      /// <summary> 
        /// Returns the child at the specified index.
        /// </summary>
//        protected override Visual 
        GetVisualChild:function(/*int*/ index)
        { 
            if (index < 0 || index > this.VisualChildrenCount-1)
            { 
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)); 
            }
 
            if (index == 0 && this._bullet != null)
            {
                return this._bullet;
            } 

            return this.Child; 
        },
        /// <summary>
        /// Updates DesiredSize of the BulletDecorator. Called by parent UIElement. 
        /// This is the first pass of layout.
        /// </summary>
        /// <param name="constraint">Constraint size is an "upper limit" that BulletDecorator should not exceed.</param>
        /// <returns>BulletDecorator' desired size.</returns> 
//        protected override Size 
        MeasureOverride:function(/*Size*/ constraint)
        { 
                var bulletSize = new Size(); 
                var contentSize = new Size();
                var bullet = this.Bullet; 
                var content = this.Child;

                // If we have bullet we should measure it first
                if (bullet != null) 
                {
                    bullet.Measure(constraint); 
                    bulletSize = bullet.DesiredSize; 
                }
 
                // If we have second child (content) we should measure it
                if (content != null)
                {
                    var contentConstraint = constraint; 
                    contentConstraint.Width = Math.Max(0.0, contentConstraint.Width - bulletSize.Width);
 
                    content.Measure(contentConstraint); 
                    contentSize = content.DesiredSize;
                } 

                var desiredSize = new Size(bulletSize.Width + contentSize.Width, Math.max(bulletSize.Height, contentSize.Height));
                return desiredSize;
 
        },
 
        /// <summary> 
        /// BulletDecorator arranges its children - Bullet and Child.
        /// Bullet is aligned vertically with the center of the content's first line 
        /// </summary>
        /// <param name="arrangeSize">Size that BulletDecorator will assume to position children.</param>
//        protected override Size 
        ArrangeOverride:function(/*Size*/ arrangeSize)
        { 
                var bullet = this.Bullet;
                var content = this.Child; 
                var contentOffsetX = 0; 

                var bulletOffsetY = 0; 

                var bulletSize = new Size();

                // Arrange the bullet if exist 
                if (bullet != null)
                { 
                    bullet.Arrange(new Rect(bullet.DesiredSize)); 
                    bulletSize = bullet.RenderSize;
 
                    contentOffsetX = bulletSize.Width;
                }

                // Arrange the content if exist 
                if (content != null)
                { 
                    // Helper arranges child and may substitute a child's explicit properties for its DesiredSize. 
                    // The actual size the child takes up is stored in its RenderSize.
                	var contentSize = arrangeSize; 
                    if (bullet != null)
                    {
                        contentSize.Width = Math.Max(content.DesiredSize.Width, arrangeSize.Width - bullet.DesiredSize.Width);
                        contentSize.Height = Math.Max(content.DesiredSize.Height, arrangeSize.Height); 
                    }
                    content.Arrange(new Rect(contentOffsetX, 0, contentSize.Width, contentSize.Height)); 
 
                    var centerY = GetFirstLineHeight(content) * 0.5d;
                    bulletOffsetY += Math.Max(0d, centerY - bulletSize.Height * 0.5d); 
                }

                // Re-Position the bullet if exist
                if (bullet != null && !DoubleUtil.IsZero(bulletOffsetY)) 
                {
                    bullet.Arrange(new Rect(0, bulletOffsetY, bullet.DesiredSize.Width, bullet.DesiredSize.Height)); 
                } 

                return arrangeSize; 
        },
     // This method calculates the height of the first line if the element is TextBlock or FlowDocumentScrollViewer 
        // Otherwise returns the element height
//        private double 
        GetFirstLineHeight:function(/*UIElement*/ element) 
        { 
            // We need to find TextBlock/FlowDocumentScrollViewer if it is nested inside ContentPresenter
            // Common scenario when used in styles is that BulletDecorator content is a ContentPresenter 
            var text = FindText(element);
            /*ReadOnlyCollection<LineResult>*/var lr = null;
            if (text != null)
            { 
                /*TextBlock*/var textElement = text;
                if (textElement.IsLayoutDataValid) 
                    lr = textElement.GetLineResults(); 
            }
            else 
            {
                text = FindFlowDocumentScrollViewer(element);
                if (text != null)
                { 
                    /*TextDocumentView*/var tdv = text.GetService(ITextView.Type);
                    tdv = tdv instanceof TextDocumentView ? tdv : null;
                    if (tdv != null && tdv.IsValid) 
                    { 
                        /*ReadOnlyCollection<ColumnResult>*/var cr = tdv.Columns;
                        if (cr != null && cr.Count > 0) 
                        {
                            /*ColumnResult*/var columnResult = cr[0];
                            /*ReadOnlyCollection<ParagraphResult>*/var pr = columnResult.Paragraphs;
                            if (pr != null && pr.Count > 0) 
                            {
                                /*ContainerParagraphResult*/var cpr = pr[0];
                                cpr = cpr instanceof ContainerParagraphResult ? cpr : null; 
                                if (cpr != null) 
                                {
                                    var textParagraphResult = cpr.Paragraphs[0];
                                    textParagraphResult = textParagraphResult instanceof TextParagraphResult ? textParagraphResult : null; 
                                    if (textParagraphResult != null)
                                    {
                                        lr = textParagraphResult.Lines;
                                    } 
                                }
                            } 
                        } 
                    }
                } 
            }

            if (lr != null && lr.Count > 0)
            { 
                var ancestorOffset = new Point();
                text.TransformToAncestor(element).TryTransform(ancestorOffset, /*out ancestorOffset*/ancestorOffsetOut); 
                return lr[0].LayoutBox.Height + ancestorOffset.Y * 2d; 
            }
 
            return element.RenderSize.Height;
        },

//        private TextBlock 
        FindText:function(/*Visual*/ root) 
        {
            // Cases where the root is itself a TextBlock 
            var text = root instanceof TextBlock ? root : null; 
            if (text != null)
                return text; 

            var cp = root instanceof ContentPresenter ? root : null;
            if (cp != null)
            { 
                if (VisualTreeHelper.GetChildrenCount(cp) == 1)
                { 
                    var child = VisualTreeHelper.GetChild(cp, 0); 

                    // Cases where the child is a TextBlock 
                    var textBlock = child instanceof TextBlock ? child : null;
                    if (textBlock == null)
                    {
                        var accessText = child instanceof AccessText ? child : null; 
                        if (accessText != null &&
                            VisualTreeHelper.GetChildrenCount(accessText) == 1) 
                        { 
                            // Cases where the child is an AccessText whose child is a TextBlock
                            textBlock = VisualTreeHelper.GetChild(accessText, 0);
                            textBlock = textBlock instanceof TextBlock ? textBlock : null; 
                        }
                    }
                    return textBlock;
                } 
            }
            else 
            { 
                var accessText = root instanceof AccessText ? root : null;
                if (accessText != null && 
                    VisualTreeHelper.GetChildrenCount(accessText) == 1)
                {
                    // Cases where the root is an AccessText whose child is a TextBlock
                    var result = VisualTreeHelper.GetChild(accessText, 0);
                    result = result instanceof TextBlock ? result : null; 
                    return result;
                }
            } 
            return null; 
        },
 
//        private FlowDocumentScrollViewer 
        FindFlowDocumentScrollViewer:function(/*Visual*/ root)
        {
            var text = root instanceof FlowDocumentScrollViewer ? root : null;
            if (text != null) 
                return text;
 
            var cp = root instanceof ContentPresenter ? root : null; 
            if (cp != null)
            { 
                if(VisualTreeHelper.GetChildrenCount(cp) == 1){
                    var result = VisualTreeHelper.GetChild(cp, 0);
                	result = result instanceof FlowDocumentScrollViewer ? result : null;
                	return result;
                }
            }
            return null; 
        }

	});
	
	Object.defineProperties(BulletDecorator.prototype,{
		/// <summary> 
        /// The Background property defines the brush used to fill the area within the BulletDecorator.
        /// </summary> 
//        public Brush 
        Background: 
        {
            get:function() { return this.GetValue(BulletDecorator.BackgroundProperty); },
            set:function(value) { this.SetValue(BulletDecorator.BackgroundProperty, value); }
        },

        /// <summary> 
        /// Bullet property is the first visual element in BulletDecorator visual tree.
        /// It should be aligned to BulletDecorator.Child which is the second visual child. 
        /// </summary> 
        /// <value></value>
//        public UIElement 
        Bullet: 
        {
            get:function()
            {
                return this._bullet; 
            },
            set:function(value) 
            { 
                if (this._bullet != value)
                { 
                    if (this._bullet != null)
                    {
                        // notify the visual layer that the old bullet has been removed.
                    	this.RemoveVisualChild(this._bullet); 

                        //need to remove old element from logical tree 
                    	this.RemoveLogicalChild(this._bullet); 
                    }
 
                    this._bullet = value;

                    this.AddLogicalChild(value);
                    // notify the visual layer about the new child. 
                    this.AddVisualChild(value);
 
                    // If we decorator content exists we need to move it at the end of the visual tree 
                    var child = this.Child;
                    if (child != null) 
                    {
                    	this.RemoveVisualChild(child);
                    	this.AddVisualChild(child);
                    } 

                    this.InvalidateMeasure(); 
                } 
            }
        },
        /// <summary>
        /// Returns the Visual children count.
        /// </summary>
//        protected override int 
        VisualChildrenCount: 
        {
            get:function() { return (this.Child == null ? 0 : 1) + (this._bullet == null ? 0 : 1); } 
        } 
		  
	});
	
	Object.defineProperties(BulletDecorator,{
	     /// <summary> 
        /// DependencyProperty for <see cref="Background" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
		BackgroundProperty:
        {
        	get:function(){
        		if(RangeBase._BackgroundProperty === undefined){
        			RangeBase._BackgroundProperty = 
                        Panel.BackgroundProperty.AddOwner(BulletDecorator.Type,
                                /*new FrameworkPropertyMetadata( 
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsRender)*/
                        		FrameworkPropertyMetadata.Build2( 
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsRender));
        		}
        		
        		return RangeBase._BackgroundProperty;
        	}
        }  
	});
	
	BulletDecorator.Type = new Type("BulletDecorator", BulletDecorator, [Decorator.Type]);
	return BulletDecorator;
});



