package org.summer.view.widget.documents;

import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.LocalValueEnumerator;
import org.summer.view.widget.Rect;
import org.summer.view.widget.Type;

public interface ITextPointer
	{
		ITextContainer TextContainer
		{
			get;
		}
		boolean HasValidLayout
		{
			get;
		}
		boolean IsAtCaretUnitBoundary
		{
			get;
		}
		LogicalDirection LogicalDirection
		{
			get;
		}
		Type ParentType
		{
			get;
		}
		boolean IsAtInsertionPosition
		{
			get;
		}
		boolean IsFrozen
		{
			get;
		}
		int Offset
		{
			get;
		}
		int CharOffset
		{
			get;
		}
		ITextPointer CreatePointer();
		StaticTextPointer CreateStaticPointer();
		ITextPointer CreatePointer(int offset);
		ITextPointer CreatePointer(LogicalDirection gravity);
		ITextPointer CreatePointer(int offset, LogicalDirection gravity);
		void SetLogicalDirection(LogicalDirection direction);
		int CompareTo(ITextPointer position);
		int CompareTo(StaticTextPointer position);
		boolean HasEqualScope(ITextPointer position);
		TextPointerContext GetPointerContext(LogicalDirection direction);
		int GetOffsetToPosition(ITextPointer position);
		int GetTextRunLength(LogicalDirection direction);
		String GetTextInRun(LogicalDirection direction);
		int GetTextInRun(LogicalDirection direction, char[] textBuffer, int startIndex, int count);
		Object GetAdjacentElement(LogicalDirection direction);
		void MoveToPosition(ITextPointer position);
		int MoveByOffset(int offset);
		boolean MoveToNextContextPosition(LogicalDirection direction);
		ITextPointer GetNextContextPosition(LogicalDirection direction);
		boolean MoveToInsertionPosition(LogicalDirection direction);
		ITextPointer GetInsertionPosition(LogicalDirection direction);
		ITextPointer GetFormatNormalizedPosition(LogicalDirection direction);
		boolean MoveToNextInsertionPosition(LogicalDirection direction);
		ITextPointer GetNextInsertionPosition(LogicalDirection direction);
		void MoveToElementEdge(ElementEdge edge);
		int MoveToLineBoundary(int count);
		Rect GetCharacterRect(LogicalDirection direction);
		void Freeze();
		ITextPointer GetFrozenPointer(LogicalDirection logicalDirection);
		void InsertTextInRun(String textData);
		void DeleteContentToPosition(ITextPointer limit);
		Type GetElementType(LogicalDirection direction);
		Object GetValue(DependencyProperty formattingProperty);
		Object ReadLocalValue(DependencyProperty formattingProperty);
		LocalValueEnumerator GetLocalValueEnumerator();
		boolean ValidateLayout();
	}