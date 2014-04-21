package org.summer.view.widget;

/*internal*/public class EventTriggerSourceListener {
	/* internal */public EventTriggerSourceListener(EventTrigger trigger,
			FrameworkElement host) {
		_owningTrigger = trigger;
		_owningTriggerHost = host;
	}

	/* internal */public void Handler(Object sender, RoutedEventArgs e) {
		// Invoke all actions of the associated EventTrigger object.
		TriggerActionCollection actions = _owningTrigger.Actions;
		for (int j = 0; j < actions.Count; j++) {
			actions[j].Invoke(_owningTriggerHost);
		}
	}

	private EventTrigger _owningTrigger;
	private FrameworkElement _owningTriggerHost;
}