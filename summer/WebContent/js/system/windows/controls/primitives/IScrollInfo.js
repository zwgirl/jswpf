/**
 * IScrollInfo
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var IScrollInfo = declare("IScrollInfo", Object,{
		constructor:function(){
			
		}
	
//		void LineUp();
//		void LineDown();
//		void LineLeft();
//		void LineRight();
//		void PageUp();
//		void PageDown();
//		void PageLeft();
//		void PageRight();
//		void MouseWheelUp();
//		void MouseWheelDown();
//		void MouseWheelLeft();
//		void MouseWheelRight();
//		void SetHorizontalOffset(double offset);
//		void SetVerticalOffset(double offset);
//		Rect MakeVisible(Visual visual, Rect rectangle);
	});
	
	Object.defineProperties(IScrollInfo.prototype,{
//		bool CanVerticallyScroll
//		{
//			get;
//			set;
//		}
//		bool CanHorizontallyScroll
//		{
//			get;
//			set;
//		}
//		double ExtentWidth
//		{
//			get;
//		}
//		double ExtentHeight
//		{
//			get;
//		}
//		double ViewportWidth
//		{
//			get;
//		}
//		double ViewportHeight
//		{
//			get;
//		}
//		double HorizontalOffset
//		{
//			get;
//		}
//		double VerticalOffset
//		{
//			get;
//		}
//		ScrollViewer ScrollOwner
//		{
//			get;
//			set;
//		}  
	});
	
	
	IScrollInfo.Type = new Type("IScrollInfo", IScrollInfo, [Object.Type], true);
	return IScrollInfo;
});
