package org.summer.view.widget.documents;

import java.util.stream.Stream;

import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.IDisposable;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.collection.List;

public interface ITextRange
	{
		/*event*/ EventHandler Changed;
		boolean IgnoreTextUnitBoundaries
		{
			get;
		}
		ITextPointer Start
		{
			get;
		}
		ITextPointer End
		{
			get;
		}
		boolean IsEmpty
		{
			get;
		}
		List<TextSegment> TextSegments
		{
			get;
		}
		boolean HasConcreteTextContainer
		{
			get;
		}
		String Text
		{
			get;
			set;
		}
		String Xml
		{
			get;
		}
		boolean IsTableCellRange
		{
			get;
		}
		int ChangeBlockLevel
		{
			get;
		}
		uint _ContentGeneration
		{
			get;
			set;
		}
		boolean _IsTableCellRange
		{
			get;
			set;
		}
		List<TextSegment> _TextSegments
		{
			get;
			set;
		}
		int _ChangeBlockLevel
		{
			get;
			set;
		}
		ChangeBlockUndoRecord _ChangeBlockUndoRecord
		{
			get;
			set;
		}
		boolean _IsChanged
		{
			get;
			set;
		}
		boolean Contains(ITextPointer position);
		void Select(ITextPointer position1, ITextPointer position2);
		void SelectWord(ITextPointer position);
		void SelectParagraph(ITextPointer position);
		void ApplyTypingHeuristics(boolean overType);
		Object GetPropertyValue(DependencyProperty formattingProperty);
		UIElement GetUIElementSelected();
		boolean CanSave(String dataFormat);
		void Save(Stream stream, String dataFormat);
		void Save(Stream stream, String dataFormat, boolean preserveTextElements);
		void BeginChange();
		void BeginChangeNoUndo();
		void EndChange();
		void EndChange(boolean disableScroll, boolean skipEvents);
		IDisposable DeclareChangeBlock();
		IDisposable DeclareChangeBlock(boolean disableScroll);
		void NotifyChanged(boolean disableScroll, boolean skipEvents);
		void FireChanged();
	}