/**
 * From BindingExpression
 * SourceType
 */
define(null, function(){
	
    var SourceType = declare("SourceType", null,{ 
    });	
    
    SourceType.Unknown = 0;
    SourceType.CLR = 1;
    SourceType.XML = 2;

    
    return SourceType;
});
