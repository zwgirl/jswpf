package org.summer.view.widget.controls.primitives;
/// <summary>
/// A user of the ItemContainerGenerator describes positions using this class.
/// Some examples: 
/// To start generating forward from the beginning of the item list,
/// specify position (-1, 0) and direction Forward. 
/// To start generating backward from the end of the list, 
/// specify position (-1, 0) and direction Backward.
/// To generate the items after the element with index k, specify 
/// position (k, 0) and direction Forward.
/// </summary>
public class GeneratorPosition
{ 
    /// <summary>
    /// Index, with respect to realized elements.  The special value -1 
    /// refers to a fictitious element at the beginning or end of the 
    /// the list.
    /// </summary> 
    public int Index  { get { return _index; }  set { _index = value; } }

    /// <summary>
    /// Offset, with respect to unrealized items near the indexed element. 
    /// An offset of 0 refers to the indexed element itself, an offset
    /// of 1 refers to the next (unrealized) item, and an offset of -1 
    /// refers to the previous item. 
    /// </summary>
    public int Offset { get { return _offset; } set { _offset = value; } } 

    /// <summary> Constructor </summary>
    public GeneratorPosition(int index, int offset)
    { 
        _index = index;
        _offset = offset; 
    } 

    /// <summary> Return a hash code </summary> 
    // This is required by FxCop.
    public /*override*/ int GetHashCode()
    {
        return _index.GetHashCode() + _offset.GetHashCode(); 
    }

    /// <summary>Returns a String representation of the GeneratorPosition</summary> 
    public /*override*/ String ToString()
    { 
        return String.Concat("GeneratorPosition (", _index.ToString(TypeConverterHelper.InvariantEnglishUS), ",", _offset.ToString(TypeConverterHelper.InvariantEnglishUS), ")");
    }


    // The remaining methods are present only because they are required by FxCop.

    /// <summary> Equality test </summary> 
    // This is required by FxCop.
    public /*override*/ boolean Equals(Object o) 
    {
        if (o instanceof GeneratorPosition)
        {
            GeneratorPosition that = (GeneratorPosition)o; 
            return  this._index == that._index &&
                    this._offset == that._offset; 
        } 
        return false;
    } 

    /// <summary> Equality test </summary>
    // This is required by FxCop.
    public static boolean operator==(GeneratorPosition gp1, GeneratorPosition gp2) 
    {
        return  gp1._index == gp2._index && 
                gp1._offset == gp2._offset; 
    }

    /// <summary> Inequality test </summary>
    // This is required by FxCop.
    public static boolean operator!=(GeneratorPosition gp1, GeneratorPosition gp2)
    { 
        return  !(gp1 == gp2);
    } 

    private int _index;
    private int _offset; 
}