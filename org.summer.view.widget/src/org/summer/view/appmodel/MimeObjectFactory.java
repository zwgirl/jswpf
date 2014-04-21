import java.util.stream.Stream;

import org.eclipse.core.internal.content.ContentType;
import org.summer.view.widget.Uri;
import org.summer.view.widget.collection.Dictionary;
import org.summer.view.widget.markup.XamlReader;

/*internal*/ public /*static*/ class MimeObjectFactory
{

    //----------------------------------------------------- 
    //
    //  Internal Static Methods 
    // 
    //-----------------------------------------------------

//    #region internal static methods

    // The delegate that we are calling is responsible for closing the stream
    /*internal*/ public static Object GetObjectAndCloseStream(Stream s, ContentType contentType, Uri baseUri, boolean canUseTopLevelBrowser, 
    		boolean sandboxExternalContent, boolean allowAsync, boolean isJournalNavigation, /*out*/ XamlReader asyncObjectConverter) 
    {
    	Object objToReturn = null; 
        asyncObjectConverter = null; 

        if (contentType != null) 
        {
            StreamToObjectFactoryDelegate d;
            if (_objectConverters.TryGetValue(contentType, /*out*/ d))
            { 
                objToReturn = d(s, baseUri, canUseTopLevelBrowser, sandboxExternalContent, allowAsync, isJournalNavigation, /*out*/ asyncObjectConverter);
            } 
        } 

        return objToReturn; 
    }

    // The delegate registered here will be responsible for closing the stream passed to it.
    /*internal*/ public static void Register(ContentType contentType, StreamToObjectFactoryDelegate method) 
    {
        _objectConverters[contentType] = method; 
    } 

//    #endregion 


    //------------------------------------------------------
    // 
    //  Private Members
    // 
    //----------------------------------------------------- 

//    #region private members 

    private static final Dictionary<ContentType, StreamToObjectFactoryDelegate> _objectConverters = new Dictionary<ContentType, StreamToObjectFactoryDelegate>(5, new ContentType.WeakComparer());

//    #endregion 

}