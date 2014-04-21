package org.summer.view.widget.model;
public interface IDataErrorInfo
	{
		String Error { get; }

		String this[String columnName] { get; }
	}