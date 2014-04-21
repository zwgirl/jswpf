package org.summer.view.widget.input;

import org.summer.view.widget.IInputElement;
  public interface ICommandSource {
    ICommand Command { get; }
    Object CommandParameter { get; }
    IInputElement CommandTarget { get; }
  }