package org.summer.view.window;

public enum TextDecorationUnit {

	/**
	 * Default. A unit value that is relative to the font used for the
	 * TextDecoration. If the decoration spans multiple fonts, an average
	 * recommended value is calculated.
	 */
	FontRecommended, //

	/**
	 * A unit value that is relative to the em size of the font. The value of
	 * the offset or thickness is equal to the offset or thickness value
	 * multiplied by the font em size.
	 */
	FontRenderingEmSize, //

	/**
	 * A unit value that is expressed in pixels.
	 */
	Pixel, //
}