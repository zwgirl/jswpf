/**
 * DependencyPropertyHelper
 */
/// <summary>
/// Helper class for miscellaneous framework-level features related 
/// to DependencyProperties.
/// </summary>
define(["dojo/_base/declare", "system/Type", "controls/HeaderedContentControl"], 
		function(declare, Type, HeaderedContentControl){
	var DependencyPropertyHelper = declare("DependencyPropertyHelper", HeaderedContentControl,{
		constructor:function(){
		}
	});
	

    /// <summary>
    /// Return the source of the value for the given property. 
    /// </summary> 
//    public static ValueSource 
	DependencyPropertyHelper.GetValueSource = function(/*DependencyObject*/ dependencyObject, /*DependencyProperty*/ dependencyProperty)
    { 
        if (dependencyObject == null)
            throw new ArgumentNullException("dependencyObject");
        if (dependencyProperty == null)
            throw new ArgumentNullException("dependencyProperty"); 

//        dependencyObject.VerifyAccess(); 

        var hasModifiers, isExpression, isAnimated, isCoerced, isCurrent;
        
        var hasModifiersOut={
        	"hasModifiers":hasModifiers 	
        };
        var isExpressionOut={
        	"isExpression":isExpression 	
        };
        var isAnimatedOut={
        	"isAnimated":isAnimated 	
        };
        var isCoercedOut={
        	"isCoerced":isCoerced 	
        };
        var isCurrentOut={
        	"isCurrent":isCurrent 	
        };
        
        /*BaseValueSourceInternal*/
        var source = dependencyObject.GetValueSource(dependencyProperty, null, 
        		/*out hasModifiers*/hasModifiersOut, /*out isExpression*/isExpressionOut, 
        		/*out isAnimated*/isAnimatedOut, /*out isCoerced*/isCoercedOut, /*out isCurrent*/isCurrentOut); 
        

        return new ValueSource(source, isExpressionOut.isExpression, isAnimatedOut.isAnimated, 
        		isCoercedOut.isCoerced, isCurrentOut.isCurrent);
    } 
	
    DependencyPropertyHelper.Type = new Type("DependencyPropertyHelper", DependencyPropertyHelper, [Object.Type]);
	return DependencyPropertyHelper;
});

