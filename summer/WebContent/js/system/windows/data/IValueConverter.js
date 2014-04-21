/**
 * IValueConverter
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var IValueConverter = declare("IValueConverter", Object,{
	});
	
	IValueConverter.Type = new Type("IValueConverter", IValueConverter, [Object.Type]);
	return IValueConverter;
});
//public interface IValueConverter
//	{
//		object Convert(object value, Type targetType, object parameter, CultureInfo culture);
//		object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture);
//	}