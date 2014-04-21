package org.summer.view.widget.controls;

public enum PanningMode {
	Both, // 垂直滚动 ScrollViewer 级别和。
	HorizontalFirst, // ScrollViewer 滚动，当用户首先水平移动手指。 如果用户垂直移动第一个，该移动处理鼠标事件。 在
						// ScrollViewer 开始移动后，它将水平和垂直滚动。
	HorizontalOnly, // 仅 ScrollViewer 水平滚动。
	None, // ScrollViewer 不响应触控输入。
	VerticalFirst, // ScrollViewer 滚动，当用户垂直首先移动手指。 如果用户水平移动第一个，该移动处理鼠标事件。 在
					// ScrollViewer 开始移动后，它将水平和垂直滚动。
	VerticalOnly, // ScrollViewer 垂直滚动只。
}