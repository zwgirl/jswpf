package org.summer.view.window;

import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.ResourceKey;
import org.summer.view.widget.Type;
import org.summer.view.widget.model.ISupportInitialize;
import org.summer.view.widget.reflection.Assembly;

/// <summary> The TemplateKey Object is used as the resource key for data templates</summary> 
//[TypeConverter(typeof(TemplateKeyConverter))]
public abstract class TemplateKey extends ResourceKey implements ISupportInitialize
{
  /// <summary> Constructor (called by derived classes only) </summary> 
  protected TemplateKey(TemplateType templateType)
  { 
      _dataType = null;   // still needs to be initialized 
      _templateType = templateType;
  } 

  /// <summary> Constructor (called by derived classes only) </summary>
  protected TemplateKey(TemplateType templateType, Object dataType)
  { 
      Exception ex = ValidateDataType(dataType, "dataType");
      if (ex != null) 
          throw ex; 

      _dataType = dataType; 
      _templateType = templateType;
  }

//#region ISupportInitialize 

  /// <summary>Begin Initialization</summary> 
  public void /*ISupportInitialize.*/BeginInit() 
  {
      _initializing = true; 
  }

  /// <summary>End Initialization, verify that /*internal*/ public state is consistent</summary>
  public void /*ISupportInitialize.*/EndInit() 
  {
      if (_dataType == null) 
      { 
          throw new InvalidOperationException(SR.Get(SRID.PropertyMustHaveValue, "DataType", this.GetType().Name));
      } 

      _initializing = false;
  }

//#endregion ISupportInitialize

  /// <summary> 
  /// The type for which the template is designed.  This is either
  /// a Type (for Object data), or a String (for XML data).  In the latter 
  /// case the String denotes the XML tag name.
  /// </summary>
  public Object DataType
  { 
      get { return _dataType; }
      set 
      { 
          if (!_initializing)
              throw new InvalidOperationException(SR.Get(SRID.PropertyIsInitializeOnly, "DataType", this.GetType().Name)); 
          if (_dataType != null && value != _dataType)
              throw new InvalidOperationException(SR.Get(SRID.PropertyIsImmutable, "DataType", this.GetType().Name));

          Exception ex = ValidateDataType(value, "value"); 
          if (ex != null)
              throw ex; 

          _dataType = value;
      } 
  }

  /// <summary> Override of Object.GetHashCode() </summary>
  public /*override*/ int GetHashCode() 
  {
      // note that the hash code can change, but only during intialization 
      // and only once (DataType can only be changed once, from null to 
      // non-null, and that can only happen during [Begin/End]Init).
      // Technically this is still a violation of the "constant during 
      // lifetime" rule, however in practice this is acceptable.  It is
      // very unlikely that someone will put a TemplateKey into a hashtable
      // before it is initialized.

      int hashcode = (int)_templateType;

      if (_dataType != null) 
      {
          hashcode += _dataType.GetHashCode(); 
      }

      return hashcode;
  } 

  /// <summary> Override of Object.Equals() </summary> 
  public /*override*/ boolean Equals(Object o) 
  {
      TemplateKey key = o as TemplateKey; 
      if (key != null)
      {
          return  _templateType == key._templateType &&
                  Object.Equals(_dataType, key._dataType); 
      }
      return false; 
  } 

  /// <summary> Override of Object.ToString() </summary> 
  public /*override*/ String ToString()
  {
      Type type = DataType as Type;
      return (DataType != null) 
              ?   String.Format(TypeConverterHelper.InvariantEnglishUS, "{0}({1})",
                              this.GetType().Name, DataType) 
              :   String.Format(TypeConverterHelper.InvariantEnglishUS, "{0}(null)", 
                              this.GetType().Name);
  } 

  /// <summary>
  ///     Allows SystemResources to know which assembly the template might be defined in.
  /// </summary> 
  public /*override*/ Assembly Assembly
  { 
      get 
      {
          Type type = _dataType as Type; 
          if (type != null)
          {
              return type.Assembly;
          } 

          return null; 
      } 
  }

  /// <summary> The different types of templates that use TemplateKey </summary>
  public enum TemplateType
  {
      /// <summary> DataTemplate </summary> 
      DataTemplate,
      /// <summary> TableTemplate </summary> 
      TableTemplate, 
  }

  // Validate against these rules
  //  1. dataType must not be null (except at initialization, which is tested at EndInit)
  //  2. dataType must be either a Type (Object data) or a String (XML tag name)
  //  3. dataType cannot be typeof(Object) 
  /*internal*/ public static Exception ValidateDataType(Object dataType, String argName)
  { 
      Exception result = null; 

      if (dataType == null) 
      {
          result = new ArgumentNullException(argName);
      }
      else if (!(dataType instanceof Type) && !(dataType instanceof String)) 
      {
          result = new ArgumentException(/*SR.Get(SRID.MustBeTypeOrString, dataType.GetType().Name),*/ argName); 
      } 
      else if (typeof(Object).Equals(dataType))
      { 
          result = new ArgumentException(/*SR.Get(SRID.DataTypeCannotBeObject), */argName);
      }

      return result; 
  }

  Object _dataType; 
  TemplateType _templateType;
  boolean _initializing; 
}