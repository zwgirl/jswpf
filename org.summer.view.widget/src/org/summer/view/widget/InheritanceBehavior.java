package org.summer.view.widget;

public enum InheritanceBehavior {
	/**
	 * Property value inheritance lookup will query the current element and continue walking up the element tree to the page root. 
	 * Resource lookup will query through the current element and further.
	 */
	Default, 
	
	/**
	 * Property value inheritance lookup will query the current element but not any further.
	 * Resource lookup will query the current element but not any further.
	 */
	SkipAllNext, 
	
	/**
	 * Property value inheritance lookup will not query the current  element or any further.
	 *  Resource lookup will not query the current element or any further.
	 */
	SkipAllNow, 
	
	/**
	 * Property value inheritance lookup will query the current element but not any further.
	 * Resource lookup will query the current element and will then skip over to the application and theme dictionaries, rather than walking 
	 * up the element tree toward the page root.
	 */
	SkipToAppNext, 
	
	/**
	 * Property value inheritance lookup will not query the current element or any further.
	 * Resource lookup will not query the current element but will skip over to the application and then the theme dictionaries, 
	 * rather than walking up the element tree toward the page root.walking up the element tree toward the page root.
	 */
	SkipToAppNow, 
	
	/**
	 * Property value inheritance lookup will query the current element but not any further.
	 * Resource lookup will query the current element and will then skip over to
	 * the theme dictionaries, rather than walking up the element tree toward the page root, or checking
	 * application dictionaries.
	 */
	SkipToThemeNext, 
	
	/**
	 * Property value inheritance lookup will not query the current element or any further.
	 * Resource lookup will not query the current element but will skip over to the theme
	 * dictionaries, rather than walking up the element tree toward the page root, or checking application dictionaries.
	 */
	SkipToThemeNow, 
}