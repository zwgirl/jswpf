package org.summer.view.widget.media;

public enum Stretch {
	None, // 内容保持其原始大小。
	Fill, // 调整内容的大小以填充目标尺寸。 不保留纵横比。
	Uniform, // 在保留内容原有纵横比的同时调整内容的大小，以适合目标尺寸。
	UniformToFill, // 在保留内容原有纵横比的同时调整内容的大小，以填充目标尺寸。
					// 如果目标矩形的纵横比不同于源矩形的纵横比，则对源内容进行剪裁以适合目标尺寸。
}