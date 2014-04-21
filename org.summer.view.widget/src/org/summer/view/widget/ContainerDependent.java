package org.summer.view.widget;

//
//  Each item in the ContainerDependents list is of this type. Stores the DP on 
//  the container that is dependent upon this style and whether that dp was set 
//  via Style.SetValue or TriggerBase.SetValue.
// 
/*internal*/public class ContainerDependent {
	/* internal */public DependencyProperty Property;
	/* internal */public boolean FromVisualTrigger;
}