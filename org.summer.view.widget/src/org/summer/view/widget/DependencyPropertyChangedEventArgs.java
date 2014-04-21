package org.summer.view.widget;

import org.summer.view.widget.DependencyObject.RequestFlags;

//[FriendAccessAllowed] // Built into Base, also used by Core & Framework.
	enum OperationType //: byte 
	{ 
	  Unknown                  ,//   = 0,
	  AddChild                 ,//   = 1, 
	  RemoveChild              ,//   = 2,
	  Inherit                  ,//   = 3,
	  ChangeMutableDefaultValue ,//  = 4,
	} 
/// <summary>
  ///     Provides data for the various property changed events. 
  /// </summary> 
  public class DependencyPropertyChangedEventArgs
  { 
  	
//      #region Constructors

      /// <summary>
      ///     Initializes a new instance of the DependencyPropertyChangedEventArgs class. 
      /// </summary>
      /// <param name="property"> 
      ///     The property whose value changed. 
      /// </param>
      /// <param name="oldValue"> 
      ///     The value of the property before the change.
      /// </param>
      /// <param name="newValue">
      ///     The value of the property after the change. 
      /// </param>
      public DependencyPropertyChangedEventArgs(DependencyProperty property, Object oldValue, Object newValue) 
      { 
          _property = property;
          _metadata = null; 
          _oldEntry = new EffectiveValueEntry(property);
          _newEntry = _oldEntry;
          _oldEntry.Value = oldValue;
          _newEntry.Value = newValue; 

          _flags = 0; 
          _operationType = OperationType.Unknown; 
          IsAValueChange        = true;
      } 

//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
      /*internal*/ public DependencyPropertyChangedEventArgs(DependencyProperty property, PropertyMetadata metadata, Object oldValue, Object newValue)
      { 
          _property = property;
          _metadata = metadata; 
          _oldEntry = new EffectiveValueEntry(property); 
          _newEntry = _oldEntry;
          _oldEntry.Value = oldValue; 
          _newEntry.Value = newValue;

          _flags = 0;
          _operationType = OperationType.Unknown; 
          IsAValueChange        = true;
      } 

      /*internal*/ public  DependencyPropertyChangedEventArgs(DependencyProperty property, PropertyMetadata metadata, Object value)
      { 
          _property = property;
          _metadata = metadata;
          _oldEntry = new EffectiveValueEntry(property);
          _oldEntry.Value = value; 
          _newEntry = _oldEntry;

          _flags = 0; 
          _operationType = OperationType.Unknown;
          IsASubPropertyChange = true; 
      }

      /*internal*/ public  DependencyPropertyChangedEventArgs(
          DependencyProperty  property, 
          PropertyMetadata    metadata,
          boolean                isAValueChange, 
          EffectiveValueEntry oldEntry, 
          EffectiveValueEntry newEntry,
          OperationType       operationType) 
      {
          _property             = property;
          _metadata             = metadata;
          _oldEntry             = oldEntry; 
          _newEntry             = newEntry;

          _flags = 0; 
          _operationType        = operationType;
          IsAValueChange        = isAValueChange; 

          // This is when a mutable default is promoted to a local value. On this operation mutable default
          // value acquires a freezable context. However this value promotion operation is triggered
          // whenever there has been a sub property change to the mutable default. Eg. Adding a TextEffect 
          // to a TextEffectCollection instance which is the mutable default. Since we missed the sub property
          // change due to this add, we flip the IsASubPropertyChange bit on the following change caused by 
          // the value promotion to coalesce these operations. 
          IsASubPropertyChange = (operationType == OperationType.ChangeMutableDefaultValue);
      } 

//      #endregion Constructors
//
//
//      #region Properties

      /// <summary> 
      ///     The property whose value changed.
      /// </summary> 
      public DependencyProperty Property
      {
          get { return _property; }
      } 

      /// <summary> 
      ///     Whether or not this change indicates a change to the property value 
      /// </summary>
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework. 
      /*internal*/public boolean IsAValueChange
      {
          get { return ReadPrivateFlag(PrivateFlags.IsAValueChange); }
          set { WritePrivateFlag(PrivateFlags.IsAValueChange, value); } 
      }

      /// <summary> 
      ///     Whether or not this change indicates a change to the subproperty
      /// </summary> 
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
      /*internal*/ public boolean IsASubPropertyChange
      {
          get { return ReadPrivateFlag(PrivateFlags.IsASubPropertyChange); } 
          set { WritePrivateFlag(PrivateFlags.IsASubPropertyChange, value); }
      } 

      /// <summary>
      ///     Metadata for the property 
      /// </summary>
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
      /*internal*/public PropertyMetadata Metadata
      { 
          get { return _metadata; }
      } 

      /// <summary>
      ///     Says what operation caused this property change 
      /// </summary>
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
      /*internal*/public OperationType OperationType
      { 
          get { return _operationType; }
      } 


      /// <summary> 
      ///     The old value of the property.
      /// </summary>
      public Object OldValue
      { 
          get
          { 
              EffectiveValueEntry oldEntry = OldEntry.GetFlattenedEntry(RequestFlags.FullyResolved); 
              if (oldEntry.IsDeferredReference)
              { 
                  // The value for this property was meant to come from a dictionary
                  // and the creation of that value had been deferred until this
                  // time for better performance. Now is the time to actually instantiate
                  // this value by querying it from the dictionary. Once we have the 
                  // value we can actually replace the deferred reference marker
                  // with the actual value. 
                  oldEntry.Value = ((DeferredReference) oldEntry.Value).GetValue(oldEntry.BaseValueSourceInternal); 
              }

              return oldEntry.Value;
          }
      }

      /// <summary>
      ///     The entry for the old value (contains value and all modifier info) 
      /// </summary> 
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
      /*internal*/ EffectiveValueEntry OldEntry 
      {
          get { return _oldEntry; }
      }

      /// <summary>
      ///     The source of the old value 
      /// </summary> 
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
      /*internal*/ BaseValueSourceInternal OldValueSource 
      {
          get { return _oldEntry.BaseValueSourceInternal; }
      }

      /// <summary>
      ///     Says if the old value was a modified value (coerced, animated, expression) 
      /// </summary> 
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
      /*internal*/ boolean IsOldValueModified 
      {
          get { return _oldEntry.HasModifiers; }
      }

      /// <summary>
      ///     Says if the old value was a deferred value 
      /// </summary> 
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework.
      /*internal*/ boolean IsOldValueDeferred 
      {
          get { return _oldEntry.IsDeferredReference; }
      }

      /// <summary>
      ///     The new value of the property. 
      /// </summary> 
      public Object NewValue
      { 
          get
          {
              EffectiveValueEntry newEntry = NewEntry.GetFlattenedEntry(RequestFlags.FullyResolved);
              if (newEntry.IsDeferredReference) 
              {
                  // The value for this property was meant to come from a dictionary 
                  // and the creation of that value had been deferred until this 
                  // time for better performance. Now is the time to actually instantiate
                  // this value by querying it from the dictionary. Once we have the 
                  // value we can actually replace the deferred reference marker
                  // with the actual value.
                  newEntry.Value = ((DeferredReference) newEntry.Value).GetValue(newEntry.BaseValueSourceInternal);
              } 

              return newEntry.Value; 
          } 
      }

      /// <summary>
      ///     The entry for the new value (contains value and all modifier info)
      /// </summary>
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework. 
      /*internal*/ EffectiveValueEntry NewEntry
      { 
          get { return _newEntry; } 
      }

      /// <summary>
      ///     The source of the new value
      /// </summary>
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework. 
      /*internal*/ BaseValueSourceInternal NewValueSource
      { 
          get { return _newEntry.BaseValueSourceInternal; } 
      }

      /// <summary>
      ///     Says if the new value was a modified value (coerced, animated, expression)
      /// </summary>
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework. 
      /*internal*/ boolean IsNewValueModified
      { 
          get { return _newEntry.HasModifiers; } 
      }

      /// <summary>
      ///     Says if the new value was a deferred value
      /// </summary>
//      [FriendAccessAllowed] // Built into Base, also used by Core & Framework. 
      /*internal*/ boolean IsNewValueDeferred
      { 
          get { return _newEntry.IsDeferredReference; } 
      }

//      #endregion Properties

      /// <summary>
      /// </summary> 
      public int GetHashCode()
      { 
          return super.GetHashCode(); 
      }

      /// <summary>
      /// </summary>
      public boolean Equals(Object obj)
      { 
          return Equals((DependencyPropertyChangedEventArgs)obj);
      } 

      /// <summary>
      /// </summary> 
      public boolean Equals(DependencyPropertyChangedEventArgs args)
      {
          return (_property == args._property &&
                  _metadata == args._metadata && 
                  _oldEntry.Value == args._oldEntry.Value &&
                  _newEntry.Value == args._newEntry.Value && 
                  _flags == args._flags && 
                  _oldEntry.BaseValueSourceInternal == args._oldEntry.BaseValueSourceInternal &&
                  _newEntry.BaseValueSourceInternal == args._newEntry.BaseValueSourceInternal && 
                  _oldEntry.HasModifiers == args._oldEntry.HasModifiers &&
                  _newEntry.HasModifiers == args._newEntry.HasModifiers &&
                  _oldEntry.IsDeferredReference == args._oldEntry.IsDeferredReference &&
                  _newEntry.IsDeferredReference == args._newEntry.IsDeferredReference && 
                  _operationType == args._operationType);
      } 

      /// <summary>
      /// </summary> 
      public static boolean operator ==(DependencyPropertyChangedEventArgs left, DependencyPropertyChangedEventArgs right)
      {
          return left.Equals(right);
      } 

      /// <summary> 
      /// </summary> 
      public static boolean operator !=(DependencyPropertyChangedEventArgs left, DependencyPropertyChangedEventArgs right)
      { 
          return !left.Equals(right);
      }

//      #region PrivateMethods 

      private void WritePrivateFlag(PrivateFlags bit, boolean value) 
      { 
          if (value)
          { 
              _flags |= bit;
          }
          else
          { 
              _flags &= ~bit;
          } 
      } 

      private boolean ReadPrivateFlag(PrivateFlags bit) 
      {
          return (_flags & bit) != 0;
      }

//      #endregion PrivateMethods
//
//      #region PrivateDataStructures 

      enum PrivateFlags //: byte 
      {
          IsAValueChange       ,// = 0x01,
          IsASubPropertyChange ,//  = 0x02,
      } 

//      #endregion PrivateDataStructures 
//
//      #region Data

      private DependencyProperty  _property;
      private PropertyMetadata    _metadata;

      private PrivateFlags        _flags; 

      private EffectiveValueEntry _oldEntry; 
      private EffectiveValueEntry _newEntry; 

      private OperationType       _operationType; 

//      #endregion Data
  }
 
