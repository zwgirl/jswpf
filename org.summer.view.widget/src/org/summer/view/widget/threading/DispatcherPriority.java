package org.summer.view.widget.threading;
public enum DispatcherPriority
	{
		Invalid ,//= -1,
		Inactive,
		SystemIdle,
		ApplicationIdle,
		ContextIdle,
		Background,
		Input,
		Loaded,
		Render,
		DataBind,
		Normal,
		Send
	}