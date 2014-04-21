package org.summer.view.widget.markup;

import java.io.StringReader;

import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.collection.Hashtable;
import org.summer.view.widget.collection.IEnumerator;

/// <summary>
    ///     An RFC3066 language tag for use in Xml markup.
    /// </summary>
    /// <remarks>
    ///     The tag may or may not have a registered CultureInfo present on the system.
    ///     This class is useful for dealing with values represented using xml:lang in XML.
    ///     Note that XML spec allows the empty String, although that is not permitted by RFC3066;
    ///      therefore, this type permits "".
    /// </remarks>
//    [TypeConverter(typeof(XmlLanguageConverter))]
    public class XmlLanguage
    {
        // There is a conscious choice here to use Hashtable rather than
        //   Dictionary<String, xmllanguage="">. Dictionary<k, t=""> offers no
        //   concurrency guarantees whatsoever.  So if we used it, we would
        //   have to take one of two implementations approaches.  Either, we
        //   would have to take a simple lock around every read and write
        //   operation, causing needless thread-contention amongst threads
        //   doing read operations.  Or we have have to use a ReaderWriterLock,
        //   which has measurable negative perf impact in simple real-world
        //   scenarios that don't have heavy thread contention.
        //
        // Hashtable is implemented so that as long as writers are protected
        //   by a lock, readers do not need to take a lock.  This eliminates
        //   the thread contention problem of the first Dictionary<k, t="">
        //   solutions.  And furthermore, it has measurable performance benefits
        //   over both of the Dictionary<k, t=""> solutions.
        private static Hashtable _cache = new Hashtable(InitialDictionarySize);
        private /*const*/static final int InitialDictionarySize = 10;   // Three for "en-us", "en", and "", plus a few more
 
        private /*const*/static final int MaxCultureDepth = 32;
        private static XmlLanguage _empty = null;
 
        private final String _lowerCaseTag;
        private CultureInfo _equivalentCulture;
        private CultureInfo _specificCulture;
        private CultureInfo _compatibleCulture;
        private int _specificity;
        private boolean _equivalentCultureFailed;  // only consult after checking _equivalentCulture == null
 
        /// <summary>
        ///     PRIVATE constructor.  It is vital that this constructor be
        ///       called ONLY from the implementation of GetLanguage().
        ///       The implementation strategy depends upon reference-equality
        ///       being a complete test for XmlLanguage-equality,
        ///       and GetLanguage's use of _cache is necessary to
        ///       guarantee that reference-equality is sufficient.
        /// </summary>
        private XmlLanguage(String lowercase)
        {
            _lowerCaseTag = lowercase;
            _equivalentCulture = null;
            _specificCulture = null;
            _compatibleCulture = null;
            _specificity = -1;
            _equivalentCultureFailed = false;
        }
 
        /// <summary>
        ///     The XmlLanguage corresponding to String.Empty, whose EquivalentCulture is
        ///        CultureInfo.InvariantCulture.
        /// </summary>
        public static XmlLanguage Empty
        {
            get
            {
                if (_empty == null)
                {
                    // We MUST NOT call the private constructor, but instead call GetLanguage()!
                    _empty = GetLanguage(String.Empty);
                }
                return _empty;
            }
        }
 
        /// <summary>
        ///     Retrive an XmlLanguage for a given RFC 3066 language String.
        /// </summary>
        /// <remarks>
        ///     The language String may be empty, or else must conform to RFC 3066 rules:
        ///     The first subtag must consist of only ASCII letters.
        ///     Additional subtags must consist of ASCII letters or numerals.
        ///     Subtags are separated by a single hyphen character.
        ///     Every subtag must be 1 to 8 characters long.
        ///     No leading or trailing hyphens are permitted.
        /// </remarks>
        /// <exception cref="ArgumentNullException">
        ///     ietfLanguageTag parameter is null
        /// </exception>
        /// <exception cref="ArgumentException">
        ///     ietfLanguageTag is non-empty, but does not conform to the syntax specified in RFC 3066.
        /// </exception>
        public static XmlLanguage GetLanguage(String ietfLanguageTag)
        {
            XmlLanguage language;
 
            if (ietfLanguageTag == null)
                throw new ArgumentNullException("ietfLanguageTag");
 
            String lowercase = AsciiToLower(ietfLanguageTag);   // throws on non-ascii
 
            language = (XmlLanguage) _cache[lowercase];
            if (language == null)
            {
                ValidateLowerCaseTag(lowercase);            // throws on RFC 3066 validation failure
                lock (_cache.SyncRoot)
                {
                    // Double-check that it is still the case that language-tag is not
                    //  present in cache.  Without this double-check, there would
                    //  be some risk that clients on two different threads might
                    //  get two different XmlLanguage instances for the same language
                    //  tag.
                    language = (XmlLanguage) _cache[lowercase];
                    if (language == null)
                    {
                        _cache[lowercase] = language = new XmlLanguage(lowercase);
                    }
                }
            }
 
            return language;
         }
 
  
  
       /// <summary>
        ///     The RFC 3066 String.
        /// </summary>
        /// <remarks>
        ///     MAY return a normalized version of the originally-specified String.
        ///     MAY return the empty String.
        /// </remarks>
        public String IetfLanguageTag
        {
            get
            {
                return _lowerCaseTag;
            }
        }
  
        /// <summary>
        ///     Returns IetfLanguageTag.
        /// </summary>
        public override String ToString()
        {
            return IetfLanguageTag;
        }
 
  
 
        /// <summary>
        ///     Returns a CultureInfo if and only if one is registered matching IetfLanguageTag
        /// </summary>
        /// <exception cref="InvalidOperationException">
        ///     There is no registered CultureInfo with given IetfLanguageTag.
        /// </exception>
        public CultureInfo GetEquivalentCulture()
        {
            if (_equivalentCulture == null)
            {
                try
                {
                    // Even if we previously failed to find an EquivalentCulture, we retry, if only to
                    //   capture inner exception.
                    _equivalentCulture = SafeSecurityHelper.GetCultureInfoByIetfLanguageTag(_lowerCaseTag);
                }
                catch (ArgumentException e)
                {
                    _equivalentCultureFailed = true;
                    throw new InvalidOperationException(SR.Get(SRID.XmlLangGetCultureFailure, _lowerCaseTag), e);
                }
            }
 
            return _equivalentCulture;
        }
  
        /// <summary>
        ///     Finds the most-closely-related non-neutral registered CultureInfo, if one is available.
        /// </summary>
        /// <returns>
        ///     A non-Neutral CultureInfo.
        /// </returns>
        /// <exception cref="InvalidOperationException">
        ///    There is no related non-Neutral CultureInfo registered.
        /// </exception>
        /// <remarks>
        ///    Will return CultureInfo.InvariantCulture if-and-only-if this.Equals(XmlLanguage.Empty).
        ///    Finds the registered CultureInfo matching the longest-possible prefix of this XmlLanguage.
        ///       If that registered CultureInfo is Neutral, then relies on
        ///       CultureInfo.CreateSpecificCulture() to map from a Neutral CultureInfo to a Specific one.
        /// </remarks>
        public CultureInfo GetSpecificCulture()
        {
            if (_specificCulture == null)
            {
                if (_lowerCaseTag.Length == 0)
                {
                    _specificCulture = GetEquivalentCulture();
                }
                else
                {
                    CultureInfo culture = GetCompatibleCulture();
  
                    if (culture.IetfLanguageTag.Length == 0)
                    {
                        throw new InvalidOperationException(SR.Get(SRID.XmlLangGetSpecificCulture, _lowerCaseTag));
                    }
  
                    if (!culture.IsNeutralCulture)
                    {
                        _specificCulture = culture;
                    }
                    else
                    {
                        try
                        {
                            // note that it's important that we use culture.Name, not culture.IetfLanguageTag, here
                            culture = CultureInfo.CreateSpecificCulture(culture.Name);
                            _specificCulture = SafeSecurityHelper.GetCultureInfoByIetfLanguageTag(culture.IetfLanguageTag);
                        }
                        catch (ArgumentException e)
                        {
                            throw new InvalidOperationException(SR.Get(SRID.XmlLangGetSpecificCulture, _lowerCaseTag), e);
                        }
                    }
                }
            }
 
            return _specificCulture;
        }
 
        /// <summary>
        ///     Finds a registered CultureInfo corresponding to the IetfLanguageTag, or the longest
        ///       sequence of leading subtags for which we have a registered CultureInfo.
        /// </summary>
        [FriendAccessAllowed]
        internal CultureInfo GetCompatibleCulture()
        {
            if (_compatibleCulture == null)
            {
                CultureInfo culture = null;
  
                if (!TryGetEquivalentCulture(out culture))
                {
                    String languageTag = IetfLanguageTag;
 
                    do
                    {
                        languageTag = Shorten(languageTag);
                        if (languageTag == null)
                        {
                            // Should never happen, because GetCultureinfoByIetfLanguageTag("") should
                            //  return InvariantCulture!
                            culture =  CultureInfo.InvariantCulture;
                        }
                        else
                        {
                            try
                            {
                                culture = SafeSecurityHelper.GetCultureInfoByIetfLanguageTag(languageTag);
                            }
                            catch (ArgumentException)
                            {
                            }
                        }
  
                    }
                    while (culture == null);
                }
                _compatibleCulture = culture;
            }
            return _compatibleCulture;
        }
 
        /// <summary>
        ///     Checks to see if a second XmlLanguage is included in range of languages specified
        ///       by this XmlLanguage.
        /// </summary>
        /// <remarks>
        ///    In addition to looking for prefix-matches in IetfLanguageTags, the implementation
        ///      also considers the Parent relationships among registered CultureInfo's.  So, in
        ///      particular, this routine will report that "zh-hk" is in the range specified by
        ///      "zh-hant", even though the latter is not a prefix of the former. And because it
        ///      doesn't restrict itself to traversing CultureInfo.Parent, it will also report that
        ///      "sr-latn-sp" is in the range covered by "sr-latn".  (Note that "sr-latn" does
        ///      does not have a registered CultureInfo.)
        /// </remarks>
        [FriendAccessAllowed]
        internal boolean RangeIncludes(XmlLanguage language)
        {
 
            if (this.IsPrefixOf(language.IetfLanguageTag))
            {
                return true;
            }
  
            // We still need to do CultureInfo.Parent-aware processing, to cover, for example,
            //  the case that "zh-hant" includes "zh-hk".
            return RangeIncludes(language.GetCompatibleCulture());
        }
 
        /// <summary>
        ///     Checks to see if a CultureInfo is included in range of languages specified
        ///       by this XmlLanguage.
        /// </summary>
        /// <remarks>
        ///    In addition to looking for prefix-matches in IetfLanguageTags, the implementation
        ///      also considers the Parent relationships among CultureInfo's.  So, in
        ///      particular, this routine will report that "zh-hk" is in the range specified by
        ///      "zh-hant", even though the latter is not a prefix of the former.   And because it
        ///      doesn't restrict itself to traversing CultureInfo.Parent, it will also report that
        ///      "sr-latn-sp" is in the range covered by "sr-latn".  (Note that "sr-latn" does
        ///      does not have a registered CultureInfo.)
        /// </remarks>
        internal boolean RangeIncludes(CultureInfo culture)
        {
            if (culture == null)
            {
                throw new ArgumentNullException("culture");
            }
 
            // no need for special cases for InvariantCulture, which has IetfLanguageTag == ""
  
            // Limit how far we'll walk up the hierarchy to avoid security threat.
            // We could check for cycles (e.g., culture.Parent.Parent == culture)
            // but in in the case of non-malicious code there should be no cycles,
            // whereas in malicious code, checking for cycles doesn't mitigate the
            // threat; one could always implement Parent such that it always returns
            // a new CultureInfo for which Equals always returns false.
            for (int i = 0; i < MaxCultureDepth; ++i)
            {
                // Note that we don't actually insist on a there being CultureInfo corresponding
                //  to familyMapLanguage.
                // The use of language.StartsWith() catches, for example,the case
                //  where this="sr-latn", and culture.IetfLanguageTag=="sr-latn-sp".
                // In such a case, culture.Parent.IetfLanguageTag=="sr".
                //  (There is no registered CultureInfo with IetfLanguageTag=="sr-latn".)
                if (this.IsPrefixOf(culture.IetfLanguageTag))
                {
                    return true;
                }
 
                CultureInfo parentCulture = culture.Parent;
 
                if (parentCulture == null
                        || parentCulture.Equals(CultureInfo.InvariantCulture)
                        || parentCulture == culture)
                    break;
  
                culture = parentCulture;
            }
  
            return false;
        }
 
        /// <summary>
        ///     Compute a measure of specificity of the XmlLanguage, considering both
        ///       subtag length and the CultureInfo.Parent hierarchy.
        /// </summary>
        internal int GetSpecificity()
        {
            if (_specificity < 0)
            {
                CultureInfo compatibleCulture = GetCompatibleCulture();
  
                int specificity = GetSpecificity(compatibleCulture, MaxCultureDepth);
  
                if (compatibleCulture != _equivalentCulture)
                {
                    specificity += GetSubtagCount(_lowerCaseTag) - GetSubtagCount(compatibleCulture.IetfLanguageTag);
                }
 
                _specificity = specificity;
            }
 
            return _specificity;
        }
 
        /// <summary>
        ///     Helper function for instance-method GetSpecificity.
        /// </summary>
        /// <remarks>
        ///     To avoid a security threat, caller provides limit on how far we'll
        ///       walk up the CultureInfo hierarchy.
        ///       We could check for cycles (e.g., culture.Parent.Parent == culture)
        ///       but in in the case of non-malicious code there should be no cycles,
        ///       whereas in malicious code, checking for cycles doesn't mitigate the
        ///       threat; one could always implement Parent such that it always returns
        ///       a new CultureInfo for which Equals always returns false.
        /// </remarks>
        private static int GetSpecificity(CultureInfo culture, int maxDepth)
        {
            int specificity = 0;
  
            if (maxDepth != 0 && culture != null)
            {
                String languageTag = culture.IetfLanguageTag;
 
                if (languageTag.Length > 0)
                {
                    specificity = Math.Max(GetSubtagCount(languageTag), 1 + GetSpecificity(culture.Parent, maxDepth - 1));
                }
            }
  
            return specificity;
        }
 
        private static int GetSubtagCount(String languageTag)
        {
            int tagLength = languageTag.Length;
            int subtagCount = 0;
  
            if (tagLength > 0)
            {
                subtagCount = 1;
 
                for (int i = 0; i < tagLength; i++)
                {
                    if (languageTag[i] == '-')
                    {
                        subtagCount += 1;
                    }
 
                }
            }
 
            return subtagCount;
        }
 
        internal MatchingLanguageCollection MatchingLanguages
        {
            get
            {
                return new MatchingLanguageCollection(this);
            }
        }
  
        // collection of matching languages, ordered from most specific to least specific, starting
        //  with the start language and ending with invariant language ("")
        internal struct MatchingLanguageCollection : IEnumerable<xmllanguage>, IEnumerable
        {
            private XmlLanguage _start;
            public MatchingLanguageCollection(XmlLanguage start)
            {
                _start = start;
            }
 
  
            // strongly typed, avoids boxing
            public MatchingLanguageEnumerator GetEnumerator()
            {
                return new MatchingLanguageEnumerator(_start);
            }
 
            // strongly typed, boxes
            IEnumerator<xmllanguage> IEnumerable<xmllanguage>.GetEnumerator()
            {
                return GetEnumerator();
            }
  
            // weakly typed, boxed
            IEnumerator IEnumerable.GetEnumerator()
            {
                return GetEnumerator();
            }
        }
  
        internal struct MatchingLanguageEnumerator : IEnumerator<xmllanguage>, IEnumerator
        {
            private readonly XmlLanguage _start;
            private XmlLanguage _current;
            private boolean _atStart;
            private boolean _pastEnd;
            private int _maxCultureDepth;
  
            public MatchingLanguageEnumerator(XmlLanguage start)
            {
                _start = start;
                _current = start;
                _pastEnd = false;
                _atStart = true;
                _maxCultureDepth = XmlLanguage.MaxCultureDepth;
            }
  
            public void Reset()
            {
                _current = _start;
                _pastEnd = false;
                _atStart = true;
                _maxCultureDepth = XmlLanguage.MaxCultureDepth;
            }
 
            public XmlLanguage Current
            {
                get
                {
                    if (_atStart)
                    {
                        throw new InvalidOperationException(SR.Get(SRID.Enumerator_NotStarted));
                    }
                    if (_pastEnd)
                    {
                        throw new InvalidOperationException(SR.Get(SRID.Enumerator_ReachedEnd));
                    }
  
                    return _current;
                }
            }
  
            public boolean MoveNext()
            {
                if (_atStart)
                {
                    _atStart = false;
                    return true;
                }
                else if (_current.IetfLanguageTag.Length == 0)
                {
                    _atStart = false;
                    _pastEnd = true;
                    return false;
                }
                else
                {
                    XmlLanguage prefixLanguage = _current.PrefixLanguage;
                    CultureInfo culture = null;
  
                    if (_maxCultureDepth > 0)
                    {
                        if (_current.TryGetEquivalentCulture(out culture))
                        {
                            culture = culture.Parent;
                        }
                        else
                        {
                            culture = null;
                        }
                    }
  
                    if (culture == null)
                    {
                        _current = prefixLanguage;
                        _atStart = false;
                        return true;
                    }
                    else
                    {
                        // We MUST NOT call the private constructor, but instead call GetLanguage()!
                        XmlLanguage parentLanguage = XmlLanguage.GetLanguage(culture.IetfLanguageTag);
  
                        if (parentLanguage.IsPrefixOf(prefixLanguage.IetfLanguageTag))
                        {
                            _current = prefixLanguage;
                            _atStart = false;
                            return true;
                        }
                        else
                        {
                            // We definitely do this if
                            //   prefixLanguage.IsPrefixOf(parentLanguage.IetfLanguageTag)
                            // But if this is not true, then we are faced with a problem with
                            //   divergent paths between prefix-tags and parent-CultureInfos.
                            //   This code makes the arbitrary decision to follow the parent
                            //   path when faced with this divergence.
                            //
  
 
  
 
                            //
                            _maxCultureDepth -= 1;
                            _current = parentLanguage;
                            _atStart = false;
                            return true;
                        }
                    }
                }
            }
 
            Object IEnumerator.Current
            {
                get
                {
                    return Current;
                }
            }
 
            void IDisposable.Dispose() { }
 
        }
 
  
  
        /// <remarks>
        ///     Differs from calling String.StartsWith, because each subtag must match
        ///         in its entirety.
        ///     Note that this routine returns true if the tags match.
        /// </remarks>
        private boolean IsPrefixOf(String longTag)
        {
            String prefix = IetfLanguageTag;
  
 
            // if we fail a simple String-prefix test, we know we don't have a subtag-prefix.
            if(!longTag.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }
 
            // String-prefix test passed -- now determine if we're at a subtag-boundary
            return (prefix.Length == 0 || prefix.Length == longTag.Length || longTag[prefix.Length] == '-');
        }
  
        private boolean TryGetEquivalentCulture(out CultureInfo culture)
        {
            culture = null;
  
            if (_equivalentCulture == null && !_equivalentCultureFailed)
            {
                try
                {
                    GetEquivalentCulture();
                }
                catch (InvalidOperationException)
                {
                }
            }
  
            culture = _equivalentCulture;
 
            return (culture != null);
        }
 
        private XmlLanguage PrefixLanguage
        {
            get
            {
                String prefix = Shorten(IetfLanguageTag);   // can return null
 
                // We MUST NOT call the private constructor, but instead call GetLanguage()!
                return XmlLanguage.GetLanguage(prefix);     // throws on null
            }
        }
  
        /// <summary>
        ///     Shorten a well-formed RFC 3066 String by one subtag.
        /// </summary>
        /// <remarks>
        ///     Shortens "" into null.
        /// </remarks>
        private static String Shorten(String languageTag)
        {
            if (languageTag.Length == 0)
            {
                return null;
            }
 
            int i = languageTag.Length - 1;
 
            while (languageTag[i] != '-' && i > 0)
            {
                i -= 1;
            }
  
            // i now contains of index of first character to be omitted from smaller tag
            return languageTag.Substring (0, i);
        }
 
 
 
  
        /// <summary>
        ///     Throws an ArgumentException (or ArgumentNullException) is not the empty
        ///       String, and does not conform to RFC 3066.
        /// </summary>
        /// <remarks>
        ///     It is assumed that caller has already converted to lower-case.
        ///     The language String may be empty, or else must conform to RFC 3066 rules:
        ///     The first subtag must consist of only ASCII letters.
        ///     Additional subtags must consist ASCII letters or numerals.
        ///     Subtags are separated by a single hyphen character.
        ///     Every subtag must be 1 to 8 characters long.
        ///     No leading or trailing hyphens are permitted.
        /// </remarks>
        /// <param name="ietfLanguageTag">
        /// <exception cref="ArgumentNullException">tag is NULL.</exception>
        /// <exception cref="ArgumentException">tag is non-empty, but does not conform to RFC 3066.</exception>
        private static void ValidateLowerCaseTag(String ietfLanguageTag)
        {
            if (ietfLanguageTag == null)
            {
                throw new ArgumentNullException("ietfLanguageTag");
            }
  
            if (ietfLanguageTag.Length > 0)
            {
                using (StringReader reader = new StringReader(ietfLanguageTag))
                {
                    int i;
  
                    i = ParseSubtag(ietfLanguageTag, reader, /* isPrimary */ true);
                    while (i != -1)
                    {
                        i = ParseSubtag(ietfLanguageTag, reader, /* isPrimary */ false);
                    }
                }
            }
        }
  
        // returns the character which terminated the subtag -- either '-' or -1 for
        //  end of String.
        // throws exception on improper formatting
        // It is assumed that caller has already converted to lower-case.
        static private int ParseSubtag(String ietfLanguageTag, StringReader reader, boolean isPrimary)
        {
            int c;
            boolean ok;
            const int maxCharsPerSubtag = 8;
  
            c = reader.Read();
  
            ok = IsLowerAlpha(c);
            if (!ok && !isPrimary)
                ok = IsDigit(c);
  
            if (!ok)
            {
                ThrowParseException(ietfLanguageTag);
            }
  
            int charsRead = 1;
            for (;;)
            {
                c = reader.Read();
                charsRead++;
  
                ok = IsLowerAlpha(c);
                if (!ok && !isPrimary)
                {
                    ok = IsDigit(c);
                }
 
                if (!ok)
                {
                    if (c == -1 || c == '-')
                    {
                        return c;
                    }
                    else
                    {
                        ThrowParseException(ietfLanguageTag);
                    }
                }
                else
                {
                    if (charsRead > maxCharsPerSubtag)
                    {
                        ThrowParseException(ietfLanguageTag);
                    }
                }
            }
        }
  
        static private boolean IsLowerAlpha(int c)
        {
            return (c >= 'a' && c <= 'z');
        }
 
        static private boolean IsDigit(int c)
        {
            return c >= '0' && c <= '9';
        }
  
        static private void ThrowParseException(String ietfLanguageTag)
        {
             throw new ArgumentException(SR.Get(SRID.XmlLangMalformed, ietfLanguageTag), "ietfLanguageTag");
        }
 
        // throws if there is a non-7-bit ascii character
        static private String AsciiToLower(String tag)
        {
            int length = tag.Length;
 
            for (int i = 0; i < length; i++)
            {
                if (tag[i] > 127)
                {
                    ThrowParseException(tag);
                }
            }
  
            return tag.ToLowerInvariant();
        }
 
    }