package org.summer.view.widget.data;

import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.Type;

public interface IValueConverter {
	Object Convert(Object value, Type targetType, Object parameter, CultureInfo culture);

	Object ConvertBack(Object value, Type sourceType, Object parameter, CultureInfo culture) ;
}