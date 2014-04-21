package org.summer.view.widget.data;

import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.Type;

public interface IMultiValueConverter {
	Object Convert(Object[] values, Type targetType, Object parameter,
			CultureInfo culture);

	Object[] ConvertBack(Object value, Type[] targetTypes, Object parameter,
			CultureInfo culture);
}
