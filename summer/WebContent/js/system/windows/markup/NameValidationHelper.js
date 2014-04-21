
/**
 * NameValidationHelper
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var NameValidationHelper = declare("NameValidationHelper", null,{
	});
	
//	internal static bool 
	NameValidationHelper.NameValidationCallback = function(/*object*/ candidateName)
	{
		var text = typeof candidateName == 'string';
		if (text != null)
		{
			return NameValidationHelper.IsValidIdentifierName(text);
		}
		return candidateName == null;
	};
	
//	internal static bool 
	NameValidationHelper.IsValidIdentifierName = function(/*string*/ name)
	{
//		for (var i = 0; i < name.Length; i++)
//		{
//			UnicodeCategory unicodeCategory = char.GetUnicodeCategory(name[i]);
//			bool flag = unicodeCategory == UnicodeCategory.UppercaseLetter || unicodeCategory == UnicodeCategory.LowercaseLetter || unicodeCategory == UnicodeCategory.TitlecaseLetter || unicodeCategory == UnicodeCategory.OtherLetter || unicodeCategory == UnicodeCategory.LetterNumber || name[i] == '_';
//			bool flag2 = unicodeCategory == UnicodeCategory.NonSpacingMark || unicodeCategory == UnicodeCategory.SpacingCombiningMark || unicodeCategory == UnicodeCategory.ModifierLetter || unicodeCategory == UnicodeCategory.DecimalDigitNumber;
//			if (i == 0)
//			{
//				if (!flag)
//				{
//					return false;
//				}
//			}
//			else
//			{
//				if (!flag && !flag2)
//				{
//					return false;
//				}
//			}
//		}
		return true;
	};
	
	NameValidationHelper.Type = new Type("NameValidationHelper", NameValidationHelper, [Object.Type]);
	return NameValidationHelper;
});

