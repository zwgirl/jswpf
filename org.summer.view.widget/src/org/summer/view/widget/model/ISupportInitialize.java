package org.summer.view.widget.model;
/// <summary>
/// Specifies that this object supports a simple, transacted notification for batch initialization.
/// </summary>
public interface ISupportInitialize
{
	void BeginInit ();

	void EndInit ();
}