package org.summer.view.widget.data;
/*internal*/ public class IndexerParamInfo
{ 
    // parse each indexer param "(abc)xyz" into two pieces - either can be empty
    public String parenString; 
    public String valueString; 

    public IndexerParamInfo(String paren, String value) 
    {
        parenString = paren;
        valueString = value;
    } 
}