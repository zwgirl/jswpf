package org.summer.view.widget.xaml;
/*internal*/public enum XamlWriteState
{
	Initial,
	ObjectStarted,
	MemberStarted,
	ObjectWritten,
	ValueWritten,
	MemberDone,
	End
}