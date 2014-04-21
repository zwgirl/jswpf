/**
 * DefaultValueFactory
 */

define(["dojo/_base/declare"], function(declare){
	var DefaultValueFactory = declare("DefaultValueFactory", Object,{
		constructor:function( ){

		},
		CreateDefaultValue:function(/*DependencyObject*/ owner, /*DependencyProperty*/ property){
			 
		}		
		 
	});
	
	Object.defineProperties(DefaultValueFactory.prototype,{
		  
		DefaultValue:
		{
			get:function(){
				
			}
		}
	});
	
	DefaultValueFactory.Type = new Type("DefaultValueFactory", DefaultValueFactory, [Object.Type]);
	return DefaultValueFactory;
});

//internal abstract class DefaultValueFactory
//	{
//		internal abstract object DefaultValue
//		{
//			get;
//		}
//		internal abstract object CreateDefaultValue(DependencyObject owner, DependencyProperty property);
//		[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
//	protected DefaultValueFactory()
//	{
//	}
//}