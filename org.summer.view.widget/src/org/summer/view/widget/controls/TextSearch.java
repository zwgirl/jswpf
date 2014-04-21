package org.summer.view.widget.controls;

import java.beans.EventHandler;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyKey;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.PropertyPath;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.data.Binding;
import org.summer.view.widget.data.BindingExpression;
import org.summer.view.widget.data.BindingMode;
import org.summer.view.widget.input.Keyboard;
import org.summer.view.widget.internal.SystemXmlHelper;
import org.summer.view.widget.markup.XmlLanguage;
import org.summer.view.widget.threading.DispatcherTimer;

//
/// <summary> 
///     Text Search is a feature that allows the user to quickly access items in a set by typing prefixes of the strings.
/// </summary>
public /*sealed*/ class TextSearch extends DependencyObject
	{ 
    /// <summary>
    ///     Make a new TextSearch instance attached to the given Object. 
    ///     Create the instance in the same context as the given DO. 
    /// </summary>
    /// <param name="itemsControl"></param> 
    private TextSearch(ItemsControl itemsControl)
    {
        if (itemsControl == null)
        { 
            throw new ArgumentNullException("itemsControl");
        } 

        _attachedTo = itemsControl;

        ResetState();
    }

    /// <summary> 
    ///     Get the instance of TextSearch attached to the given ItemsControl or make one and attach it if it's not.
    /// </summary> 
    /// <param name="itemsControl"></param> 
    /// <returns></returns>
    /*internal*/ public static TextSearch EnsureInstance(ItemsControl itemsControl) 
    {
        TextSearch instance = (TextSearch)itemsControl.GetValue(TextSearchInstanceProperty);

        if (instance == null) 
        {
            instance = new TextSearch(itemsControl); 
            itemsControl.SetValue(TextSearchInstancePropertyKey, instance); 
        }

        return instance;
    }

//    #region Text and TextPath Properties 

    /// <summary> 
    ///     Attached property to indicate which property on the item in the items collection to use for the "primary" text, 
    ///     or the text against which to search.
    /// </summary> 
    public static final DependencyProperty TextPathProperty
        = DependencyProperty.RegisterAttached("TextPath", typeof(String), typeof(TextSearch),
                                              new FrameworkPropertyMetadata(String.Empty /* default value */));

    /// <summary>
    ///     Writes the attached property to the given element. 
    /// </summary> 
    /// <param name="element"></param>
    /// <param name="path"></param> 
    public static void SetTextPath(DependencyObject element, String path)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        element.SetValue(TextPathProperty, path);
    } 

    /// <summary>
    ///     Reads the attached property from the given element.
    /// </summary> 
    /// <param name="element"></param>
    /// <returns></returns> 
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))] 
    public static String GetTextPath(DependencyObject element)
    { 
        if (element == null)
        {
            throw new ArgumentNullException("element");
        } 

        return (String)element.GetValue(TextPathProperty); 
    } 

    /// <summary> 
    ///     Attached property to indicate the value to use for the "primary" text of an element.
    /// </summary>
    public static final DependencyProperty TextProperty
        = DependencyProperty.RegisterAttached("Text", typeof(String), typeof(TextSearch), 
                                              new FrameworkPropertyMetadata((String)String.Empty, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

    /// <summary> 
    ///     Writes the attached property to the given element.
    /// </summary> 
    /// <param name="element"></param>
    /// <param name="text"></param>
    public static void SetText(DependencyObject element, String text)
    { 
        if (element == null)
        { 
            throw new ArgumentNullException("element"); 
        }

        element.SetValue(TextProperty, text);
    }

    /// <summary> 
    ///     Reads the attached property from the given element.
    /// </summary> 
    /// <param name="element"></param> 
    /// <returns></returns>
//    [AttachedPropertyBrowsableForType(typeof(DependencyObject))] 
    public static String GetText(DependencyObject element)
    {
        if (element == null)
        { 
            throw new ArgumentNullException("element");
        } 

        return (String)element.GetValue(TextProperty);
    } 

//    #endregion

//    #region Properties 

    /// <summary> 
    ///     Prefix that is currently being used in the algorithm. 
    /// </summary>
    private static final DependencyProperty CurrentPrefixProperty = 
        DependencyProperty.RegisterAttached("CurrentPrefix", typeof(String), typeof(TextSearch),
                                            new FrameworkPropertyMetadata((String)null));

    /// <summary> 
    ///     If TextSearch is currently active.
    /// </summary> 
    private static final DependencyProperty IsActiveProperty = 
        DependencyProperty.RegisterAttached("IsActive", typeof(boolean), typeof(TextSearch),
                                            new FrameworkPropertyMetadata(false)); 

//    #endregion

//    #region Private Properties 

    /// <summary> 
    ///     The key needed set a read-only property. 
    /// </summary>
    private static final DependencyPropertyKey TextSearchInstancePropertyKey = 
        DependencyProperty.RegisterAttachedReadOnly("TextSearchInstance", typeof(TextSearch), typeof(TextSearch),
                                            new FrameworkPropertyMetadata((Object)null /* default value */));

    /// <summary> 
    ///     Instance of TextSearch -- attached property so that the instance can be stored on the element
    ///     which wants the service. 
    /// </summary> 
    private static final DependencyProperty TextSearchInstanceProperty =
        TextSearchInstancePropertyKey.DependencyProperty; 


    // used to retrieve the value of an item, according to the TextPath
    private static final BindingExpressionUncommonField TextValueBindingExpression = new BindingExpressionUncommonField(); 

//    #endregion 

//    #region Private Methods

    /// <summary>
    ///     Called by consumers of TextSearch when a TextInput event is received
    ///     to kick off the algorithm.
    /// </summary> 
    /// <param name="nextChar"></param>
    /// <returns></returns> 
    /*internal*/ public boolean DoSearch(String nextChar) 
    {
        boolean repeatedChar = false; 

        int startItemIndex = 0;

        ItemCollection itemCollection = _attachedTo.Items as ItemCollection; 

        // If TextSearch is not active, then we should start 
        // the search from the beginning.  If it is active, we should 
        // start the search from the currently-matched item.
        if (IsActive) 
        {
            // ISSUE: This falls victim to duplicate elements being in the view.
            //        To mitigate this, we could remember ItemUI ourselves.

            startItemIndex = MatchedItemIndex;
        } 

        // If they pressed the same character as last time, we will do the fallback search.
        //     Fallback search is if they type "bob" and then press "b" 
        //     we'll look for "bobb" and when we don't find it we should
        //     find the next item starting with "bob".
        if (_charsEntered.Count > 0
            && (String.Compare(_charsEntered[_charsEntered.Count - 1], nextChar, true, GetCulture(_attachedTo))==0)) 
        {
            repeatedChar = true; 
        } 

        // Get the primary TextPath from the ItemsControl to which we are attached. 
        String primaryTextPath = GetPrimaryTextPath(_attachedTo);

        boolean wasNewCharUsed = false;

        int matchedItemIndex = FindMatchingPrefix(_attachedTo, primaryTextPath, Prefix,
                                                  nextChar, startItemIndex, repeatedChar, /*ref*/ wasNewCharUsed); 

        // If there was an item that matched, move to that item in the collection
        if (matchedItemIndex != -1) 
        {
            // Don't have to move currency if it didn't actually move.
            // startItemIndex is the index of the current item only if IsActive is true,
            // So, we have to move currency when IsActive is false. 
            if (!IsActive || matchedItemIndex != startItemIndex)
            { 
                Object matchedItem = itemCollection[matchedItemIndex]; 
                // Let the control decide what to do with matched-item
                _attachedTo.NavigateToItem(matchedItem, matchedItemIndex, new ItemsControl.ItemNavigateArgs(Keyboard.PrimaryDevice, ModifierKeys.None)); 
                // Store current match
                MatchedItemIndex = matchedItemIndex;
            }

            // Update the prefix if it changed
            if (wasNewCharUsed) 
            { 
                AddCharToPrefix(nextChar);
            } 

            // User has started typing (successfully), so we're active now.
            if (!IsActive)
            { 
                IsActive = true;
            } 
        } 

        // Reset the timeout and remember this character, but only if we're 
        // active -- this is because if we got called but the match failed
        // we don't need to set up a timeout -- no state needs to be reset.
        if (IsActive)
        { 
            ResetTimeout();
        } 

        return (matchedItemIndex != -1);
    } 

    /// <summary>
    ///     Called when the user presses backspace.
    /// </summary> 
    /// <returns></returns>
    /*internal*/ public boolean DeleteLastCharacter() 
    { 
        if (IsActive)
        { 
            // Remove the last character from the prefix String.
            // Get the last character entered and then remove a String of
            // that length off the prefix String.
            if (_charsEntered.Count > 0) 
            {
                String lastChar = _charsEntered[_charsEntered.Count - 1]; 
                String prefix = Prefix; 

                _charsEntered.RemoveAt(_charsEntered.Count - 1); 
                Prefix = prefix.Substring(0, prefix.Length - lastChar.Length);

                ResetTimeout();

                return true;
            } 
        } 

        return false; 
    }

    /// <summary>
    ///     Searches through the given itemCollection for the first item matching the given prefix. 
    /// </summary>
    /// <remarks> 
    ///     ------------------------------------------------------------------------- 
    ///     Incremental Type Search algorithm
    ///     ------------------------------------------------------------------------- 
    ///
    ///     Given a prefix and new character, we loop through all items in the collection
    ///     and look for an item that starts with the new prefix.  If we find such an item,
    ///     select it.  If the new character is repeated, we look for the next item after 
    ///     the current one that begins with the old prefix**.  We can optimize by
    ///     performing both of these searches in parallel. 
    /// 
    ///     **NOTE: Win32 will only do this if the old prefix is of length 1 - in other
    ///             words, first-character-only matching.  The algorithm described here 
    ///             is an extension of ITS as implemented in Win32.  This variant was
    ///             described to me by JeffBog as what was done in AFC - but I have yet
    ///             to find a listbox which behaves this way.
    /// 
    ///     --------------------------------------------------------------------------
    /// </remarks> 
    /// <returns>Item that matches the given prefix</returns> 
    private static int FindMatchingPrefix(ItemsControl itemsControl, String primaryTextPath, String prefix,
                                           String newChar, int startItemIndex, boolean lookForFallbackMatchToo, /*ref*/ boolean wasNewCharUsed) 
    {
        ItemCollection itemCollection = itemsControl.Items;

        // Using indices b/c this is a better way to uniquely 
        // identify an element in the collection.
        int matchedItemIndex = -1; 
        int fallbackMatchIndex = -1; 

        int count = itemCollection.Count; 

        // Return immediately with no match if there were no items in the view.
        if (count == 0)
        { 
            return -1;
        } 

        String newPrefix = prefix + newChar;

        // With an empty prefix, we'd match anything
        if (String.IsNullOrEmpty(newPrefix))
        {
            return -1; 
        }

        // Hook up the binding we will apply to each Object.  Get the 
        // PrimaryTextPath off of the attached instance and then make
        // a binding with that path. 

        BindingExpression primaryTextBinding = null;

        Object item0 = itemsControl.Items[0]; 
        boolean useXml = SystemXmlHelper.IsXmlNode(item0);

        if (useXml || !String.IsNullOrEmpty(primaryTextPath)) 
        {
            primaryTextBinding = CreateBindingExpression(itemsControl, item0, primaryTextPath); 
            TextValueBindingExpression.SetValue(itemsControl, primaryTextBinding);
        }
        boolean firstItem = true;

        wasNewCharUsed = false;

        CultureInfo cultureInfo = GetCulture(itemsControl); 

        // ISSUE: what about changing the collection while this is running? 
        for (int currentIndex = startItemIndex; currentIndex < count; )
        {
            Object item = itemCollection[currentIndex];

            if (item != null)
            { 
                String itemString = GetPrimaryText(item, primaryTextBinding, itemsControl); 
                boolean isTextSearchCaseSensitive = itemsControl.IsTextSearchCaseSensitive;

                // See if the current item matches the newPrefix, if so we can
                // stop searching and accept this item as the match.
                if (itemString != null && itemString.StartsWith(newPrefix, !isTextSearchCaseSensitive, cultureInfo))
                { 
                    // Accept the new prefix as the current prefix.
                    wasNewCharUsed = true; 
                    matchedItemIndex = currentIndex; 
                    break;
                } 

                // Find the next String that matches the last prefix.  This
                // String will be used in the case that the new prefix isn't
                // matched. This enables pressing the last character multiple 
                // times and cylcing through the set of items that match that
                // prefix. 
                // 
                // Unlike the above search, this search must start *after*
                // the currently selected item.  This search also shouldn't 
                // happen if there was no previous prefix to match against
                if (lookForFallbackMatchToo)
                {
                    if (!firstItem && prefix != String.Empty) 
                    {
                        if (itemString != null) 
                        { 
                            if (fallbackMatchIndex == -1 && itemString.StartsWith(prefix, !isTextSearchCaseSensitive, cultureInfo))
                            { 
                                fallbackMatchIndex = currentIndex;
                            }
                        }
                    } 
                    else
                    { 
                        firstItem = false; 
                    }
                } 
            }

            // Move next and wrap-around if we pass the end of the container.
            currentIndex++; 
            if (currentIndex >= count)
            { 
                currentIndex = 0; 
            }

            // Stop where we started but only after the first pass
            // through the loop -- we should process the startItem.
            if (currentIndex == startItemIndex)
            { 
                break;
            } 
        } 

        if (primaryTextBinding != null) 
        {
            // Clean up the binding for the primary text path.
            TextValueBindingExpression.ClearValue(itemsControl);
        } 

        // In the case that the new prefix didn't match anything and 
        // there was a fallback match that matched the old prefix, move 
        // to that one.
        if (matchedItemIndex == -1 && fallbackMatchIndex != -1) 
        {
            matchedItemIndex = fallbackMatchIndex;
        }

        return matchedItemIndex;
    } 

    /// <summary>
    ///     Helper function called by Editable ComboBox to search through items. 
    /// </summary>
    /*internal*/ public static int FindMatchingPrefix(ItemsControl itemsControl, String prefix)
    {
        boolean wasNewCharUsed = false; 

        return FindMatchingPrefix(itemsControl, GetPrimaryTextPath(itemsControl), 
                                  prefix, String.Empty, 0, false, /*ref*/ wasNewCharUsed); 
    }

    private void ResetTimeout()
    {
        // Called when we get some input. Start or reset the timer.
        // Queue an inactive priority work item and set its deadline. 
        if (_timeoutTimer == null)
        { 
            _timeoutTimer = new DispatcherTimer(DispatcherPriority.Normal); 
            _timeoutTimer.Tick += new EventHandler(OnTimeout);
        } 
        else
        {
            _timeoutTimer.Stop();
        } 

        // Schedule this operation to happen a certain number of milliseconds from now. 
        _timeoutTimer.Interval = TimeOut; 
        _timeoutTimer.Start();
    } 

    private void AddCharToPrefix(String newChar)
    {
        Prefix += newChar; 
        _charsEntered.Add(newChar);
    } 

    private static String GetPrimaryTextPath(ItemsControl itemsControl)
    { 
        String primaryTextPath = (String)itemsControl.GetValue(TextPathProperty);

        if (String.IsNullOrEmpty(primaryTextPath))
        { 
            primaryTextPath = itemsControl.DisplayMemberPath;
        } 
        return primaryTextPath; 
    }

    private static String GetPrimaryText(Object item, BindingExpression primaryTextBinding, DependencyObject primaryTextBindingHome)
    {
        // Order of precedence for getting Primary Text is as follows:
        // 
        // 1) PrimaryText
        // 2) PrimaryTextPath (TextSearch.TextPath or ItemsControl.DisplayMemberPath) 
        // 3) GetPlainText() 
        // 4) ToString()

        DependencyObject itemDO = item as DependencyObject;

        if (itemDO != null)
        { 
            String primaryText = (String)itemDO.GetValue(TextProperty);

            if (!String.IsNullOrEmpty(primaryText)) 
            {
                return primaryText; 
            }
        }

        // Here hopefully they've supplied a path into their Object which we can use. 
        if (primaryTextBinding != null && primaryTextBindingHome != null)
        { 
            // Take the binding that we hooked up at the beginning of the search 
            // and apply it to the current item.  Then, read the value of the
            // ItemPrimaryText property (where the binding actually lives). 
            // Try to convert the resulting Object to a String.
            primaryTextBinding.Activate(item);

            Object primaryText = primaryTextBinding.Value; 

            return ConvertToPlainText(primaryText); 
        } 

        return ConvertToPlainText(item); 
    }

    private static String ConvertToPlainText(Object o)
    { 
        FrameworkElement fe = o as FrameworkElement;

        // Try to return FrameworkElement.GetPlainText() 
        if (fe != null)
        { 
            String text = fe.GetPlainText();

            if (text != null)
            { 
                return text;
            } 
        } 

        // Try to convert the item to a String 
        return (o != null) ? o.ToString() : String.Empty;
    }

    /// <summary> 
    ///     Internal helper method that uses the same primary text lookup steps but doesn't require
    ///     the user passing in all of the bindings that we need. 
    /// </summary> 
    /// <param name="itemsControl"></param>
    /// <param name="item"></param> 
    /// <returns></returns>
    /*internal*/ public static String GetPrimaryTextFromItem(ItemsControl itemsControl, Object item)
    {
        if (item == null) 
            return String.Empty;

        BindingExpression primaryTextBinding = CreateBindingExpression(itemsControl, item, GetPrimaryTextPath(itemsControl)); 
        TextValueBindingExpression.SetValue(itemsControl, primaryTextBinding);

        String primaryText = GetPrimaryText(item, primaryTextBinding, itemsControl);

        TextValueBindingExpression.ClearValue(itemsControl);

        return primaryText;
    } 

    private static BindingExpression CreateBindingExpression(ItemsControl itemsControl, Object item, String primaryTextPath)
    { 
        Binding binding = new Binding();

        // Use xpath for xmlnodes (See Selector.PrepareItemValueBinding)
        if (SystemXmlHelper.IsXmlNode(item)) 
        {
            binding.XPath = primaryTextPath; 
            binding.Path = new PropertyPath("/InnerText"); 
        }
        else 
        {
            binding.Path = new PropertyPath(primaryTextPath);
        }

        binding.Mode = BindingMode.OneWay;
        binding.Source = null; 
        return (BindingExpression)BindingExpression.CreateUntargetedBindingExpression(itemsControl, binding); 
    }

    private void OnTimeout(Object sender, EventArgs e)
    {
        ResetState();
    } 

    private void ResetState() 
    { 
        // Reset the prefix String back to empty.
        IsActive = false; 
        Prefix = String.Empty;
        MatchedItemIndex = -1;
        if (_charsEntered == null)
        { 
            _charsEntered = new List<String>(10);
        } 
        else 
        {
            _charsEntered.Clear(); 
        }

        if(_timeoutTimer != null)
        { 
            _timeoutTimer.Stop();
        } 
        _timeoutTimer = null; 

    } 

    /// <summary>
    ///     Time until the search engine resets.
    /// </summary> 
    private TimeSpan TimeOut
    { 
        get 
        {
            // NOTE: NtUser does the following (file: windows/ntuser/kernel/sysmet.c) 
            //     gpsi->dtLBSearch = dtTime * 4;            // dtLBSearch   =  4  * gdtDblClk
            //     gpsi->dtScroll = gpsi->dtLBSearch / 5;  // dtScroll     = 4/5 * gdtDblClk
            //
            // 4 * DoubleClickSpeed seems too slow for the search 
            // So for now we'll do 2 * DoubleClickSpeed

            return TimeSpan.FromMilliseconds(SafeNativeMethods.GetDoubleClickTime() * 2); 
        }
    } 

//    #endregion

//    #region Testing API 

    // Being that this is a time-sensitive operation, it's difficult 
    // to get the timing right in a DRT.  I'll leave input testing up to BVTs here 
    // but this /*internal*/ public API is for the DRT to do basic coverage.
    private static TextSearch GetInstance(DependencyObject d) 
    {
        return EnsureInstance(d as ItemsControl);
    }

    private void TypeAKey(String c)
    { 
        DoSearch(c); 
    }

    private void CauseTimeOut()
    {
        if (_timeoutTimer != null)
        { 
            _timeoutTimer.Stop();
            OnTimeout(_timeoutTimer, EventArgs.Empty); 
        } 
    }

    /*internal*/ public String GetCurrentPrefix()
    {
        return Prefix;
    } 

//    #endregion 


//    #region Internal Accessibility API 

    /*internal*/ public static String GetPrimaryText(FrameworkElement element)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 

        String text = (String)element.GetValue(TextProperty); 

        if (text != null && text != String.Empty)
        {
            return text; 
        }

        return element.GetPlainText(); 
    }

//    #endregion

//    #region Private Fields

    private String Prefix
    { 
        get { return _prefix; } 
        set
        { 
            _prefix = value;

//#if DEBUG
            // Also need to invalidate the property CurrentPrefixProperty on the instance to which we are attached. 
            Debug.Assert(_attachedTo != null);

            _attachedTo.SetValue(CurrentPrefixProperty, _prefix); 
//#endif
        } 
    }

    private boolean IsActive
    { 
        get { return _isActive; }
        set 
        { 
            _isActive = value;

//#if DEBUG
            Debug.Assert(_attachedTo != null);

            _attachedTo.SetValue(IsActiveProperty, _isActive); 
//#endif
        } 
    } 

    private int MatchedItemIndex 
    {
        get { return _matchedItemIndex; }
        set
        { 
            _matchedItemIndex = value;
        } 
    } 

    private static CultureInfo GetCulture(DependencyObject element) 
    {
        Object o = element.GetValue(FrameworkElement.LanguageProperty);
        CultureInfo culture = null;

        if (o != null)
        { 
            XmlLanguage language = (XmlLanguage) o; 
            try
            { 
                culture = language.GetSpecificCulture();
            }
            catch (InvalidOperationException)
            { 
            }
        } 

        return culture;
    } 

    // Element to which this TextSearch instance is attached.
    private ItemsControl _attachedTo;

    // String of characters matched so far.
    private String _prefix; 

    private List<String> _charsEntered;

    private boolean _isActive;

    private int _matchedItemIndex;

    private DispatcherTimer _timeoutTimer;

//    #endregion 
}