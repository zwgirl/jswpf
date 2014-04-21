package org.summer.view.widget.data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.summer.view.widget.collection.FrugalObjectList;

/*internal*/ public class PathParser 
{
    enum State { Init, DrillIn, Prop, Done }; 
    
    String _error; 
    public String Error { get { return _error; } }
    void SetError(String id, /*params*/ Object[] args) { _error = SR.Get(id, args); }



    // Each level of the path consists of 
    //      a property or indexer: 
    //                  .propname
    //                  /propname 
    //                  [index]
    //                  /[index]
    //          (The . or / is optional in the very first level.)
    // The parser is a finite-state machine with two states corresponding 
    // to the two-character lookahead above, plus two more states for the begining
    // and end.  The state transistions are done explicitly in the code below. 
    // 
    // The parser returns a 0-length array if it finds a syntax error.
    // It sets the Error property, so the caller can find out what happened. 

    public SourceValueInfo[] Parse(String path)
    {
        _path = (path != null) ? path.Trim() : String.Empty; 
        _n = _path.length();

        if (_n == 0) 
        {
            // When no path String is specified, use value directly and do not drill-in. (same as Path=".") 
            // ClrBindingWorker needs this information to tell XmlBindingWorker about collectionMode.
            return new SourceValueInfo[] { new SourceValueInfo(SourceValueType.Direct, DrillIn.Never, (String)null) };
        }

        _index = 0;
        _drillIn = DrillIn.IfNeeded; 

        _al.Clear();
        _error = null; 
        _state = State.Init;

        while (_state != State.Done)
        { 
            char c = (_index<_n) ? _path[_index] : NullChar;
            if (Char.IsWhiteSpace(c)) 
            { 
                ++ _index;
                continue; 
            }

            switch (_state)
            { 
            case /*State.*/Init:
                switch (c) 
                { 
                case '/':
                case '.': 
                case NullChar:
                    _state = State.DrillIn;
                    break;
                default: 
                    _state = State.Prop;
                    break; 
                } 
                break;

            case /*State.*/DrillIn:
                switch (c)
                {
                case '/': 
                    _drillIn = DrillIn.Always;
                    ++ _index; 
                    break; 
                case '.':
                    _drillIn = DrillIn.Never; 
                    ++ _index;
                    break;
                case '[':
                case NullChar: 
                    break;
                default: 
                    SetError(SRID.PathSyntax, _path.substring(0, _index), _path.substring(_index)); 
                    return EmptyInfo;
                } 
                _state = State.Prop;
                break;

            case /*State.*/Prop: 
                boolean isIndexer = false;
                switch (c) 
                { 
                case '[':
                    isIndexer = true; 
                    break;
                default:
                    break;
                } 

                if (isIndexer) 
                    AddIndexer(); 
                else
                    AddProperty(); 

                break;
            }
        } 


        SourceValueInfo[] result; 

        if (_error == null) 
        {
            result = new SourceValueInfo[_al.Count];
            _al.CopyTo(result);
        } 
        else
        { 
            result = EmptyInfo; 
        }

        return result;
    }

    void AddProperty() 
    {
        int start = _index; 
        int level = 0; 

        // include leading dots in the path (for XLinq) 
        while (_index < _n && _path[_index] == '.')
            ++ _index;

        while (_index < _n && (level > 0 || SpecialChars.IndexOf(_path[_index]) < 0)) 
        {
            if (_path[_index] == '(') 
                ++ level; 
            else if (_path[_index] == ')')
                -- level; 

            ++ _index;
        }

        if (level > 0)
        { 
            SetError(SRID.UnmatchedParen, _path.substring(start)); 
            return;
        } 

        if (level < 0)
        {
            SetError(SRID.UnmatchedParen, _path.substring(0, _index)); 
            return;
        } 

        String name = _path.substring(start, _index - start).Trim();

        SourceValueInfo info = (name.length() > 0)
            ? new SourceValueInfo(SourceValueType.Property, _drillIn, name)
            : new SourceValueInfo(SourceValueType.Direct, _drillIn, (String)null);

        _al.Add(info);

        StartNewLevel(); 
    }


    enum IndexerState { BeginParam, ParenString, ValueString, Done }

    void AddIndexer() 
    {
        // indexer args are parsed by a (sub-) state machine with four 
        // states.  The String is a comma-separated list of params, each 
        // of which has two parts:  a "paren String" and a "value String"
        // (both parts are optional).  The character ^ can be used to 
        // escape any of the special characters:  comma, parens, ], ^,
        // and white space.

        int start = ++_index;       // skip over initial [ 
        int level = 1;              // level of nested []

        boolean escaped = false;       // true if current char is escaped 
        boolean trimRight = false;     // true if value String has trailing white space

        StringBuilder parenStringBuilder = new StringBuilder();
        StringBuilder valueStringBuilder = new StringBuilder();

        FrugalObjectList<IndexerParamInfo> paramList = new FrugalObjectList<IndexerParamInfo>(); 

        IndexerState state = IndexerState.BeginParam; 
        while (state != IndexerState.Done) 
        {
            if (_index >= _n) 
            {
                SetError(/*SRID.UnmatchedBracket, _path.substring(start - 1)*/);
                return;
            } 

            Character c = _path[_index++]; 

            // handle the escape character - set the flag for the next character
            if (c == EscapeChar && !escaped) 
            {
                escaped = true;
                continue;
            } 

            switch (state) 
            { 
                case /*IndexerState.*/BeginParam:   // look for optional (...)
                    if (escaped) 
                    {
                        // no '(', go parse the value
                        state = IndexerState.ValueString;
                        goto case IndexerState.ValueString;  //cym  comment
                    }
                    else if (c == '(') 
                    { 
                        // '(' introduces optional paren String
                        state = IndexerState.ParenString; 
                    }
                    else if (Character.isWhitespace(c))
                    {
                        // ignore leading white space 
                    }
                    else 
                    { 
                        // no '(', go parse the value
                        state = IndexerState.ValueString; 
                        goto case IndexerState.ValueString; //cym  comment
                    }
                    break;

                case /*IndexerState.*/ParenString:  // parse (...)
                    if (escaped) 
                    { 
                        // add an escaped character without question
                        parenStringBuilder.append(c); 
                    }
                    else if (c == ')')
                    {
                        // end of (...), start to parse value 
                        state = IndexerState.ValueString;
                    } 
                    else 
                    {
                        // add normal characters inside (...) 
                        parenStringBuilder.append(c);
                    }
                    break;

                case /*IndexerState.*/ValueString:  // parse value
                    if (escaped) 
                    { 
                        // add an escaped character without question
                        valueStringBuilder.append(c); 
                        trimRight = false;
                    }
                    else if (level > 1)
                    { 
                        // inside nested [], add characters without question
                        valueStringBuilder.append(c); 
                        trimRight = false; 

                        if (c == ']') 
                        {
                            --level;
                        }
                    } 
                    else if (Character.isWhitespace(c))
                    { 
                        // add white space, but trim it later if it's trailing 
                        valueStringBuilder.append(c);
                        trimRight = true; 
                    }
                    else if (c == ',' || c == ']')
                    {
                        // end of current paramater - assemble the two parts 
                        String parenString = parenStringBuilder.toString();
                        String valueString = valueStringBuilder.toString(); 
                        if (trimRight) 
                        {
                            valueString = valueString.TrimEnd(); 
                        }

                        // add the parts to the final result
                        paramList.Add(new IndexerParamInfo(parenString, valueString)); 

                        // reset for the next parameter 
                        parenStringBuilder.Length = 0; 
                        valueStringBuilder.Length = 0;
                        trimRight = false; 

                        // after ',' parse next parameter;  after ']' we're done
                        state = (c == ']') ? IndexerState.Done : IndexerState.BeginParam;
                    } 
                    else
                    { 
                        // add normal characters 
                        valueStringBuilder.append(c);
                        trimRight = false; 

                        // keep track of nested []
                        if (c == '[')
                        { 
                            ++level;
                        } 
                    } 
                    break;
            } 

            // after processing each character, clear the escape flag
            escaped = false;
        } 

        // assemble the final result 
        SourceValueInfo info = new SourceValueInfo( 
                                    SourceValueType.Indexer,
                                    _drillIn, paramList); 
        _al.Add(info);

        StartNewLevel();
    } 

    void StartNewLevel() 
    { 
        _state = (_index < _n) ? State.DrillIn : State.Done;
        _drillIn = DrillIn.Never; 
    }

    State _state;
    String _path; 
    int _index;
    int _n; 
    DrillIn _drillIn; 
    ArrayList _al = new ArrayList();
    final char NullChar = Char.MinValue; 
    final char EscapeChar = '^';
    static SourceValueInfo[] EmptyInfo = new SourceValueInfo[0];
    static String SpecialChars = @"./[]";
} 