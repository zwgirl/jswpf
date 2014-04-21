package org.summer.view.widget.data;

import org.summer.view.widget.collection.FrugalObjectList;


/*internal*/ public class SourceValueInfo
{ 
    public SourceValueType type;
    public DrillIn drillIn; 
    public String name;                 // the name the user supplied - could be "(0)" 
    public FrugalObjectList<IndexerParamInfo> paramList;    // params for indexer
    public String propertyName;         // the real name - could be "Width" 

    public SourceValueInfo(SourceValueType t, DrillIn d, String n)
    {
        type = t; 
        drillIn = d;
        name = n; 
        paramList = null; 
        propertyName = null;
    } 

    public SourceValueInfo(SourceValueType t, DrillIn d, FrugalObjectList<IndexerParamInfo> list)
    {
        type = t; 
        drillIn = d;
        name = null; 
        paramList = list; 
        propertyName = null;
    } 
}