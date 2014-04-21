/**
 * PathParser
 */
define(["dojo/_base/declare", "system/Type", "internal.data/SourceValueInfo", "internal.data/DrillIn",
        "internal.data/SourceValueType", "internal.data/IndexerParamInfo"], 
		function(declare, Type, SourceValueInfo, DrillIn, SourceValueType,
				IndexerParamInfo){
	
	var State = { Init:0, DrillIn:1, Prop:2, Done:3 }; 
	
	var IndexerState = { BeginParam:0, ParenString:1, ValueString:2, Done:3 };
	
    var NullChar = 0x00; 
    var EscapeChar = '^';

    var SpecialChars = "./[]";
    
	var PathParser = declare("PathParser", null, {
		constructor:function( ){
			this._al= [];
		},
		
        /*public SourceValueInfo[] */
		Parse:function(/*string*/ path)
        {
            this._path = (path != null) ? path.Trim() : ""; 
            this._n = this._path.length;
 
            if (this._n == 0) 
            {
                // When no path string is specified, use value directly and do not drill-in. (same as Path=".") 
                // ClrBindingWorker needs this information to tell XmlBindingWorker about collectionMode.
                return [ new SourceValueInfo(SourceValueType.Direct, DrillIn.Never, /*(string)*/null) ];
            }
 
            this._index = 0;
            this._drillIn = DrillIn.IfNeeded; 
 
            this._al.splice(0, this._al.length);
            this._error = null; 
            this._state = State.Init;

            while (this._state != State.Done)
            { 
                var c = (this._index<this._n) ? this._path[this._index] : NullChar;
                if (c.isWhiteSpace()) 
                { 
                    ++ this._index;
                    continue; 
                }

                switch (this._state)
                { 
                case State.Init:
                    switch (c) 
                    { 
                    case '/':
                    case '.': 
                    case NullChar:
                        this._state = State.DrillIn;
                        break;
                    default: 
                    	this._state = State.Prop;
                        break; 
                    } 
                    break;
 
                case State.DrillIn:
                    switch (c)
                    {
                    case '/': 
                    	this._drillIn = DrillIn.Always;
                        ++ this._index; 
                        break; 
                    case '.':
                    	this._drillIn = DrillIn.Never; 
                        ++ this._index;
                        break;
                    case '[':
                    case NullChar: 
                        break;
                    default: 
                        this.SetError("SRID.PathSyntax : " , this._path.substring(0, this._index), this._path.substring(this._index)); 
                        return PathParser.EmptyInfo;
                    } 
                    this._state = State.Prop;
                    break;

                case State.Prop: 
                    var isIndexer = false;
                    switch (c) 
                    { 
                    case '[':
                        isIndexer = true; 
                        break;
                    default:
                        break;
                    } 

                    if (isIndexer) 
                    	this.AddIndexer(); 
                    else
                    	this.AddProperty(); 

                    break;
                }
            } 
 
            /*SourceValueInfo[]*/var result; 

            if (this._error == null) 
            {
                result = []; //result.length=_al.Count;
                for(var i=0; i<this._al.length; i++){
                	result[i] = this._al[i];
                }
//                this._al.CopyTo(result);
            } 
            else
            { 
                result = PathParser.EmptyInfo; 
            }
 
            return result;
        },

        /*void*/ 
        AddProperty:function() 
        {
            var start = this._index; 
            var level = 0; 

            // include leading dots in the path (for XLinq) 
            while (this._index < this._n && this._path[this._index] == '.')
                ++ this._index;

            while (this._index < this._n && (level > 0 || SpecialChars.indexOf(this._path[this._index]) < 0)) 
            {
                if (this._path[this._index] == '(') 
                    ++ level; 
                else if (this._path[this._index] == ')')
                    -- level; 

                ++ this._index;
            }
 
            if (level > 0)
            { 
                SetError("SRID.UnmatchedParen : " ,  this._path.substring(start)); 
                return;
            } 

            if (level < 0)
            {
                SetError("SRID.UnmatchedParen : " ,  this._path.substr/*ing*/(0, this._index)); 
                return;
            } 
 
            var name = this._path.substr/*ing*/(start, this._index - start).trim();
 
            /*SourceValueInfo*/var info = (name.length > 0)
                ? new SourceValueInfo(SourceValueType.Property, this._drillIn, name)
                : new SourceValueInfo(SourceValueType.Direct, this._drillIn, /*(string)*/null);
 
            this._al.push(info);
 
            this.StartNewLevel(); 
        },
        


        /*void*/ 
        AddIndexer:function() 
        {
            // indexer args are parsed by a (sub-) state machine with four 
            // states.  The string is a comma-separated list of params, each 
            // of which has two parts:  a "paren string" and a "value string"
            // (both parts are optional).  The character ^ can be used to 
            // escape any of the special characters:  comma, parens, ], ^,
            // and white space.

            var start = ++this._index;       // skip over initial [ 
            var level = 1;              // level of nested []
 
            var escaped = false;       // true if current char is escaped 
            var trimRight = false;     // true if value string has trailing white space
 
            /*StringBuilder*/var parenStringBuilder = ""/*new StringBuilder()*/;
            /*StringBuilder*/var valueStringBuilder = ""/*new StringBuilder()*/;

            /*FrugalObjectList<IndexerParamInfo>*/var paramList = []; 

            /*IndexerState*/var state = IndexerState.BeginParam; 
            
            /*Char*/var c = null; 
            
//            function ParenString(){
//                if (escaped) 
//                { 
//                    // add an escaped character without question
//                    parenStringBuilder +=c; 
//                }
//                else if (c == ')')
//                {
//                    // end of (...), start to parse value 
//                    state = IndexerState.ValueString;
//                } 
//                else 
//                {
//                    // add normal characters inside (...) 
//                    parenStringBuilder += c;
//                }
//            }
            
            function ValueString(){
                if (escaped) 
                { 
                    // add an escaped character without question
                    valueStringBuilderc += c; 
                    trimRight = false;
                }
                else if (level > 1)
                { 
                    // inside nested [], add characters without question
                    valueStringBuilder += c; 
                    trimRight = false; 

                    if (c == ']') 
                    {
                        --level;
                    }
                } 
                else if (c.isWhiteSpace())
                { 
                    // add white space, but trim it later if it's trailing 
                    valueStringBuilder += c;
                    trimRight = true; 
                }
                else if (c == ',' || c == ']')
                {
                    // end of current paramater - assemble the two parts 
                    var parenString = parenStringBuilder.toString();
                    var valueString = valueStringBuilder.toString(); 
                    if (trimRight) 
                    {
                        valueString = valueString.TrimEnd(); 
                    }

                    // add the parts to the final result
                    paramList.push(new IndexerParamInfo(parenString, valueString)); 

                    // reset for the next parameter 
                    parenStringBuilder = ""; 
                    valueStringBuilder = "";
                    trimRight = false; 

                    // after ',' parse next parameter;  after ']' we're done
                    state = (c == ']') ? IndexerState.Done : IndexerState.BeginParam;
                } 
                else
                { 
                    // add normal characters 
                    valueStringBuilder += c;
                    trimRight = false; 

                    // keep track of nested []
                    if (c == '[')
                    { 
                        ++level;
                    } 
                } 
            }
            
            while (state != IndexerState.Done) 
            {
                if (this._index >= this._n) 
                {
                    SetError("SRID.UnmatchedBracket", this._path.substring(start - 1));
                    return;
                } 

//                /*Char*/var c = this._path[this._index++]; 
                
                c = this._path[this._index++]; 
 
                // handle the escape character - set the flag for the next character
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
//                            goto case IndexerState.ValueString; 
                            ValueString();
                        }
                        else if (c == '(') 
                        { 
                            // '(' introduces optional paren string
                            state = IndexerState.ParenString; 
                        }
                        else if (c.isWhiteSpace())
                        {
                            // ignore leading white space 
                        }
                        else 
                        { 
                            // no '(', go parse the value
                            state = IndexerState.ValueString; 
//                            goto case IndexerState.ValueString;
                            ValueString();
                        }
                        break;
 
                    case IndexerState.ParenString:  // parse (...)
                        if (escaped) 
                        { 
                            // add an escaped character without question
                            parenStringBuilder +=c; 
                        }
                        else if (c == ')')
                        {
                            // end of (...), start to parse value 
                            state = IndexerState.ValueString;
                        } 
                        else 
                        {
                            // add normal characters inside (...) 
                            parenStringBuilder += c;
                        }
                        break;
 
                    case IndexerState.ValueString:  // parse value
                    	ValueString();
//                        if (escaped) 
//                        { 
//                            // add an escaped character without question
//                            valueStringBuilderc += c; 
//                            trimRight = false;
//                        }
//                        else if (level > 1)
//                        { 
//                            // inside nested [], add characters without question
//                            valueStringBuilder += c; 
//                            trimRight = false; 
//
//                            if (c == ']') 
//                            {
//                                --level;
//                            }
//                        } 
//                        else if (c.isWhiteSpace())
//                        { 
//                            // add white space, but trim it later if it's trailing 
//                            valueStringBuilder += c;
//                            trimRight = true; 
//                        }
//                        else if (c == ',' || c == ']')
//                        {
//                            // end of current paramater - assemble the two parts 
//                            var parenString = parenStringBuilder.toString();
//                            var valueString = valueStringBuilder.toString(); 
//                            if (trimRight) 
//                            {
//                                valueString = valueString.TrimEnd(); 
//                            }
//
//                            // add the parts to the final result
//                            paramList.push(new IndexerParamInfo(parenString, valueString)); 
//
//                            // reset for the next parameter 
//                            parenStringBuilder = ""; 
//                            valueStringBuilder = "";
//                            trimRight = false; 
//
//                            // after ',' parse next parameter;  after ']' we're done
//                            state = (c == ']') ? IndexerState.Done : IndexerState.BeginParam;
//                        } 
//                        else
//                        { 
//                            // add normal characters 
//                            valueStringBuilder += c;
//                            trimRight = false; 
//
//                            // keep track of nested []
//                            if (c == '[')
//                            { 
//                                ++level;
//                            } 
//                        } 
                        break;
                } 

                // after processing each character, clear the escape flag
                escaped = false;
            } 

            // assemble the final result 
            var info = new SourceValueInfo( 
                                        SourceValueType.Indexer,
                                        this._drillIn, paramList); 
            this._al.push(info);

            this.StartNewLevel();
        },
		
        /*void */StartNewLevel:function() 
        { 
            this._state = (this._index < this._n) ? State.DrillIn : State.Done;
            this._drillIn = DrillIn.Never; 
        },
        /*void*/ SetError:function(/*string*/ id, /*params object[]*/ args) { _error = (id + args); }
	});
	
	PathParser.EmptyInfo = [];

	
	Object.defineProperties(PathParser.prototype,{
        /*public String */
		Error: { get:function() { return this._error; } },
        
	});
	
	PathParser.Type = new Type("PathParser", PathParser, [Object.Type]);
	return PathParser;
});

////---------------------------------------------------------------------------- 
////
//// <copyright file="PathParser.cs" company="Microsoft">
////    Copyright (C) Microsoft Corporation.  All rights reserved.
//// </copyright> [[
////
//// Description: Parser for the Path of a (CLR) binding 
//// 
////---------------------------------------------------------------------------
// 
//using System;
//using System.Collections;
//using System.Text;          // StringBuilder
//using System.Windows; 
//using MS.Utility;           // FrugalList
// 
//namespace MS.Internal.Data 
//{
//    internal enum SourceValueType { Property, Indexer, Direct }; 
//    internal enum DrillIn { Never, IfNeeded, Always };
//
//    internal struct SourceValueInfo
//    { 
//        public SourceValueType type;
//        public DrillIn drillIn; 
//        public string name;                 // the name the user supplied - could be "(0)" 
//        public FrugalObjectList<IndexerParamInfo> paramList;    // params for indexer
//        public string propertyName;         // the real name - could be "Width" 
//
//        public SourceValueInfo(SourceValueType t, DrillIn d, string n)
//        {
//            type = t; 
//            drillIn = d;
//            name = n; 
//            paramList = null; 
//            propertyName = null;
//        } 
//
//        public SourceValueInfo(SourceValueType t, DrillIn d, FrugalObjectList<IndexerParamInfo> list)
//        {
//            type = t; 
//            drillIn = d;
//            name = null; 
//            paramList = list; 
//            propertyName = null;
//        } 
//    }
//
//    internal struct IndexerParamInfo
//    { 
//        // parse each indexer param "(abc)xyz" into two pieces - either can be empty
//        public string parenString; 
//        public string valueString; 
//
//        public IndexerParamInfo(string paren, string value) 
//        {
//            parenString = paren;
//            valueString = value;
//        } 
//    }
// 
//    internal class PathParser 
//    {
//        string _error; 
//        public String Error { get { return _error; } }
//        void SetError(string id, params object[] args) { _error = SR.Get(id, args); }
//
//        enum State { Init, DrillIn, Prop, Done }; 
//
//        // Each level of the path consists of 
//        //      a property or indexer: 
//        //                  .propname
//        //                  /propname 
//        //                  [index]
//        //                  /[index]
//        //          (The . or / is optional in the very first level.)
//        // The parser is a finite-state machine with two states corresponding 
//        // to the two-character lookahead above, plus two more states for the begining
//        // and end.  The state transistions are done explicitly in the code below. 
//        // 
//        // The parser returns a 0-length array if it finds a syntax error.
//        // It sets the Error property, so the caller can find out what happened. 
//
//        public SourceValueInfo[] Parse(string path)
//        {
//            _path = (path != null) ? path.Trim() : String.Empty; 
//            _n = _path.Length;
// 
//            if (_n == 0) 
//            {
//                // When no path string is specified, use value directly and do not drill-in. (same as Path=".") 
//                // ClrBindingWorker needs this information to tell XmlBindingWorker about collectionMode.
//                return new SourceValueInfo[] { new SourceValueInfo(SourceValueType.Direct, DrillIn.Never, (string)null) };
//            }
// 
//            _index = 0;
//            _drillIn = DrillIn.IfNeeded; 
// 
//            _al.Clear();
//            _error = null; 
//            _state = State.Init;
//
//            while (_state != State.Done)
//            { 
//                char c = (_index<_n) ? _path[_index] : NullChar;
//                if (Char.IsWhiteSpace(c)) 
//                { 
//                    ++ _index;
//                    continue; 
//                }
//
//                switch (_state)
//                { 
//                case State.Init:
//                    switch (c) 
//                    { 
//                    case '/':
//                    case '.': 
//                    case NullChar:
//                        _state = State.DrillIn;
//                        break;
//                    default: 
//                        _state = State.Prop;
//                        break; 
//                    } 
//                    break;
// 
//                case State.DrillIn:
//                    switch (c)
//                    {
//                    case '/': 
//                        _drillIn = DrillIn.Always;
//                        ++ _index; 
//                        break; 
//                    case '.':
//                        _drillIn = DrillIn.Never; 
//                        ++ _index;
//                        break;
//                    case '[':
//                    case NullChar: 
//                        break;
//                    default: 
//                        SetError(SRID.PathSyntax, _path.Substring(0, _index), _path.Substring(_index)); 
//                        return EmptyInfo;
//                    } 
//                    _state = State.Prop;
//                    break;
//
//                case State.Prop: 
//                    bool isIndexer = false;
//                    switch (c) 
//                    { 
//                    case '[':
//                        isIndexer = true; 
//                        break;
//                    default:
//                        break;
//                    } 
//
//                    if (isIndexer) 
//                        AddIndexer(); 
//                    else
//                        AddProperty(); 
//
//                    break;
//                }
//            } 
//
// 
//            SourceValueInfo[] result; 
//
//            if (_error == null) 
//            {
//                result = new SourceValueInfo[_al.Count];
//                _al.CopyTo(result);
//            } 
//            else
//            { 
//                result = EmptyInfo; 
//            }
// 
//            return result;
//        }
//
//        void AddProperty() 
//        {
//            int start = _index; 
//            int level = 0; 
//
//            // include leading dots in the path (for XLinq) 
//            while (_index < _n && _path[_index] == '.')
//                ++ _index;
//
//            while (_index < _n && (level > 0 || SpecialChars.IndexOf(_path[_index]) < 0)) 
//            {
//                if (_path[_index] == '(') 
//                    ++ level; 
//                else if (_path[_index] == ')')
//                    -- level; 
//
//                ++ _index;
//            }
// 
//            if (level > 0)
//            { 
//                SetError(SRID.UnmatchedParen, _path.Substring(start)); 
//                return;
//            } 
//
//            if (level < 0)
//            {
//                SetError(SRID.UnmatchedParen, _path.Substring(0, _index)); 
//                return;
//            } 
// 
//            string name = _path.Substring(start, _index - start).Trim();
// 
//            SourceValueInfo info = (name.Length > 0)
//                ? new SourceValueInfo(SourceValueType.Property, _drillIn, name)
//                : new SourceValueInfo(SourceValueType.Direct, _drillIn, (string)null);
// 
//            _al.Add(info);
// 
//            StartNewLevel(); 
//        }
// 
//
//        enum IndexerState { BeginParam, ParenString, ValueString, Done }
//
//        void AddIndexer() 
//        {
//            // indexer args are parsed by a (sub-) state machine with four 
//            // states.  The string is a comma-separated list of params, each 
//            // of which has two parts:  a "paren string" and a "value string"
//            // (both parts are optional).  The character ^ can be used to 
//            // escape any of the special characters:  comma, parens, ], ^,
//            // and white space.
//
//            int start = ++_index;       // skip over initial [ 
//            int level = 1;              // level of nested []
// 
//            bool escaped = false;       // true if current char is escaped 
//            bool trimRight = false;     // true if value string has trailing white space
// 
//            StringBuilder parenStringBuilder = new StringBuilder();
//            StringBuilder valueStringBuilder = new StringBuilder();
//
//            FrugalObjectList<IndexerParamInfo> paramList = new FrugalObjectList<IndexerParamInfo>(); 
//
//            IndexerState state = IndexerState.BeginParam; 
//            while (state != IndexerState.Done) 
//            {
//                if (_index >= _n) 
//                {
//                    SetError(SRID.UnmatchedBracket, _path.Substring(start - 1));
//                    return;
//                } 
//
//                Char c = _path[_index++]; 
// 
//                // handle the escape character - set the flag for the next character
//                if (c == EscapeChar && !escaped) 
//                {
//                    escaped = true;
//                    continue;
//                } 
//
//                switch (state) 
//                { 
//                    case IndexerState.BeginParam:   // look for optional (...)
//                        if (escaped) 
//                        {
//                            // no '(', go parse the value
//                            state = IndexerState.ValueString;
//                            goto case IndexerState.ValueString; 
//                        }
//                        else if (c == '(') 
//                        { 
//                            // '(' introduces optional paren string
//                            state = IndexerState.ParenString; 
//                        }
//                        else if (Char.IsWhiteSpace(c))
//                        {
//                            // ignore leading white space 
//                        }
//                        else 
//                        { 
//                            // no '(', go parse the value
//                            state = IndexerState.ValueString; 
//                            goto case IndexerState.ValueString;
//                        }
//                        break;
// 
//                    case IndexerState.ParenString:  // parse (...)
//                        if (escaped) 
//                        { 
//                            // add an escaped character without question
//                            parenStringBuilder.Append(c); 
//                        }
//                        else if (c == ')')
//                        {
//                            // end of (...), start to parse value 
//                            state = IndexerState.ValueString;
//                        } 
//                        else 
//                        {
//                            // add normal characters inside (...) 
//                            parenStringBuilder.Append(c);
//                        }
//                        break;
// 
//                    case IndexerState.ValueString:  // parse value
//                        if (escaped) 
//                        { 
//                            // add an escaped character without question
//                            valueStringBuilder.Append(c); 
//                            trimRight = false;
//                        }
//                        else if (level > 1)
//                        { 
//                            // inside nested [], add characters without question
//                            valueStringBuilder.Append(c); 
//                            trimRight = false; 
//
//                            if (c == ']') 
//                            {
//                                --level;
//                            }
//                        } 
//                        else if (Char.IsWhiteSpace(c))
//                        { 
//                            // add white space, but trim it later if it's trailing 
//                            valueStringBuilder.Append(c);
//                            trimRight = true; 
//                        }
//                        else if (c == ',' || c == ']')
//                        {
//                            // end of current paramater - assemble the two parts 
//                            string parenString = parenStringBuilder.ToString();
//                            string valueString = valueStringBuilder.ToString(); 
//                            if (trimRight) 
//                            {
//                                valueString = valueString.TrimEnd(); 
//                            }
//
//                            // add the parts to the final result
//                            paramList.Add(new IndexerParamInfo(parenString, valueString)); 
//
//                            // reset for the next parameter 
//                            parenStringBuilder.Length = 0; 
//                            valueStringBuilder.Length = 0;
//                            trimRight = false; 
//
//                            // after ',' parse next parameter;  after ']' we're done
//                            state = (c == ']') ? IndexerState.Done : IndexerState.BeginParam;
//                        } 
//                        else
//                        { 
//                            // add normal characters 
//                            valueStringBuilder.Append(c);
//                            trimRight = false; 
//
//                            // keep track of nested []
//                            if (c == '[')
//                            { 
//                                ++level;
//                            } 
//                        } 
//                        break;
//                } 
//
//                // after processing each character, clear the escape flag
//                escaped = false;
//            } 
//
//            // assemble the final result 
//            SourceValueInfo info = new SourceValueInfo( 
//                                        SourceValueType.Indexer,
//                                        _drillIn, paramList); 
//            _al.Add(info);
//
//            StartNewLevel();
//        } 
//
//        void StartNewLevel() 
//        { 
//            _state = (_index < _n) ? State.DrillIn : State.Done;
//            _drillIn = DrillIn.Never; 
//        }
//
//        State _state;
//        string _path; 
//        int _index;
//        int _n; 
//        DrillIn _drillIn; 
//        ArrayList _al = new ArrayList();
//        const char NullChar = Char.MinValue; 
//        const char EscapeChar = '^';
//        static SourceValueInfo[] EmptyInfo = new SourceValueInfo[0];
//        static string SpecialChars = @"./[]";
//    } 
//}