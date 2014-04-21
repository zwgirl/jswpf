package org.summer.view.widget.internal;

import org.summer.view.widget.CultureInfo;
/// <summary> 
/// An instance of this class can be used wherever you might otherwise use
/// "new Object()".  The name will show up in the debugger, instead of 
/// merely "{object}"
/// </summary>

/*internal*/ public class NamedObject 
{
    public NamedObject(String name) 
    { 
        if (String.IsNullOrEmpty(name))
            throw new ArgumentNullException(name); 

        _name = name;
    }

    public /*override*/ String ToString()
    { 
        if (_name[0] != '{') 
        {
            // lazily add {} around the name, to avoid allocating a String 
            // until it's actually needed
            _name = String.Format(CultureInfo.InvariantCulture, "{{{0}}}", _name);
        }

        return _name;
    } 

    String _name;
}     [FriendAccessAllowed]   // Built into Base, also used by Framework.
