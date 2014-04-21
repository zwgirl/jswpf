/**
 * IContentHost
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var IContentHost = declare("IContentHost", null,{
//		IInputElement 
		InputHitTest:function(/*Point*/ point){},
//		ReadOnlyCollection<Rect> 
		GetRectangles:function(/*ContentElement*/ child){},
//		void 
		OnChildDesiredSizeChanged:function(/*UIElement*/ child){}
	});
	
	Object.defineProperties(IContentHost.prototype, {
//		IEnumerator<IInputElement> 
		HostedElements:
		{
			get:function(){}
		}
	});
	
	IContentHost.Type = new Type("IContentHost", IContentHost, [Object.Type]);
	return IContentHost;
});
