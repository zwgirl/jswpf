package org.summer.view.widget.xaml;

import org.summer.view.widget.collection.IEnumerable;

public interface IAmbientProvider {
	IEnumerable<Object> GetAllAmbientValues(/* params */XamlType[] types);

	IEnumerable<AmbientPropertyValue> GetAllAmbientValues(
			IEnumerable<XamlType> ceilingTypes, /* params */
			XamlMember[] properties);

	IEnumerable<AmbientPropertyValue> GetAllAmbientValues(
			IEnumerable<XamlType> ceilingTypes, boolean searchLiveStackOnly,
			IEnumerable<XamlType> types, /* params */XamlMember[] properties);

	Object GetFirstAmbientValue(/* params */XamlType[] types);

	AmbientPropertyValue GetFirstAmbientValue(
			IEnumerable<XamlType> ceilingTypes, /* params */
			XamlMember[] properties);
}