package org.summer.view.widget;

public enum RoutingStrategy {
	Tunnel,	//The routed event uses a tunneling strategy, where the event instance routes downwards through the tree, from root to source element.
	Bubble,	//The routed event uses a bubbling strategy, where the event instance routes upwards through the tree, from event source to root.
	Direct	//The routed event does not route through an element tree, but does support other routed event capabilities such as class handling, EventTrigger or EventSetter.
}
