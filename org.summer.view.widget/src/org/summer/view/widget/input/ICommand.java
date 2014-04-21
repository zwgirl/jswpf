package org.summer.view.widget.input;

public interface ICommand {
	boolean CanExecute(Object parameter);

	void Execute(Object parameter);

	/* event */ EventHandler CanExecuteChanged;
}