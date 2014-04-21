/**
 * FlowDocumentView
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement"], 
		function(declare, Type, FrameworkElement){
	var FlowDocumentView = declare("FlowDocumentView", FrameworkElement,{
		constructor:function(){
			
			this._dom = window.document.createElement('div');
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			
		},
	       /// <summary> 
        /// Content measurement.
        /// </summary>
        /// <param name="constraint">Constraint size.</param>
        /// <returns>Computed desired size.</returns> 
//        protected sealed override Size
		MeasureOverride:function()
        { 
           	

        }, 

        /// <summary> 
        /// Content arrangement.
        /// </summary>
        /// <param name="arrangeSize">Size that element should use to arrange itself and its children.</param>
//        protected sealed override Size 
		ArrangeOverride:function() 
        {
			if (this.Document != null){
				this.Document.Arrange(this._dom);
				this._dom.appendChild(this.Document._dom);
			}
			
//			parent.appendChild(this._dom);
        },

        /// <summary>
        /// Returns visual child at specified index. FlowDocumentView has just one child. 
        /// </summary>
//        protected override Visual 
        GetVisualChild:function(/*int*/ index) 
        { 
            if (index != 0)
            { 
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange));
            }
            return _pageVisual;
        } 
	});
	
	Object.defineProperties(FlowDocumentView.prototype,{
	     /// <summary> 
        /// Returns number of children. FlowDocumentView has just one child.
        /// </summary> 
//        protected override int 
		VisualChildrenCount:
        {
            get:function()
            { 
                return 0;
            } 
        },
        

        /// <summary> 
        /// BreakRecordTable.
        /// </summary>
//        internal FlowDocument 
        Document:
        { 
            get:function()
            { 
                return this._document; 
            },
            set:function(value) 
            {
                this._document = value;
            }
        }
	});
	
	FlowDocumentView.Type = new Type("FlowDocumentView", FlowDocumentView, [FrameworkElement.Type]);
	return FlowDocumentView;
});

