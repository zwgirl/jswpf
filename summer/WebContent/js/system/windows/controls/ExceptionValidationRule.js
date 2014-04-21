/**
 * ExceptionValidationRule
 */

define(["dojo/_base/declare", "system/Type", "controls/ValidationRule", "controls/ValidationResult"], 
		function(declare, Type, ValidationRule, ValidationResult){
	var ExceptionValidationRule = declare("ExceptionValidationRule", ValidationRule,{
		constructor:function(){
			ValidationRule.prototype.constructor.call(this);
		},
        /// <summary> 
        /// Validate is called when Data binding is updating 
        /// </summary>
//        public override ValidationResult 
        Validate:function(/*object*/ value, /*CultureInfo*/ cultureInfo) 
        {
            return ValidationResult.ValidResult;
        }
	});
	
	Object.defineProperties(ExceptionValidationRule, {
//	    internal static readonly ExceptionValidationRule 
		Instance:
		{
			get:function(){
				if(ExceptionValidationRule._instance === undefined){
					ExceptionValidationRule._instance = new ExceptionValidationRule();
				}
				
				return ExceptionValidationRule._instance;
			}
		}
	
	});
	
	ExceptionValidationRule.Type = new Type("ExceptionValidationRule", ExceptionValidationRule, [ValidationRule.Type]);

	return ExceptionValidationRule;
});

////---------------------------------------------------------------------------- 
////
//// <copyright file="ExceptionValidationRule.cs" company="Microsoft">
////    Copyright (C) 2003 by Microsoft Corporation.  All rights reserved.
//// </copyright> 
////
//// 
//// Description: 
////      ExceptionValidationRule is used when a ValidationError is the result of an Exception as
////      there is no actual ValidationRule. 
////
////
//// See specs at http://avalon/connecteddata/M5%20Specs/Validation.mht
//// 
//// History:
////  1/12/2005       mharper: created. 
//// 
////---------------------------------------------------------------------------
// 
//
//using System;
//using System.Windows;
//using System.Globalization; 
//using System.Windows.Controls;
// 
//namespace System.Windows.Controls 
//{
//    /// <summary> 
//    ///     ExceptionValidationRule can be added to the ValidationRulesCollection of a Binding
//    ///     or MultiBinding to indicate that Exceptions that occur during UpdateSource should
//    ///     be considered ValidationErrors
//    /// </summary> 
//    public sealed class ExceptionValidationRule : ValidationRule
//    { 
// 
//        /// <summary>
//        /// ExceptionValidationRule ctor. 
//        /// </summary>
//        public ExceptionValidationRule()
//        {
//        } 
//
//        /// <summary> 
//        /// Validate is called when Data binding is updating 
//        /// </summary>
//        public override ValidationResult Validate(object value, CultureInfo cultureInfo) 
//        {
//            return ValidationResult.ValidResult;
//        }
// 
//        internal static readonly ExceptionValidationRule Instance = new ExceptionValidationRule();
//    } 
//} 
