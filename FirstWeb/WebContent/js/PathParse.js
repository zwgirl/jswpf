function PathParser ()   {
        String _error; 
        this.Error=_error;


        // Each level of the path consists of
        // a property or indexer:
        // .propname
        // /propname
        // [index]
        // /[index]
        // (The . or / is optional in the very first level.)
        // The parser is a finite-state machine with two states corresponding
        // to the two-character lookahead above, plus two more states for the
		// begining
        // and end. The state transistions are done explicitly in the code
		// below.
        // 
        // The parser returns a 0-length array if it finds a syntax error.
        // It sets the Error property, so the caller can find out what happened.

        function Parse(/* String */ path)
        {
            _path = (path != null) ? path.Trim() : String.Empty; 
            _n = _path.Length;
 
            if (_n == 0) 
            {
                // When no path String is specified, use value directly and do
				// not drill-in. (same as Path=".")
                // ClrBindingWorker needs this information to tell
				// XmlBindingWorker about collectionMode.
                return new SourceValueInfo[new SourceValueInfo(SourceValueType.Direct, DrillIn.Never, null)];
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
                case State.Init:
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
 
                case State.DrillIn:
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
                        SetError(SRID.PathSyntax, _path.Substring(0, _index), _path.Substring(_index)); 
                        return EmptyInfo;
                    } 
                    _state = State.Prop;
                    break;

                case State.Prop: 
                    bool isIndexer = false;
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

 
            var result; 

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

        function AddProperty() 
        {
            var start = _index;  // int
            var level = 0;  // int

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
                SetError(SRID.UnmatchedParen, _path.Substring(start)); 
                return;
            } 

            if (level < 0)
            {
                SetError(SRID.UnmatchedParen, _path.Substring(0, _index)); 
                return;
            } 
 
            var name = _path.Substring(start, _index - start).Trim(); // String
 
            SourceValueInfo info = (name.Length > 0)
                ? new SourceValueInfo(SourceValueType.Property, _drillIn, name)
                : new SourceValueInfo(SourceValueType.Direct, _drillIn,  null);
 
            _al.Add(info);
 
            StartNewLevel(); 
        }
 

        var IndexerState = { BeginParam:0, ParenString:1, ValueString:2, Done:3 };

        function AddIndexer() 
        {
            // indexer args are parsed by a (sub-) state machine with four
            // states. The String is a comma-separated list of params, each
            // of which has two parts: a "paren String" and a "value String"
            // (both parts are optional). The character ^ can be used to
            // escape any of the special characters: comma, parens, ], ^,
            // and white space.

            var start = ++_index;       // skip over initial [ //int
            var level = 1;              // level of nested [] //int
 
            var escaped = false;       // true if current char is escaped
            var trimRight = false;     // true if value String has trailing
										// white space
 
            StringBuilder parenStringBuilder = new StringBuilder();
            StringBuilder valueStringBuilder = new StringBuilder();

            var paramList = new Array(); 

            IndexerState state = IndexerState.BeginParam; 
            while (state != IndexerState.Done) 
            {
                if (_index >= _n) 
                {
                    SetError(SRID.UnmatchedBracket, _path.Substring(start - 1));
                    return;
                } 

                Char c = _path[_index++]; 
 
                // handle the escape character - set the flag for the next
				// character
                if (c == EscapeChar && !escaped) 
                {
                    escaped = true;
                    continue;
                } 

                switch (state) 
                { 
                    case IndexerState.BeginParam:   // look for optional (...)
                        if (escaped) 
                        {
                            // no '(', go parse the value
                            state = IndexerState.ValueString;
                            goto case IndexerState.ValueString; 
                        }
                        else if (c == '(') 
                        { 
                            // '(' introduces optional paren String
                            state = IndexerState.ParenString; 
                        }
                        else if (Char.IsWhiteSpace(c))
                        {
                            // ignore leading white space
                        }
                        else 
                        { 
                            // no '(', go parse the value
                            state = IndexerState.ValueString; 
                            goto case IndexerState.ValueString;
                        }
                        break;
 
                    case IndexerState.ParenString:  // parse (...)
                        if (escaped) 
                        { 
                            // add an escaped character without question
                            parenStringBuilder.Append(c); 
                        }
                        else if (c == ')')
                        {
                            // end of (...), start to parse value
                            state = IndexerState.ValueString;
                        } 
                        else 
                        {
                            // add normal characters inside (...)
                            parenStringBuilder.Append(c);
                        }
                        break;
 
                    case IndexerState.ValueString:  // parse value
                        if (escaped) 
                        { 
                            // add an escaped character without question
                            valueStringBuilder.Append(c); 
                            trimRight = false;
                        }
                        else if (level > 1)
                        { 
                            // inside nested [], add characters without question
                            valueStringBuilder.Append(c); 
                            trimRight = false; 

                            if (c == ']') 
                            {
                                --level;
                            }
                        } 
                        else if (Char.IsWhiteSpace(c))
                        { 
                            // add white space, but trim it later if it's
							// trailing
                            valueStringBuilder.Append(c);
                            trimRight = true; 
                        }
                        else if (c == ',' || c == ']')
                        {
                            // end of current paramater - assemble the two parts
                            String parenString = parenStringBuilder.ToString();
                            String valueString = valueStringBuilder.ToString(); 
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

                            // after ',' parse next parameter; after ']' we're
							// done
                            state = (c == ']') ? IndexerState.Done : IndexerState.BeginParam;
                        } 
                        else
                        { 
                            // add normal characters
                            valueStringBuilder.Append(c);
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

        function StartNewLevel() 
        { 
            _state = (_index < _n) ? State.DrillIn : State.Done;
            _drillIn = DrillIn.Never; 
        }

        var _state;   // State
        var _path;     // String
        var _index;   // int
        var _n;    // int
        var _drillIn;  // DrillIn
        var _al = new Array();
        var NullChar = Char.MinValue; 
        var EscapeChar = '^';
        var SourceValueInfo[] EmptyInfo = new SourceValueInfo[0];
        var String SpecialChars = "./[]";
        
        

        var State = { Init:0, DrillIn:1, Prop:2, Done:3 }; 
        var SourceValueType = { Property:0, Indexer:1, Direct:2 }; 
        var DrillIn = { Never:0, IfNeeded:1, Always:2 };

         function SourceValueInfo()
        { 
             this.type = t; 
             this.drillIn = d;
             this.name = null; 
             this.paramList = list; 
             this.propertyName = null;
        }

        function IndexerParamInfo(paren, value){ 
             this.parenString = paren;
             this.valueString = value;
        }
    } 