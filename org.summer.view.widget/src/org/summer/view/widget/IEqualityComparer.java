package org.summer.view.widget;

public interface IEqualityComparer<T> {
	
	boolean Equals(T x, T y);
	int GetHashCode(T x);
}
