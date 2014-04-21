define("",["dojo/_base/declare"], function(declare){
	var DependencyPropertyHelper = {
		//public static ValueSource GetValueSource(DependencyObject dependencyObject, DependencyProperty dependencyProperty)
		GetValueSource:function(dependencyObject,dependencyProperty) { 
	        if (dependencyObject == null)
	            throw new Error("dependencyObject");
	        if (dependencyProperty == null)
	            throw new Error("dependencyProperty"); 
	
	        dependencyObject.VerifyAccess(); 
	
	        /*boolean*/ var hasModifiers, isExpression, isAnimated, isCoerced, isCurrent;
	        /*BaseValueSourceInternal*/var source = dependencyObject.GetValueSource(dependencyProperty, null, hasModifiers, isExpression, isAnimated, isCoerced, isCurrent); 
	
	        return new ValueSource(source, isExpression, isAnimated, isCoerced, isCurrent);
	    }
	};
	return DependencyPropertyHelper;	
}); 