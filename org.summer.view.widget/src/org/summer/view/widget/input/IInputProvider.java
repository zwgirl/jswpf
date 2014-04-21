package org.summer.view.widget.input;

import org.summer.view.widget.media.Visual;

interface IInputProvider {
	boolean ProvidesInputForRootVisual(Visual v);

	void NotifyDeactivate();
}