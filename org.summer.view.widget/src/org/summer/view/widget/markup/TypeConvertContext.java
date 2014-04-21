package org.summer.view.widget.markup;

import org.summer.view.widget.Type;
import org.summer.view.widget.model.ITypeDescriptorContext;
import org.summer.view.widget.model.PropertyDescriptor;

///<summary>TypeConverterContext class used for parsing Attributes.</summary>
/*internal*/ public class TypeConvertContext implements ITypeDescriptorContext 
{

//#region Public

//#region Methods

    ///<summary> 
    /// OnComponentChange
    ///</summary> 
    ///<internalonly>
    /// member is public only because base class has
    /// this public member declared
    ///</internalonly> 
    ///<returns>
    /// void 
    ///</returns> 
    public void OnComponentChanged()
    { 
    }

    ///<summary>
    /// OnComponentChanging 
    ///</summary>
    ///<internalonly> 
    /// member is public only because base class has 
    /// this public member declared
    ///</internalonly> 
    ///<returns>
    /// void
    ///</returns>
    public boolean OnComponentChanging() 
    {
        return false; 
    } 

    ///<summary> 
    /// IServiceProvider GetService implementation
    ///</summary>
    ///<param name="serviceType">
    /// Type of Service to be returned 
    ///</param>
    ///<internalonly> 
    /// member is public only because base class has 
    /// this public member declared
    ///</internalonly> 
    ///<returns>
    /// Service Object or null if service is not found
    ///</returns>
    /*virtual*/ public Object GetService(Type serviceType) 
    {
        if (serviceType == typeof(IUriContext)) 
        { 
            return _parserContext as IUriContext;
        } 

        // temporary code to optimize Paints.White etc, until this is done
        // in a more generic fashion in SolidPaint ctor
        else if (serviceType == typeof(String)) 
        {
            return _attribStringValue; 
        } 

//#if PBTCOMPILER 
//        return null;
//#else
        // Check for the other provided services

        ProvideValueServiceProvider serviceProvider = _parserContext.ProvideValueProvider;
        return serviceProvider.GetService( serviceType ); 
//#endif 

    } 

//#endregion Methods

//#region Properties 

    ///<summary>Container property</summary> 
    ///<internalonly> 
    /// property is public only because base class has
    /// this public property declared 
    ///</internalonly>
    public IContainer Container
    {
        get {return null;} 
    }

    ///<summary>Instance property</summary> 
    ///<internalonly>
    /// property is public only because base class has 
    /// this public property declared
    ///</internalonly>
    public Object Instance
    { 
        get { return null; }
    } 

    ///<summary>Propert Descriptor</summary>
    ///<internalonly> 
    /// property is public only because base class has
    /// this public property declared
    ///</internalonly>
    public PropertyDescriptor PropertyDescriptor 
    {
        get { return null;} 
    } 

//#if !PBTCOMPILER 
    // Make the ParserContext available internally as an optimization.
    public ParserContext ParserContext
    {
        get { return _parserContext; } 
    }
//#endif 

//#endregion Properties

//#endregion Public

//#region Internal

//#region Contructors

//#if !PBTCOMPILER 
    /// <summary>
    /// 
    /// </summary>
    /// <param name="parserContext"></param>
    public TypeConvertContext(ParserContext parserContext)
    { 
        _parserContext = parserContext;
    } 
//#endif 

    // temporary code to optimize Paints.White etc, until this is done 
    // in a more generic fashion in SolidPaint ctor

//#if PBTCOMPILER
    /// <summary> 
    ///
    /// </summary> 
    /// <param name="parserContext"></param> 
    /// <param name="originalAttributeValue"></param>
    public TypeConvertContext(ParserContext parserContext, String originalAttributeValue) 
    {
        _parserContext = parserContext;
        _attribStringValue = originalAttributeValue;
    } 
//#endif

//#endregion Constructors 

//#endregion /*internal*/ public 

//#region Private

//#region Data 

    ParserContext _parserContext; 

    // _attribStringValue is never set when !PBTCOMPILER
//    #pragma warning disable 0649 
    String _attribStringValue;
//    #pragma warning restore 0649

//#endregion Data 

//#endregion Private 

}