package org.summer.view.widget;
//SerializableAttribute 
//ComVisibleAttribute(true) 
public enum StringComparison {
	CurrentCulture,//	使用区域敏感排序规则和当前区域比较字符串。 
	CurrentCultureIgnoreCase,//	使用区域敏感排序规则、当前区域来比较字符串，同时忽略被比较字符串的大小写。 
	InvariantCulture,//	使用区域敏感排序规则和固定区域比较字符串。 
	InvariantCultureIgnoreCase,//	使用区域敏感排序规则、固定区域来比较字符串，同时忽略被比较字符串的大小写。 
	Ordinal,//	使用序号排序规则比较字符串。 
	OrdinalIgnoreCase,//	使用序号排序规则并忽略被比较字符串的大小写，对字符串进行比较。 	
}