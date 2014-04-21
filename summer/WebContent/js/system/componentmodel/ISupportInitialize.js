/**
 * ISupportInitialize
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ISupportInitialize = declare("ISupportInitialize", null,{
//		void 
		BeginInit:function(){
			
		},
//		void 
		EndInit:function(){
			
		}
	});
	
	ISupportInitialize.Type = new Type("ISupportInitialize", ISupportInitialize, [Object.Type]);
	return ISupportInitialize;
});

//using System;
//namespace System.ComponentModel
//{
//	[SRDescription("ISupportInitializeDescr")]
//	public interface ISupportInitialize
//	{
//		void BeginInit();
//		void EndInit();
//	}
//}
