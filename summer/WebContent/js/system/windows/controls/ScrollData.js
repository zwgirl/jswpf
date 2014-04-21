/**
 * ScrollData
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ScrollData = declare("ScrollData", null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(ScrollData.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	ScrollData.Type = new Type("ScrollData", ScrollData, [Object.Type]);
	return ScrollData;
});

// Helper class to hold scrolling data. 
        // This class exists to reduce working set when StackPanel is used outside a scrolling situation.
        // Standard "extra pointer always for less data sometimes" cache savings model: 
        //      !Scroll [1xReference]
        //      Scroll  [1xReference] + [6xDouble + 1xReference]
        private class ScrollData: IStackMeasureScrollData
        { 
            // Clears layout generated data.
            // Does not clear scrollOwner, because unless resetting due to a scrollOwner change, we won't get reattached. 
            internal void ClearLayout() 
            {
                _offset = new Vector(); 
                _viewport = _extent = new Size();
                _physicalViewport = 0;
            }
 
            // For Stack/Flow, the two dimensions of properties are in different units:
            // 1. The "logically scrolling" dimension uses items as units. 
            // 2. The other dimension physically scrolls.  Units are in Avalon pixels (1/96"). 
            internal bool _allowHorizontal;
            internal bool _allowVertical; 
            internal Vector _offset;            // Scroll offset of content.  Positive corresponds to a visually upward offset.
            internal Vector _computedOffset = new Vector(0,0);
            internal Size _viewport;            // ViewportSize is in {pixels x items} (or vice-versa).
            internal Size _extent;              // Extent is the total number of children (logical dimension) or physical size 
            internal double _physicalViewport;  // The physical size of the viewport for the items dimension above.
            internal ScrollViewer _scrollOwner; // ScrollViewer to which we're attached. 
 
            public Vector Offset
            { 
                get
                {
                    return _offset;
                } 
                set
                { 
                    _offset = value; 
                }
            } 

            public Size Viewport
            {
                get 
                {
                    return _viewport; 
                } 
                set
                { 
                    _viewport = value;
                }
            }
 
            public Size Extent
            { 
                get 
                {
                    return _extent; 
                }
                set
                {
                    _extent = value; 
                }
            } 
 
            public Vector ComputedOffset
            { 
                get
                {
                    return _computedOffset;
                } 
                set
                { 
                    _computedOffset = value; 
                }
            } 

            public void SetPhysicalViewport(double value)
            {
                _physicalViewport = value; 
            }
        } 