package org.summer.view.widget.media;
//[Flags]
	/*internal*/ public enum VisualProxyFlags //: uint
	{
		None ,//= 0u,
		IsSubtreeDirtyForRender ,//= 1u,
		IsTransformDirty ,//= 2u,
		IsClipDirty ,//= 4u,
		IsContentDirty ,//= 8u,
		IsOpacityDirty ,//= 16u,
		IsOpacityMaskDirty ,//= 32u,
		IsOffsetDirty ,//= 64u,
		IsClearTypeHintDirty ,//= 128u,
		IsGuidelineCollectionDirty ,//= 256u,
		IsEdgeModeDirty ,//= 512u,
		IsContentConnected ,//= 1024u,
		IsContentNodeConnected ,//= 2048u,
		IsConnectedToParent ,//= 4096u,
		Viewport3DVisual_IsCameraDirty ,//= 8192u,
		Viewport3DVisual_IsViewportDirty ,//= 16384u,
		IsBitmapScalingModeDirty ,//= 32768u,
		IsDeleteResourceInProgress ,//= 65536u,
		IsChildrenZOrderDirty ,//= 131072u,
		IsEffectDirty ,//= 262144u,
		IsCacheModeDirty ,//= 524288u,
		IsScrollableAreaClipDirty ,//= 1048576u,
		IsTextRenderingModeDirty ,//= 2097152u,
		IsTextHintingModeDirty ,//= 4194304u
	}