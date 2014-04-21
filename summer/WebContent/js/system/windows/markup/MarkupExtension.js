
/**
 * MarkupExpression
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var MarkupExpression = declare("MarkupExpression", Object,{
		constructor:function(){

		},
		ProvideValue:function(serviceProvider){
			
		}
	});

	MarkupExpression.Type = new Type("MarkupExpression", MarkupExpression, [Object.Type]);
	return MarkupExpression;
});

//[TypeForwardedFrom("WindowsBase, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35")]
//public abstract class MarkupExtension
//{
//	public abstract object ProvideValue(IServiceProvider serviceProvider);
//	[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
//	protected MarkupExtension()
//	{
//	}
//}