package org.summer.view.widget.media;

import org.summer.view.widget.IDisposable;

interface ICompositionTarget extends IDisposable {
	void Render(boolean inResize, DUCE.Channel channel);

	void AddRefOnChannel(DUCE.Channel channel, DUCE.Channel outOfBandChannel);

	void ReleaseOnChannel(DUCE.Channel channel, DUCE.Channel outOfBandChannel);
}