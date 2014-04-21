package org.summer.view.widget.collection;
public interface IEnumerator<T>
{
	T Current { get; }

	boolean MoveNext ();

	void Reset ();
}