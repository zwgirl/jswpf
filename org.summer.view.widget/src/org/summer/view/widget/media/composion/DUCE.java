package org.summer.view.widget.media.composion;

import org.summer.view.widget.Point;
import org.summer.view.widget.Rect;
import org.summer.view.widget.Size;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.media.Color;
import org.summer.view.window.interop.IntPtr;
import org.summer.view.window.interop.WindowMessage;

/*internal*/public class DUCE
	{
		/*internal*/ static class MilMessage
		{
			/*internal*/ enum Type
			{
				Invalid,
				SyncFlushReply,
				Caps ,//= 4,
				PartitionIsZombie ,//= 6,
				SyncModeStatus ,//= 9,
				Presented,
				BadPixelShader ,//= 16,
				ForceDWORD ,//= -1
			}
//			[StructLayout(LayoutKind.Explicit, Pack = 1)]
			/*internal*/ class CapsData
			{
//				[FieldOffset(0)]
				/*internal*/ int CommonMinimumCaps;
				//[FieldOffset(4)]
				/*internal*/ uint DisplayUniqueness;
				//[FieldOffset(8)]
				/*internal*/ MilGraphicsAccelerationCaps Caps;
			}
//			[StructLayout(LayoutKind.Explicit, Pack = 1)]
			/*internal*/ class PartitionIsZombieStatus
			{
				//[FieldOffset(0)]
				/*internal*/ int HRESULTFailureCode;
			}
//			[StructLayout(LayoutKind.Explicit, Pack = 1)]
			/*internal*/ class SyncModeStatus
			{
				////[FieldOffset(0)]
				/*internal*/ int Enabled;
			}
//			[StructLayout(LayoutKind.Explicit, Pack = 1)]
			/*internal*/ class Presented
			{
				//[FieldOffset(0)]
				/*internal*/ MIL_PRESENTATION_RESULTS PresentationResults;
				//[FieldOffset(4)]
				/*internal*/ int RefreshRate;
				//[FieldOffset(8)]
				/*internal*/ long PresentationTime;
			}
//			[StructLayout(LayoutKind.Explicit, Pack = 1)]
			/*internal*/ class Message
			{
//				//[FieldOffset(0)]
				/*internal*/ DUCE.MilMessage.Type Type;
//				//[FieldOffset(4)]
				/*internal*/ int Reserved;
//				//[FieldOffset(8)]
				/*internal*/ DUCE.MilMessage.CapsData Caps;
//				//[FieldOffset(8)]
				/*internal*/ DUCE.MilMessage.PartitionIsZombieStatus HRESULTFailure;
//				//[FieldOffset(8)]
				/*internal*/ DUCE.MilMessage.Presented Presented;
//				//[FieldOffset(8)]
				/*internal*/ DUCE.MilMessage.SyncModeStatus SyncModeStatus;
			}
		}
		/*internal*/ class ChannelSet
		{
			/*internal*/ DUCE.Channel Channel;
			/*internal*/ DUCE.Channel OutOfBandChannel;
		}
		/*internal*/ /*sealed*/ public class Channel
		{
//			[SecurityCritical]
			private IntPtr _hChannel;
			private DUCE.Channel _referenceChannel;
			private boolean _isSynchronous;
			private boolean _isOutOfBandChannel;
			private IntPtr _pConnection;
			/*internal*/ boolean IsConnected
			{
//				[SecurityCritical, SecurityTreatAsSafe]
				get
				{
					return MediaContext.CurrentMediaContext.IsConnected;
				}
			}
			/*internal*/ ChannelMarshalType MarshalType
			{
//				[SecurityCritical, SecurityTreatAsSafe]
				get
				{
					Invariant.Assert(this._hChannel != IntPtr.Zero);
					ChannelMarshalType result;
					HRESULT.Check(DUCE.UnsafeNativeMethods.MilChannel_GetMarshalType(this._hChannel, out result));
					return result;
				}
			}
			/*internal*/ boolean IsSynchronous
			{
//				[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
				get
				{
					return this._isSynchronous;
				}
			}
			/*internal*/ boolean IsOutOfBandChannel
			{
//				[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
				get
				{
					return this._isOutOfBandChannel;
				}
			}
//			[SecurityCritical]
			public Channel(DUCE.Channel referenceChannel, boolean isOutOfBandChannel, IntPtr pConnection, boolean isSynchronous)
			{
				IntPtr hChannel = IntPtr.Zero;
				this._referenceChannel = referenceChannel;
				this._pConnection = pConnection;
				this._isOutOfBandChannel = isOutOfBandChannel;
				this._isSynchronous = isSynchronous;
				if (referenceChannel != null)
				{
					hChannel = referenceChannel._hChannel;
				}
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilConnection_CreateChannel(this._pConnection, hChannel, /*out*/ this._hChannel));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ void Commit()
			{
				if (this._hChannel == IntPtr.Zero)
				{
					return;
				}
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilConnection_CommitChannel(this._hChannel));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ void CloseBatch()
			{
				if (this._hChannel == IntPtr.Zero)
				{
					return;
				}
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilConnection_CloseBatch(this._hChannel));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ void SyncFlush()
			{
				if (this._hChannel == IntPtr.Zero)
				{
					return;
				}
				HRESULT.Check(MilCoreApi.MilComposition_SyncFlush(this._hChannel));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ void Close()
			{
				if (this._hChannel != IntPtr.Zero)
				{
					HRESULT.Check(DUCE.UnsafeNativeMethods.MilConnection_CloseBatch(this._hChannel));
					HRESULT.Check(DUCE.UnsafeNativeMethods.MilConnection_CommitChannel(this._hChannel));
				}
				this._referenceChannel = null;
				if (this._hChannel != IntPtr.Zero)
				{
					HRESULT.Check(DUCE.UnsafeNativeMethods.MilConnection_DestroyChannel(this._hChannel));
					this._hChannel = IntPtr.Zero;
				}
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ void Present()
			{
				HRESULT.Check(DUCE.UnsafeNativeMethods.WgxConnection_SameThreadPresent(this._pConnection));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ boolean CreateOrAddRefOnChannel(Object instance, ref DUCE.ResourceHandle handle, DUCE.ResourceType resourceType)
			{
				boolean isNull = handle.IsNull;
				Invariant.Assert(this._hChannel != IntPtr.Zero);
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilResource_CreateOrAddRefOnChannel(this._hChannel, resourceType, /*ref*/ handle));
				if (EventTrace.IsEnabled(EventTrace.Keyword.KeywordPerf | EventTrace.Keyword.KeywordGraphics, EventTrace.Level.PERF_LOW))
				{
					EventTrace.EventProvider.TraceEvent(EventTrace.Event.CreateOrAddResourceOnChannel, EventTrace.Keyword.KeywordPerf | EventTrace.Keyword.KeywordGraphics, EventTrace.Level.PERF_LOW, new Object[]
					{
						PerfService.GetPerfElementID(instance),
						this._hChannel,
						(uint)handle,
						(uint)resourceType
					});
				}
				return isNull;
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ DUCE.ResourceHandle DuplicateHandle(DUCE.ResourceHandle original, DUCE.Channel targetChannel)
			{
				DUCE.ResourceHandle @null = DUCE.ResourceHandle.Null;
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilResource_DuplicateHandle(this._hChannel, original, targetChannel._hChannel, /*ref*/ @null));
				return @null;
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ boolean ReleaseOnChannel(DUCE.ResourceHandle handle)
			{
				Invariant.Assert(this._hChannel != IntPtr.Zero);
				int num;
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilResource_ReleaseOnChannel(this._hChannel, handle, /*out*/ num));
				if (num != 0 && EventTrace.IsEnabled(EventTrace.Keyword.KeywordPerf | EventTrace.Keyword.KeywordGraphics, EventTrace.Level.PERF_LOW))
				{
					EventTrace.EventProvider.TraceEvent(EventTrace.Event.ReleaseOnChannel, EventTrace.Keyword.KeywordPerf | EventTrace.Keyword.KeywordGraphics, EventTrace.Level.PERF_LOW, new Object[]
					{
						this._hChannel,
						(uint)handle
					});
				}
				return num != 0;
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ uint GetRefCount(DUCE.ResourceHandle handle)
			{
				Invariant.Assert(this._hChannel != IntPtr.Zero);
				uint result;
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilResource_GetRefCountOnChannel(this._hChannel, handle, /*out*/ result));
				return result;
			}
//			[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries"), SecurityCritical]
			/*internal*/ /*unsafe*/ void SendCommand(byte* pCommandData, int cSize)
			{
				this.SendCommand(pCommandData, cSize, false);
			}
//			[SecurityCritical]
			/*internal*/ /*unsafe*/ void SendCommand(byte* pCommandData, int cSize, boolean sendInSeparateBatch)
			{
				Invariant.Assert(pCommandData != null && cSize > 0);
				if (this._hChannel == IntPtr.Zero)
				{
					return;
				}
				int hr = DUCE.UnsafeNativeMethods.MilResource_SendCommand(pCommandData, checked((uint)cSize), sendInSeparateBatch, this._hChannel);
				HRESULT.Check(hr);
			}
//			[SecurityCritical]
			/*internal*/ /*unsafe*/ void BeginCommand(byte* pbCommandData, int cbSize, int cbExtra)
			{
				Invariant.Assert(cbSize > 0);
				if (this._hChannel == IntPtr.Zero)
				{
					return;
				}
				int hr = checked(DUCE.UnsafeNativeMethods.MilChannel_BeginCommand(this._hChannel, pbCommandData, (uint)cbSize, (uint)cbExtra));
				HRESULT.Check(hr);
			}
//			[SecurityCritical]
			/*internal*/ /*unsafe*/ void AppendCommandData(byte* pbCommandData, int cbSize)
			{
				Invariant.Assert(pbCommandData != null && cbSize > 0);
				if (this._hChannel == IntPtr.Zero)
				{
					return;
				}
				int hr = DUCE.UnsafeNativeMethods.MilChannel_AppendCommandData(this._hChannel, pbCommandData, checked((uint)cbSize));
				HRESULT.Check(hr);
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ void EndCommand()
			{
				if (this._hChannel == IntPtr.Zero)
				{
					return;
				}
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilChannel_EndCommand(this._hChannel));
			}
//			[SecurityCritical]
			/*internal*/ void SendCommandBitmapSource(DUCE.ResourceHandle imageHandle, BitmapSourceSafeMILHandle pBitmapSource)
			{
				Invariant.Assert(pBitmapSource != null && !pBitmapSource.IsInvalid);
				Invariant.Assert(this._hChannel != IntPtr.Zero);
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilResource_SendCommandBitmapSource(imageHandle, pBitmapSource, this._hChannel));
			}
//			[SecurityCritical]
			/*internal*/ void SendCommandMedia(DUCE.ResourceHandle mediaHandle, SafeMediaHandle pMedia, boolean notifyUceDirect)
			{
				Invariant.Assert(pMedia != null && !pMedia.IsInvalid);
				Invariant.Assert(this._hChannel != IntPtr.Zero);
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilResource_SendCommandMedia(mediaHandle, pMedia, this._hChannel, notifyUceDirect));
			}
//			[SecurityCritical]
			/*internal*/ void SetNotificationWindow(IntPtr hwnd, WindowMessage message)
			{
				Invariant.Assert(this._hChannel != IntPtr.Zero);
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilChannel_SetNotificationWindow(this._hChannel, hwnd, message));
			}
//			[SecurityCritical]
			/*internal*/ void WaitForNextMessage()
			{
				int num;
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilComposition_WaitForNextMessage(this._hChannel, 0, null, 1, 4294967295u, out num));
			}
//			[SecurityCritical]
			/*internal*/ boolean PeekNextMessage(out DUCE.MilMessage.Message message)
			{
				Invariant.Assert(this._hChannel != IntPtr.Zero);
				int num;
				HRESULT.Check(DUCE.UnsafeNativeMethods.MilComposition_PeekNextMessage(this._hChannel, /*out*/ message, (IntPtr)sizeof(DUCE.MilMessage.Message), out num));
				return num != 0;
			}
		}
		/*internal*/public class Resource
		{
			public static final DUCE.Resource Null = new DUCE.Resource(DUCE.ResourceHandle.Null);
			private DUCE.ResourceHandle _handle;
			public DUCE.ResourceHandle Handle
			{
//				[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
				get
				{
					return this._handle;
				}
			}
//			[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
			public Resource(DUCE.ResourceHandle h)
			{
				this._handle = h;
			}
			public boolean CreateOrAddRefOnChannel(Object instance, DUCE.Channel channel, DUCE.ResourceType type)
			{
				return channel.CreateOrAddRefOnChannel(instance, ref this._handle, type);
			}
			public boolean ReleaseOnChannel(DUCE.Channel channel)
			{
				if (channel.ReleaseOnChannel(this._handle))
				{
					this._handle = DUCE.ResourceHandle.Null;
					return true;
				}
				return false;
			}
			public boolean IsOnChannel(DUCE.Channel channel)
			{
				return !this._handle.IsNull;
			}
		}
//		[StructLayout(LayoutKind.Explicit)]
		/*internal*/ class ResourceHandle
		{
			public static final DUCE.ResourceHandle Null = new DUCE.ResourceHandle(0u);
			//[FieldOffset(0)]
			private uint _handle;
			public boolean IsNull
			{
				get
				{
					return this._handle == 0u;
				}
			}
			public static /*explicit*/ operator uint(DUCE.ResourceHandle r)
			{
				return r._handle;
			}
//			[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
			public ResourceHandle(uint handle)
			{
				this._handle = handle;
			}
		}
		/*internal*/ class Map<ValueType>
		{
			private class Entry
			{
				public Object _key;
				public ValueType _value;
//				[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
				public Entry(Object k, ValueType v)
				{
					this._key = k;
					this._value = v;
				}
			}
			private DUCE.Map<ValueType>.Entry _first;
			private List<DUCE.Map<ValueType>.Entry> _others;
			private /*const*/static final int FOUND_IN_INLINE_STORAGE = -1;
			private /*const*/static final int NOT_FOUND = -2;
			public boolean IsEmpty()
			{
				return this._first._key == null && this._others == null;
			}
			private int Find(Object key)
			{
				int result = -2;
				if (this._first._key != null)
				{
					if (this._first._key == key)
					{
						result = -1;
					}
					else
					{
						if (this._others != null)
						{
							for (int i = 0; i < this._others.Count; i++)
							{
								if (this._others[i]._key == key)
								{
									result = i;
									break;
								}
							}
						}
					}
				}
				return result;
			}
			public void Set(Object key, ValueType value)
			{
				int num = this.Find(key);
				if (num == -1)
				{
					this._first._value = value;
					return;
				}
				if (num != -2)
				{
					this._others[num] = new DUCE.Map<ValueType>.Entry(key, value);
					return;
				}
				if (this._first._key == null)
				{
					this._first = new DUCE.Map<ValueType>.Entry(key, value);
					return;
				}
				if (this._others == null)
				{
					this._others = new List<DUCE.Map<ValueType>.Entry>(2);
				}
				this._others.Add(new DUCE.Map<ValueType>.Entry(key, value));
			}
			public boolean Remove(Object key)
			{
				int num = this.Find(key);
				if (num == -1)
				{
					if (this._others != null)
					{
						int num2 = this._others.Count - 1;
						this._first = this._others[num2];
						if (num2 == 0)
						{
							this._others = null;
						}
						else
						{
							this._others.RemoveAt(num2);
						}
					}
					else
					{
						this._first = default(DUCE.Map<ValueType>.Entry);
					}
					return true;
				}
				if (num >= 0)
				{
					if (this._others.Count == 1)
					{
						this._others = null;
					}
					else
					{
						this._others.RemoveAt(num);
					}
					return true;
				}
				return false;
			}
			public boolean Get(Object key, /*out*/ ValueType value)
			{
				int num = this.Find(key);
				value = default(ValueType);
				if (num == -1)
				{
					value = this._first._value;
					return true;
				}
				if (num >= 0)
				{
					value = this._others[num]._value;
					return true;
				}
				return false;
			}
			public int Count()
			{
				if (this._first._key == null)
				{
					return 0;
				}
				if (this._others == null)
				{
					return 1;
				}
				return this._others.Count + 1;
			}
			public Object Get(int index)
			{
				if (index >= this.Count())
				{
					return null;
				}
				if (index == 0)
				{
					return this._first._key;
				}
				return this._others[index - 1]._key;
			}
		}
		/*internal*/ class Map
		{
			private class Entry
			{
				public Object _key;
				public DUCE.ResourceHandle _value;
				public Entry(Object k, DUCE.ResourceHandle v)
				{
					this._key = k;
					this._value = v;
				}
			}
			private DUCE.Map.Entry _head;
			private const int FOUND_IN_INLINE_STORAGE = -1;
			private const int NOT_FOUND = -2;
			public boolean IsEmpty()
			{
				return this._head._key == null;
			}
			public void Set(Object key, DUCE.ResourceHandle value)
			{
				int num = this.Find(key);
				if (num == -1)
				{
					this._head._value = value;
					return;
				}
				if (num != -2)
				{
					((List<DUCE.Map.Entry>)this._head._key)[num] = new DUCE.Map.Entry(key, value);
					return;
				}
				if (this._head._key == null)
				{
					this._head = new DUCE.Map.Entry(key, value);
					return;
				}
				if (!this._head._value.IsNull)
				{
					this._head._key = new List<DUCE.Map.Entry>(2)
					{
						this._head,
						new DUCE.Map.Entry(key, value)
					};
					this._head._value = DUCE.ResourceHandle.Null;
					return;
				}
				((List<DUCE.Map.Entry>)this._head._key).Add(new DUCE.Map.Entry(key, value));
			}
			public boolean Remove(Object key)
			{
				int num = this.Find(key);
				if (num == -1)
				{
					this._head = default(DUCE.Map.Entry);
					return true;
				}
				if (num >= 0)
				{
					List<DUCE.Map.Entry> list = (List<DUCE.Map.Entry>)this._head._key;
					if (this.Count() == 2)
					{
						this._head = list[1 - num];
					}
					else
					{
						list.RemoveAt(num);
					}
					return true;
				}
				return false;
			}
			public boolean Get(Object key, out DUCE.ResourceHandle value)
			{
				int num = this.Find(key);
				value = DUCE.ResourceHandle.Null;
				if (num == -1)
				{
					value = this._head._value;
					return true;
				}
				if (num >= 0)
				{
					value = ((List<DUCE.Map.Entry>)this._head._key)[num]._value;
					return true;
				}
				return false;
			}
			public int Count()
			{
				if (this._head._key == null)
				{
					return 0;
				}
				if (!this._head._value.IsNull)
				{
					return 1;
				}
				return ((List<DUCE.Map.Entry>)this._head._key).Count;
			}
			public Object Get(int index)
			{
				if (index >= this.Count() || index < 0)
				{
					return null;
				}
				if (this.Count() == 1)
				{
					return this._head._key;
				}
				return ((List<DUCE.Map.Entry>)this._head._key)[index]._key;
			}
			private int Find(Object key)
			{
				int result = -2;
				if (this._head._key != null)
				{
					if (this._head._key == key)
					{
						result = -1;
					}
					else
					{
						if (this._head._value.IsNull)
						{
							List<DUCE.Map.Entry> list = (List<DUCE.Map.Entry>)this._head._key;
							for (int i = 0; i < list.Count; i++)
							{
								if (list[i]._key == key)
								{
									result = i;
									break;
								}
							}
						}
					}
				}
				return result;
			}
		}
		/*internal*/ class ShareableDUCEMultiChannelResource
		{
			public DUCE.MultiChannelResource _duceResource;
//			[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
			public ShareableDUCEMultiChannelResource()
			{
			}
		}
		/*internal*/ class MultiChannelResource
		{
			private DUCE.Map _map;
			public boolean IsOnAnyChannel
			{
				get
				{
					return !this._map.IsEmpty();
				}
			}
			public boolean CreateOrAddRefOnChannel(Object instance, DUCE.Channel channel, DUCE.ResourceType type)
			{
				DUCE.ResourceHandle value;
				boolean flag = this._map.Get(channel, out value);
				boolean result = channel.CreateOrAddRefOnChannel(instance, ref value, type);
				if (!flag)
				{
					this._map.Set(channel, value);
				}
				return result;
			}
			public DUCE.ResourceHandle DuplicateHandle(DUCE.Channel sourceChannel, DUCE.Channel targetChannel)
			{
				DUCE.ResourceHandle resourceHandle = DUCE.ResourceHandle.Null;
				DUCE.ResourceHandle @null = DUCE.ResourceHandle.Null;
				this._map.Get(sourceChannel, out @null);
				resourceHandle = sourceChannel.DuplicateHandle(@null, targetChannel);
				if (!resourceHandle.IsNull)
				{
					this._map.Set(targetChannel, resourceHandle);
				}
				return resourceHandle;
			}
			public boolean ReleaseOnChannel(DUCE.Channel channel)
			{
				DUCE.ResourceHandle handle;
				this._map.Get(channel, out handle);
				if (channel.ReleaseOnChannel(handle))
				{
					this._map.Remove(channel);
					return true;
				}
				return false;
			}
			public DUCE.ResourceHandle GetHandle(DUCE.Channel channel)
			{
				DUCE.ResourceHandle @null;
				if (channel != null)
				{
					this._map.Get(channel, out @null);
				}
				else
				{
					@null = DUCE.ResourceHandle.Null;
				}
				return @null;
			}
			public boolean IsOnChannel(DUCE.Channel channel)
			{
				return !this.GetHandle(channel).IsNull;
			}
			public int GetChannelCount()
			{
				return this._map.Count();
			}
			public DUCE.Channel GetChannel(int index)
			{
				return this._map.Get(index) as DUCE.Channel;
			}
			public uint GetRefCountOnChannel(DUCE.Channel channel)
			{
				DUCE.ResourceHandle handle;
				this._map.Get(channel, out handle);
				return channel.GetRefCount(handle);
			}
		}
		/*internal*/ static class CompositionNode
		{
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetTransform(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hTransform, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_SETTRANSFORM mILCMD_VISUAL_SETTRANSFORM;
				mILCMD_VISUAL_SETTRANSFORM.Type = MILCMD.MilCmdVisualSetTransform;
				mILCMD_VISUAL_SETTRANSFORM.Handle = hCompositionNode;
				mILCMD_VISUAL_SETTRANSFORM.hTransform = hTransform;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_SETTRANSFORM), sizeof(DUCE.MILCMD_VISUAL_SETTRANSFORM));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetEffect(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hEffect, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_SETEFFECT mILCMD_VISUAL_SETEFFECT;
				mILCMD_VISUAL_SETEFFECT.Type = MILCMD.MilCmdVisualSetEffect;
				mILCMD_VISUAL_SETEFFECT.Handle = hCompositionNode;
				mILCMD_VISUAL_SETEFFECT.hEffect = hEffect;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_SETEFFECT), sizeof(DUCE.MILCMD_VISUAL_SETEFFECT));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetCacheMode(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hCacheMode, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_SETCACHEMODE mILCMD_VISUAL_SETCACHEMODE;
				mILCMD_VISUAL_SETCACHEMODE.Type = MILCMD.MilCmdVisualSetCacheMode;
				mILCMD_VISUAL_SETCACHEMODE.Handle = hCompositionNode;
				mILCMD_VISUAL_SETCACHEMODE.hCacheMode = hCacheMode;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_SETCACHEMODE), sizeof(DUCE.MILCMD_VISUAL_SETCACHEMODE));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetOffset(DUCE.ResourceHandle hCompositionNode, double offsetX, double offsetY, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_SETOFFSET mILCMD_VISUAL_SETOFFSET;
				mILCMD_VISUAL_SETOFFSET.Type = MILCMD.MilCmdVisualSetOffset;
				mILCMD_VISUAL_SETOFFSET.Handle = hCompositionNode;
				mILCMD_VISUAL_SETOFFSET.offsetX = offsetX;
				mILCMD_VISUAL_SETOFFSET.offsetY = offsetY;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_SETOFFSET), sizeof(DUCE.MILCMD_VISUAL_SETOFFSET));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetContent(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hContent, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_SETCONTENT mILCMD_VISUAL_SETCONTENT;
				mILCMD_VISUAL_SETCONTENT.Type = MILCMD.MilCmdVisualSetContent;
				mILCMD_VISUAL_SETCONTENT.Handle = hCompositionNode;
				mILCMD_VISUAL_SETCONTENT.hContent = hContent;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_SETCONTENT), sizeof(DUCE.MILCMD_VISUAL_SETCONTENT));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetAlpha(DUCE.ResourceHandle hCompositionNode, double alpha, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_SETALPHA mILCMD_VISUAL_SETALPHA;
				mILCMD_VISUAL_SETALPHA.Type = MILCMD.MilCmdVisualSetAlpha;
				mILCMD_VISUAL_SETALPHA.Handle = hCompositionNode;
				mILCMD_VISUAL_SETALPHA.alpha = alpha;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_SETALPHA), sizeof(DUCE.MILCMD_VISUAL_SETALPHA));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetAlphaMask(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hAlphaMaskBrush, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_SETALPHAMASK mILCMD_VISUAL_SETALPHAMASK;
				mILCMD_VISUAL_SETALPHAMASK.Type = MILCMD.MilCmdVisualSetAlphaMask;
				mILCMD_VISUAL_SETALPHAMASK.Handle = hCompositionNode;
				mILCMD_VISUAL_SETALPHAMASK.hAlphaMask = hAlphaMaskBrush;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_SETALPHAMASK), sizeof(DUCE.MILCMD_VISUAL_SETALPHAMASK));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetScrollableAreaClip(DUCE.ResourceHandle hCompositionNode, Rect? clip, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_SETSCROLLABLEAREACLIP mILCMD_VISUAL_SETSCROLLABLEAREACLIP;
				mILCMD_VISUAL_SETSCROLLABLEAREACLIP.Type = MILCMD.MilCmdVisualSetScrollableAreaClip;
				mILCMD_VISUAL_SETSCROLLABLEAREACLIP.Handle = hCompositionNode;
				mILCMD_VISUAL_SETSCROLLABLEAREACLIP.IsEnabled = (clip.HasValue ? 1u : 0u);
				if (clip.HasValue)
				{
					mILCMD_VISUAL_SETSCROLLABLEAREACLIP.Clip = clip.Value;
				}
				else
				{
					mILCMD_VISUAL_SETSCROLLABLEAREACLIP.Clip = Rect.Empty;
				}
				channel.SendCommand((byte*)(&mILCMD_VISUAL_SETSCROLLABLEAREACLIP), sizeof(DUCE.MILCMD_VISUAL_SETSCROLLABLEAREACLIP));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetClip(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hClip, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_SETCLIP mILCMD_VISUAL_SETCLIP;
				mILCMD_VISUAL_SETCLIP.Type = MILCMD.MilCmdVisualSetClip;
				mILCMD_VISUAL_SETCLIP.Handle = hCompositionNode;
				mILCMD_VISUAL_SETCLIP.hClip = hClip;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_SETCLIP), sizeof(DUCE.MILCMD_VISUAL_SETCLIP));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetRenderOptions(DUCE.ResourceHandle hCompositionNode, MilRenderOptions renderOptions, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_SETRENDEROPTIONS mILCMD_VISUAL_SETRENDEROPTIONS;
				mILCMD_VISUAL_SETRENDEROPTIONS.Type = MILCMD.MilCmdVisualSetRenderOptions;
				mILCMD_VISUAL_SETRENDEROPTIONS.Handle = hCompositionNode;
				mILCMD_VISUAL_SETRENDEROPTIONS.renderOptions = renderOptions;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_SETRENDEROPTIONS), sizeof(DUCE.MILCMD_VISUAL_SETRENDEROPTIONS));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void RemoveChild(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hChild, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_REMOVECHILD mILCMD_VISUAL_REMOVECHILD;
				mILCMD_VISUAL_REMOVECHILD.Type = MILCMD.MilCmdVisualRemoveChild;
				mILCMD_VISUAL_REMOVECHILD.Handle = hCompositionNode;
				mILCMD_VISUAL_REMOVECHILD.hChild = hChild;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_REMOVECHILD), sizeof(DUCE.MILCMD_VISUAL_REMOVECHILD));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void RemoveAllChildren(DUCE.ResourceHandle hCompositionNode, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_REMOVEALLCHILDREN mILCMD_VISUAL_REMOVEALLCHILDREN;
				mILCMD_VISUAL_REMOVEALLCHILDREN.Type = MILCMD.MilCmdVisualRemoveAllChildren;
				mILCMD_VISUAL_REMOVEALLCHILDREN.Handle = hCompositionNode;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_REMOVEALLCHILDREN), sizeof(DUCE.MILCMD_VISUAL_REMOVEALLCHILDREN));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void InsertChildAt(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hChild, uint iPosition, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL_INSERTCHILDAT mILCMD_VISUAL_INSERTCHILDAT;
				mILCMD_VISUAL_INSERTCHILDAT.Type = MILCMD.MilCmdVisualInsertChildAt;
				mILCMD_VISUAL_INSERTCHILDAT.Handle = hCompositionNode;
				mILCMD_VISUAL_INSERTCHILDAT.hChild = hChild;
				mILCMD_VISUAL_INSERTCHILDAT.index = iPosition;
				channel.SendCommand((byte*)(&mILCMD_VISUAL_INSERTCHILDAT), sizeof(DUCE.MILCMD_VISUAL_INSERTCHILDAT));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetGuidelineCollection(DUCE.ResourceHandle hCompositionNode, DoubleCollection guidelinesX, DoubleCollection guidelinesY, DUCE.Channel channel)
			{
				int num = (guidelinesX == null) ? 0 : guidelinesX.Count;
				int num2 = (guidelinesY == null) ? 0 : guidelinesY.Count;
				checked
				{
					int num3 = num + num2;
					DUCE.MILCMD_VISUAL_SETGUIDELINECOLLECTION mILCMD_VISUAL_SETGUIDELINECOLLECTION;
					mILCMD_VISUAL_SETGUIDELINECOLLECTION.Type = MILCMD.MilCmdVisualSetGuidelineCollection;
					mILCMD_VISUAL_SETGUIDELINECOLLECTION.Handle = hCompositionNode;
					mILCMD_VISUAL_SETGUIDELINECOLLECTION.countX = (ushort)num;
					mILCMD_VISUAL_SETGUIDELINECOLLECTION.countY = (ushort)num2;
					if (num == 0 && num2 == 0)
					{
						channel.SendCommand(unchecked((byte*)(&mILCMD_VISUAL_SETGUIDELINECOLLECTION)), sizeof(DUCE.MILCMD_VISUAL_SETGUIDELINECOLLECTION));
						return;
					}
					double[] array = new double[num3];
					if (num != 0)
					{
						guidelinesX.CopyTo(array, 0);
						Array.Sort<double>(array, 0, num);
					}
					if (num2 != 0)
					{
						guidelinesY.CopyTo(array, num);
						Array.Sort<double>(array, num, num2);
					}
					float[] array2 = new float[num3];
					for (int i = 0; i < num3; i++)
					{
						array2[i] = (float)array[i];
					}
					channel.BeginCommand(unchecked((byte*)(&mILCMD_VISUAL_SETGUIDELINECOLLECTION)), sizeof(DUCE.MILCMD_VISUAL_SETGUIDELINECOLLECTION), 4 * num3);
					fixed (float* ptr = array2)
					{
						channel.AppendCommandData(unchecked((byte*)ptr), 4 * num3);
					}
					channel.EndCommand();
				}
			}
		}
		/*internal*/ static class Viewport3DVisualNode
		{
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetCamera(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hCamera, DUCE.Channel channel)
			{
				DUCE.MILCMD_VIEWPORT3DVISUAL_SETCAMERA mILCMD_VIEWPORT3DVISUAL_SETCAMERA;
				mILCMD_VIEWPORT3DVISUAL_SETCAMERA.Type = MILCMD.MilCmdViewport3DVisualSetCamera;
				mILCMD_VIEWPORT3DVISUAL_SETCAMERA.Handle = hCompositionNode;
				mILCMD_VIEWPORT3DVISUAL_SETCAMERA.hCamera = hCamera;
				channel.SendCommand((byte*)(&mILCMD_VIEWPORT3DVISUAL_SETCAMERA), sizeof(DUCE.MILCMD_VIEWPORT3DVISUAL_SETCAMERA));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetViewport(DUCE.ResourceHandle hCompositionNode, Rect viewport, DUCE.Channel channel)
			{
				DUCE.MILCMD_VIEWPORT3DVISUAL_SETVIEWPORT mILCMD_VIEWPORT3DVISUAL_SETVIEWPORT;
				mILCMD_VIEWPORT3DVISUAL_SETVIEWPORT.Type = MILCMD.MilCmdViewport3DVisualSetViewport;
				mILCMD_VIEWPORT3DVISUAL_SETVIEWPORT.Handle = hCompositionNode;
				mILCMD_VIEWPORT3DVISUAL_SETVIEWPORT.Viewport = viewport;
				channel.SendCommand((byte*)(&mILCMD_VIEWPORT3DVISUAL_SETVIEWPORT), sizeof(DUCE.MILCMD_VIEWPORT3DVISUAL_SETVIEWPORT));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void Set3DChild(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hVisual3D, DUCE.Channel channel)
			{
				DUCE.MILCMD_VIEWPORT3DVISUAL_SET3DCHILD mILCMD_VIEWPORT3DVISUAL_SET3DCHILD;
				mILCMD_VIEWPORT3DVISUAL_SET3DCHILD.Type = MILCMD.MilCmdViewport3DVisualSet3DChild;
				mILCMD_VIEWPORT3DVISUAL_SET3DCHILD.Handle = hCompositionNode;
				mILCMD_VIEWPORT3DVISUAL_SET3DCHILD.hChild = hVisual3D;
				channel.SendCommand((byte*)(&mILCMD_VIEWPORT3DVISUAL_SET3DCHILD), sizeof(DUCE.MILCMD_VIEWPORT3DVISUAL_SET3DCHILD));
			}
		}
		/*internal*/ static class Visual3DNode
		{
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void RemoveChild(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hChild, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL3D_REMOVECHILD mILCMD_VISUAL3D_REMOVECHILD;
				mILCMD_VISUAL3D_REMOVECHILD.Type = MILCMD.MilCmdVisual3DRemoveChild;
				mILCMD_VISUAL3D_REMOVECHILD.Handle = hCompositionNode;
				mILCMD_VISUAL3D_REMOVECHILD.hChild = hChild;
				channel.SendCommand((byte*)(&mILCMD_VISUAL3D_REMOVECHILD), sizeof(DUCE.MILCMD_VISUAL3D_REMOVECHILD));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void RemoveAllChildren(DUCE.ResourceHandle hCompositionNode, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL3D_REMOVEALLCHILDREN mILCMD_VISUAL3D_REMOVEALLCHILDREN;
				mILCMD_VISUAL3D_REMOVEALLCHILDREN.Type = MILCMD.MilCmdVisual3DRemoveAllChildren;
				mILCMD_VISUAL3D_REMOVEALLCHILDREN.Handle = hCompositionNode;
				channel.SendCommand((byte*)(&mILCMD_VISUAL3D_REMOVEALLCHILDREN), sizeof(DUCE.MILCMD_VISUAL3D_REMOVEALLCHILDREN));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void InsertChildAt(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hChild, uint iPosition, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL3D_INSERTCHILDAT mILCMD_VISUAL3D_INSERTCHILDAT;
				mILCMD_VISUAL3D_INSERTCHILDAT.Type = MILCMD.MilCmdVisual3DInsertChildAt;
				mILCMD_VISUAL3D_INSERTCHILDAT.Handle = hCompositionNode;
				mILCMD_VISUAL3D_INSERTCHILDAT.hChild = hChild;
				mILCMD_VISUAL3D_INSERTCHILDAT.index = iPosition;
				channel.SendCommand((byte*)(&mILCMD_VISUAL3D_INSERTCHILDAT), sizeof(DUCE.MILCMD_VISUAL3D_INSERTCHILDAT));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetContent(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hContent, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL3D_SETCONTENT mILCMD_VISUAL3D_SETCONTENT;
				mILCMD_VISUAL3D_SETCONTENT.Type = MILCMD.MilCmdVisual3DSetContent;
				mILCMD_VISUAL3D_SETCONTENT.Handle = hCompositionNode;
				mILCMD_VISUAL3D_SETCONTENT.hContent = hContent;
				channel.SendCommand((byte*)(&mILCMD_VISUAL3D_SETCONTENT), sizeof(DUCE.MILCMD_VISUAL3D_SETCONTENT));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetTransform(DUCE.ResourceHandle hCompositionNode, DUCE.ResourceHandle hTransform, DUCE.Channel channel)
			{
				DUCE.MILCMD_VISUAL3D_SETTRANSFORM mILCMD_VISUAL3D_SETTRANSFORM;
				mILCMD_VISUAL3D_SETTRANSFORM.Type = MILCMD.MilCmdVisual3DSetTransform;
				mILCMD_VISUAL3D_SETTRANSFORM.Handle = hCompositionNode;
				mILCMD_VISUAL3D_SETTRANSFORM.hTransform = hTransform;
				channel.SendCommand((byte*)(&mILCMD_VISUAL3D_SETTRANSFORM), sizeof(DUCE.MILCMD_VISUAL3D_SETTRANSFORM));
			}
		}
		/*internal*/ static class CompositionTarget
		{
//			[SecurityCritical]
			/*internal*/ /*unsafe*/ static void HwndInitialize(DUCE.ResourceHandle hCompositionTarget, IntPtr hWnd, int nWidth, int nHeight, boolean softwareOnly, DUCE.Channel channel)
			{
				DUCE.MILCMD_HWNDTARGET_CREATE mILCMD_HWNDTARGET_CREATE;
				mILCMD_HWNDTARGET_CREATE.Type = MILCMD.MilCmdHwndTargetCreate;
				mILCMD_HWNDTARGET_CREATE.Handle = hCompositionTarget;
				UIntPtr value = new UIntPtr(hWnd.ToPointer());
				mILCMD_HWNDTARGET_CREATE.hwnd = (ulong)value;
				mILCMD_HWNDTARGET_CREATE.width = (uint)nWidth;
				mILCMD_HWNDTARGET_CREATE.height = (uint)nHeight;
				mILCMD_HWNDTARGET_CREATE.clearColor.b = 0f;
				mILCMD_HWNDTARGET_CREATE.clearColor.r = 0f;
				mILCMD_HWNDTARGET_CREATE.clearColor.g = 0f;
				mILCMD_HWNDTARGET_CREATE.clearColor.a = 1f;
				mILCMD_HWNDTARGET_CREATE.flags = 12u;
				if (softwareOnly)
				{
					mILCMD_HWNDTARGET_CREATE.flags |= 1u;
				}
				mILCMD_HWNDTARGET_CREATE.hBitmap = DUCE.ResourceHandle.Null;
				mILCMD_HWNDTARGET_CREATE.stride = 0u;
				mILCMD_HWNDTARGET_CREATE.ePixelFormat = 0u;
				mILCMD_HWNDTARGET_CREATE.hSection = 0uL;
				mILCMD_HWNDTARGET_CREATE.masterDevice = 0uL;
				channel.SendCommand((byte*)(&mILCMD_HWNDTARGET_CREATE), sizeof(DUCE.MILCMD_HWNDTARGET_CREATE), false);
			}
//			[SecurityCritical]
			/*internal*/ /*unsafe*/ static void PrintInitialize(DUCE.ResourceHandle hCompositionTarget, IntPtr pRenderTarget, int nWidth, int nHeight, DUCE.Channel channel)
			{
				DUCE.MILCMD_GENERICTARGET_CREATE mILCMD_GENERICTARGET_CREATE;
				mILCMD_GENERICTARGET_CREATE.Type = MILCMD.MilCmdGenericTargetCreate;
				mILCMD_GENERICTARGET_CREATE.Handle = hCompositionTarget;
				mILCMD_GENERICTARGET_CREATE.hwnd = 0uL;
				mILCMD_GENERICTARGET_CREATE.pRenderTarget = (ulong)((long)pRenderTarget);
				mILCMD_GENERICTARGET_CREATE.width = (uint)nWidth;
				mILCMD_GENERICTARGET_CREATE.height = (uint)nHeight;
				mILCMD_GENERICTARGET_CREATE.dummy = 0u;
				channel.SendCommand((byte*)(&mILCMD_GENERICTARGET_CREATE), sizeof(DUCE.MILCMD_GENERICTARGET_CREATE), false);
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetClearColor(DUCE.ResourceHandle hCompositionTarget, Color color, DUCE.Channel channel)
			{
				DUCE.MILCMD_TARGET_SETCLEARCOLOR mILCMD_TARGET_SETCLEARCOLOR;
				mILCMD_TARGET_SETCLEARCOLOR.Type = MILCMD.MilCmdTargetSetClearColor;
				mILCMD_TARGET_SETCLEARCOLOR.Handle = hCompositionTarget;
				mILCMD_TARGET_SETCLEARCOLOR.clearColor.b = color.ScB;
				mILCMD_TARGET_SETCLEARCOLOR.clearColor.r = color.ScR;
				mILCMD_TARGET_SETCLEARCOLOR.clearColor.g = color.ScG;
				mILCMD_TARGET_SETCLEARCOLOR.clearColor.a = color.ScA;
				channel.SendCommand((byte*)(&mILCMD_TARGET_SETCLEARCOLOR), sizeof(DUCE.MILCMD_TARGET_SETCLEARCOLOR));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetRenderingMode(DUCE.ResourceHandle hCompositionTarget, MILRTInitializationFlags nRenderingMode, DUCE.Channel channel)
			{
				DUCE.MILCMD_TARGET_SETFLAGS mILCMD_TARGET_SETFLAGS;
				mILCMD_TARGET_SETFLAGS.Type = MILCMD.MilCmdTargetSetFlags;
				mILCMD_TARGET_SETFLAGS.Handle = hCompositionTarget;
				mILCMD_TARGET_SETFLAGS.flags = (uint)nRenderingMode;
				channel.SendCommand((byte*)(&mILCMD_TARGET_SETFLAGS), sizeof(DUCE.MILCMD_TARGET_SETFLAGS));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void SetRoot(DUCE.ResourceHandle hCompositionTarget, DUCE.ResourceHandle hRoot, DUCE.Channel channel)
			{
				DUCE.MILCMD_TARGET_SETROOT mILCMD_TARGET_SETROOT;
				mILCMD_TARGET_SETROOT.Type = MILCMD.MilCmdTargetSetRoot;
				mILCMD_TARGET_SETROOT.Handle = hCompositionTarget;
				mILCMD_TARGET_SETROOT.hRoot = hRoot;
				channel.SendCommand((byte*)(&mILCMD_TARGET_SETROOT), sizeof(DUCE.MILCMD_TARGET_SETROOT));
			}
//			[SecurityCritical]
			/*internal*/ /*unsafe*/ static void UpdateWindowSettings(DUCE.ResourceHandle hCompositionTarget, NativeMethods.RECT windowRect, Color colorKey, float constantAlpha, MILWindowLayerType windowLayerType, MILTransparencyFlags transparencyMode, boolean isChild, boolean isRTL, boolean renderingEnabled, int disableCookie, DUCE.Channel channel)
			{
				DUCE.MILCMD_TARGET_UPDATEWINDOWSETTINGS mILCMD_TARGET_UPDATEWINDOWSETTINGS;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.Type = MILCMD.MilCmdTargetUpdateWindowSettings;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.Handle = hCompositionTarget;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.renderingEnabled = (renderingEnabled ? 1u : 0u);
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.disableCookie = (uint)disableCookie;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.windowRect = windowRect;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.colorKey.b = colorKey.ScB;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.colorKey.r = colorKey.ScR;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.colorKey.g = colorKey.ScG;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.colorKey.a = colorKey.ScA;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.constantAlpha = constantAlpha;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.transparencyMode = transparencyMode;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.windowLayerType = windowLayerType;
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.isChild = (isChild ? 1u : 0u);
				mILCMD_TARGET_UPDATEWINDOWSETTINGS.isRTL = (isRTL ? 1u : 0u);
				channel.SendCommand((byte*)(&mILCMD_TARGET_UPDATEWINDOWSETTINGS), sizeof(DUCE.MILCMD_TARGET_UPDATEWINDOWSETTINGS));
			}
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void Invalidate(DUCE.ResourceHandle hCompositionTarget, ref NativeMethods.RECT pRect, DUCE.Channel channel)
			{
				DUCE.MILCMD_TARGET_INVALIDATE mILCMD_TARGET_INVALIDATE;
				mILCMD_TARGET_INVALIDATE.Type = MILCMD.MilCmdTargetInvalidate;
				mILCMD_TARGET_INVALIDATE.Handle = hCompositionTarget;
				mILCMD_TARGET_INVALIDATE.rc = pRect;
				channel.SendCommand((byte*)(&mILCMD_TARGET_INVALIDATE), sizeof(DUCE.MILCMD_TARGET_INVALIDATE), false);
				channel.CloseBatch();
				channel.Commit();
			}
		}
		/*internal*/ static class ETWEvent
		{
//			[SecurityCritical, SecurityTreatAsSafe]
			/*internal*/ /*unsafe*/ static void RaiseEvent(DUCE.ResourceHandle hEtwEvent, uint id, DUCE.Channel channel)
			{
				DUCE.MILCMD_ETWEVENTRESOURCE mILCMD_ETWEVENTRESOURCE;
				mILCMD_ETWEVENTRESOURCE.Type = MILCMD.MilCmdEtwEventResource;
				mILCMD_ETWEVENTRESOURCE.Handle = hEtwEvent;
				mILCMD_ETWEVENTRESOURCE.id = id;
				channel.SendCommand((byte*)(&mILCMD_ETWEVENTRESOURCE), sizeof(DUCE.MILCMD_ETWEVENTRESOURCE));
			}
		}
		/*internal*/ interface IResource
		{
			DUCE.ResourceHandle AddRefOnChannel(DUCE.Channel channel);
			int GetChannelCount();
			DUCE.Channel GetChannel(int index);
			void ReleaseOnChannel(DUCE.Channel channel);
			DUCE.ResourceHandle GetHandle(DUCE.Channel channel);
			DUCE.ResourceHandle Get3DHandle(DUCE.Channel channel);
			void RemoveChildFromParent(DUCE.IResource parent, DUCE.Channel channel);
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_PARTITION_REGISTERFORNOTIFICATIONS
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ uint Enable;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_CHANNEL_REQUESTTIER
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ uint ReturnCommonMinimum;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_PARTITION_SETVBLANKSYNCMODE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ uint Enable;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_PARTITION_NOTIFYPRESENT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ ulong FrameTime;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_D3DIMAGE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ ulong pInteropDeviceBitmap;
			//[FieldOffset(16)]
			/*internal*/ ulong pSoftwareBitmap;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_D3DIMAGE_PRESENT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ ulong hEvent;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_BITMAP_INVALIDATE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ uint UseDirtyRect;
			//[FieldOffset(12)]
			/*internal*/ NativeMethods.RECT DirtyRect;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_DOUBLERESOURCE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Value;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_COLORRESOURCE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilColorF Value;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_POINTRESOURCE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ Point Value;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_RECTRESOURCE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ Rect Value;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_SIZERESOURCE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ Size Value;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_MATRIXRESOURCE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilMatrix3x2D Value;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_POINT3DRESOURCE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilPoint3F Value;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VECTOR3DRESOURCE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilPoint3F Value;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_QUATERNIONRESOURCE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilQuaternionF Value;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_RENDERDATA
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ uint cbData;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_ETWEVENTRESOURCE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ uint id;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETOFFSET
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double offsetX;
			//[FieldOffset(16)]
			/*internal*/ double offsetY;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETTRANSFORM
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hTransform;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETEFFECT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hEffect;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETCACHEMODE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hCacheMode;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETCLIP
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hClip;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETALPHA
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double alpha;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETRENDEROPTIONS
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilRenderOptions renderOptions;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETCONTENT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hContent;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETALPHAMASK
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hAlphaMask;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_REMOVEALLCHILDREN
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_REMOVECHILD
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hChild;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_INSERTCHILDAT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hChild;
			//[FieldOffset(12)]
			/*internal*/ uint index;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETGUIDELINECOLLECTION
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ ushort countX;
			//[FieldOffset(12)]
			/*internal*/ ushort countY;
			//[FieldOffset(15)]
			private byte BYTEPacking0;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL_SETSCROLLABLEAREACLIP
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ Rect Clip;
			//[FieldOffset(40)]
			/*internal*/ uint IsEnabled;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VIEWPORT3DVISUAL_SETCAMERA
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hCamera;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VIEWPORT3DVISUAL_SETVIEWPORT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ Rect Viewport;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VIEWPORT3DVISUAL_SET3DCHILD
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hChild;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL3D_SETCONTENT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hContent;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL3D_SETTRANSFORM
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hTransform;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL3D_REMOVEALLCHILDREN
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL3D_REMOVECHILD
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hChild;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUAL3D_INSERTCHILDAT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hChild;
			//[FieldOffset(12)]
			/*internal*/ uint index;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_HWNDTARGET_CREATE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ ulong hwnd;
			//[FieldOffset(16)]
			/*internal*/ ulong hSection;
			//[FieldOffset(24)]
			/*internal*/ ulong masterDevice;
			//[FieldOffset(32)]
			/*internal*/ uint width;
			//[FieldOffset(36)]
			/*internal*/ uint height;
			//[FieldOffset(40)]
			/*internal*/ MilColorF clearColor;
			//[FieldOffset(56)]
			/*internal*/ uint flags;
			//[FieldOffset(60)]
			/*internal*/ DUCE.ResourceHandle hBitmap;
			//[FieldOffset(64)]
			/*internal*/ uint stride;
			//[FieldOffset(68)]
			/*internal*/ uint ePixelFormat;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_TARGET_UPDATEWINDOWSETTINGS
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ NativeMethods.RECT windowRect;
			//[FieldOffset(24)]
			/*internal*/ MILWindowLayerType windowLayerType;
			//[FieldOffset(28)]
			/*internal*/ MILTransparencyFlags transparencyMode;
			//[FieldOffset(32)]
			/*internal*/ float constantAlpha;
			//[FieldOffset(36)]
			/*internal*/ uint isChild;
			//[FieldOffset(40)]
			/*internal*/ uint isRTL;
			//[FieldOffset(44)]
			/*internal*/ uint renderingEnabled;
			//[FieldOffset(48)]
			/*internal*/ MilColorF colorKey;
			//[FieldOffset(64)]
			/*internal*/ uint disableCookie;
			//[FieldOffset(68)]
			/*internal*/ uint gdiBlt;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_GENERICTARGET_CREATE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ ulong hwnd;
			//[FieldOffset(16)]
			/*internal*/ ulong pRenderTarget;
			//[FieldOffset(24)]
			/*internal*/ uint width;
			//[FieldOffset(28)]
			/*internal*/ uint height;
			//[FieldOffset(32)]
			/*internal*/ uint dummy;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_TARGET_SETROOT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hRoot;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_TARGET_SETCLEARCOLOR
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilColorF clearColor;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_TARGET_INVALIDATE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ NativeMethods.RECT rc;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_TARGET_SETFLAGS
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ uint flags;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_GLYPHRUN_CREATE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ ulong pIDWriteFont;
			//[FieldOffset(16)]
			/*internal*/ ushort GlyphRunFlags;
			//[FieldOffset(20)]
			/*internal*/ MilPoint2F Origin;
			//[FieldOffset(28)]
			/*internal*/ float MuSize;
			//[FieldOffset(32)]
			/*internal*/ Rect ManagedBounds;
			//[FieldOffset(64)]
			/*internal*/ ushort GlyphCount;
			//[FieldOffset(68)]
			/*internal*/ ushort BidiLevel;
			//[FieldOffset(72)]
			/*internal*/ ushort DWriteTextMeasuringMethod;
			//[FieldOffset(75)]
			private byte BYTEPacking0;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_DOUBLEBUFFEREDBITMAP
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ ulong SwDoubleBufferedBitmap;
			//[FieldOffset(16)]
			/*internal*/ uint UseBackBuffer;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_DOUBLEBUFFEREDBITMAP_COPYFORWARD
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ ulong CopyCompletedEvent;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_AXISANGLEROTATION3D
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double angle;
			//[FieldOffset(16)]
			/*internal*/ MilPoint3F axis;
			//[FieldOffset(28)]
			/*internal*/ DUCE.ResourceHandle hAxisAnimations;
			//[FieldOffset(32)]
			/*internal*/ DUCE.ResourceHandle hAngleAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_QUATERNIONROTATION3D
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilQuaternionF quaternion;
			//[FieldOffset(24)]
			/*internal*/ DUCE.ResourceHandle hQuaternionAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_PERSPECTIVECAMERA
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double nearPlaneDistance;
			//[FieldOffset(16)]
			/*internal*/ double farPlaneDistance;
			//[FieldOffset(24)]
			/*internal*/ double fieldOfView;
			//[FieldOffset(32)]
			/*internal*/ MilPoint3F position;
			//[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle htransform;
			//[FieldOffset(48)]
			/*internal*/ MilPoint3F lookDirection;
			//[FieldOffset(60)]
			/*internal*/ DUCE.ResourceHandle hNearPlaneDistanceAnimations;
			//[FieldOffset(64)]
			/*internal*/ MilPoint3F upDirection;
			//[FieldOffset(76)]
			/*internal*/ DUCE.ResourceHandle hFarPlaneDistanceAnimations;
			//[FieldOffset(80)]
			/*internal*/ DUCE.ResourceHandle hPositionAnimations;
			//[FieldOffset(84)]
			/*internal*/ DUCE.ResourceHandle hLookDirectionAnimations;
			//[FieldOffset(88)]
			/*internal*/ DUCE.ResourceHandle hUpDirectionAnimations;
			//[FieldOffset(92)]
			/*internal*/ DUCE.ResourceHandle hFieldOfViewAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_ORTHOGRAPHICCAMERA
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double nearPlaneDistance;
			//[FieldOffset(16)]
			/*internal*/ double farPlaneDistance;
			//[FieldOffset(24)]
			/*internal*/ double width;
			//[FieldOffset(32)]
			/*internal*/ MilPoint3F position;
			//[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle htransform;
			//[FieldOffset(48)]
			/*internal*/ MilPoint3F lookDirection;
			//[FieldOffset(60)]
			/*internal*/ DUCE.ResourceHandle hNearPlaneDistanceAnimations;
			//[FieldOffset(64)]
			/*internal*/ MilPoint3F upDirection;
			//[FieldOffset(76)]
			/*internal*/ DUCE.ResourceHandle hFarPlaneDistanceAnimations;
			//[FieldOffset(80)]
			/*internal*/ DUCE.ResourceHandle hPositionAnimations;
			//[FieldOffset(84)]
			/*internal*/ DUCE.ResourceHandle hLookDirectionAnimations;
			//[FieldOffset(88)]
			/*internal*/ DUCE.ResourceHandle hUpDirectionAnimations;
			//[FieldOffset(92)]
			/*internal*/ DUCE.ResourceHandle hWidthAnimations;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_MATRIXCAMERA
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ D3DMATRIX viewMatrix;
			//[FieldOffset(72)]
			/*internal*/ D3DMATRIX projectionMatrix;
			//[FieldOffset(136)]
			/*internal*/ DUCE.ResourceHandle htransform;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_MODEL3DGROUP
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle htransform;
			//[FieldOffset(12)]
			/*internal*/ uint ChildrenSize;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_AMBIENTLIGHT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilColorF color;
			//[FieldOffset(24)]
			/*internal*/ DUCE.ResourceHandle htransform;
			//[FieldOffset(28)]
			/*internal*/ DUCE.ResourceHandle hColorAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_DIRECTIONALLIGHT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilColorF color;
			//[FieldOffset(24)]
			/*internal*/ MilPoint3F direction;
			//[FieldOffset(36)]
			/*internal*/ DUCE.ResourceHandle htransform;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hColorAnimations;
			//[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle hDirectionAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_POINTLIGHT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilColorF color;
			//[FieldOffset(24)]
			/*internal*/ double range;
			//[FieldOffset(32)]
			/*internal*/ double constantAttenuation;
			//[FieldOffset(40)]
			/*internal*/ double linearAttenuation;
			//[FieldOffset(48)]
			/*internal*/ double quadraticAttenuation;
			//[FieldOffset(56)]
			/*internal*/ MilPoint3F position;
			//[FieldOffset(68)]
			/*internal*/ DUCE.ResourceHandle htransform;
			//[FieldOffset(72)]
			/*internal*/ DUCE.ResourceHandle hColorAnimations;
			//[FieldOffset(76)]
			/*internal*/ DUCE.ResourceHandle hPositionAnimations;
			//[FieldOffset(80)]
			/*internal*/ DUCE.ResourceHandle hRangeAnimations;
			//[FieldOffset(84)]
			/*internal*/ DUCE.ResourceHandle hConstantAttenuationAnimations;
			//[FieldOffset(88)]
			/*internal*/ DUCE.ResourceHandle hLinearAttenuationAnimations;
			//[FieldOffset(92)]
			/*internal*/ DUCE.ResourceHandle hQuadraticAttenuationAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_SPOTLIGHT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilColorF color;
			//[FieldOffset(24)]
			/*internal*/ double range;
			//[FieldOffset(32)]
			/*internal*/ double constantAttenuation;
			//[FieldOffset(40)]
			/*internal*/ double linearAttenuation;
			//[FieldOffset(48)]
			/*internal*/ double quadraticAttenuation;
			//[FieldOffset(56)]
			/*internal*/ double outerConeAngle;
			//[FieldOffset(64)]
			/*internal*/ double innerConeAngle;
			//[FieldOffset(72)]
			/*internal*/ MilPoint3F position;
			//[FieldOffset(84)]
			/*internal*/ DUCE.ResourceHandle htransform;
			//[FieldOffset(88)]
			/*internal*/ MilPoint3F direction;
			//[FieldOffset(100)]
			/*internal*/ DUCE.ResourceHandle hColorAnimations;
			//[FieldOffset(104)]
			/*internal*/ DUCE.ResourceHandle hPositionAnimations;
			//[FieldOffset(108)]
			/*internal*/ DUCE.ResourceHandle hRangeAnimations;
			//[FieldOffset(112)]
			/*internal*/ DUCE.ResourceHandle hConstantAttenuationAnimations;
			//[FieldOffset(116)]
			/*internal*/ DUCE.ResourceHandle hLinearAttenuationAnimations;
			//[FieldOffset(120)]
			/*internal*/ DUCE.ResourceHandle hQuadraticAttenuationAnimations;
			//[FieldOffset(124)]
			/*internal*/ DUCE.ResourceHandle hDirectionAnimations;
			//[FieldOffset(128)]
			/*internal*/ DUCE.ResourceHandle hOuterConeAngleAnimations;
			//[FieldOffset(132)]
			/*internal*/ DUCE.ResourceHandle hInnerConeAngleAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_GEOMETRYMODEL3D
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle htransform;
			//[FieldOffset(12)]
			/*internal*/ DUCE.ResourceHandle hgeometry;
			//[FieldOffset(16)]
			/*internal*/ DUCE.ResourceHandle hmaterial;
			//[FieldOffset(20)]
			/*internal*/ DUCE.ResourceHandle hbackMaterial;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_MESHGEOMETRY3D
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ uint PositionsSize;
			//[FieldOffset(12)]
			/*internal*/ uint NormalsSize;
			//[FieldOffset(16)]
			/*internal*/ uint TextureCoordinatesSize;
			//[FieldOffset(20)]
			/*internal*/ uint TriangleIndicesSize;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_MATERIALGROUP
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ uint ChildrenSize;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_DIFFUSEMATERIAL
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilColorF color;
			//[FieldOffset(24)]
			/*internal*/ MilColorF ambientColor;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hbrush;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_SPECULARMATERIAL
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilColorF color;
			//[FieldOffset(24)]
			/*internal*/ double specularPower;
			//[FieldOffset(32)]
			/*internal*/ DUCE.ResourceHandle hbrush;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_EMISSIVEMATERIAL
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilColorF color;
			//[FieldOffset(24)]
			/*internal*/ DUCE.ResourceHandle hbrush;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_TRANSFORM3DGROUP
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ uint ChildrenSize;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_TRANSLATETRANSFORM3D
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double offsetX;
			//[FieldOffset(16)]
			/*internal*/ double offsetY;
			//[FieldOffset(24)]
			/*internal*/ double offsetZ;
			//[FieldOffset(32)]
			/*internal*/ DUCE.ResourceHandle hOffsetXAnimations;
			//[FieldOffset(36)]
			/*internal*/ DUCE.ResourceHandle hOffsetYAnimations;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hOffsetZAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_SCALETRANSFORM3D
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double scaleX;
			//[FieldOffset(16)]
			/*internal*/ double scaleY;
			//[FieldOffset(24)]
			/*internal*/ double scaleZ;
			//[FieldOffset(32)]
			/*internal*/ double centerX;
			//[FieldOffset(40)]
			/*internal*/ double centerY;
			//[FieldOffset(48)]
			/*internal*/ double centerZ;
			//[FieldOffset(56)]
			/*internal*/ DUCE.ResourceHandle hScaleXAnimations;
			//[FieldOffset(60)]
			/*internal*/ DUCE.ResourceHandle hScaleYAnimations;
			//[FieldOffset(64)]
			/*internal*/ DUCE.ResourceHandle hScaleZAnimations;
			//[FieldOffset(68)]
			/*internal*/ DUCE.ResourceHandle hCenterXAnimations;
			//[FieldOffset(72)]
			/*internal*/ DUCE.ResourceHandle hCenterYAnimations;
			//[FieldOffset(76)]
			/*internal*/ DUCE.ResourceHandle hCenterZAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_ROTATETRANSFORM3D
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double centerX;
			//[FieldOffset(16)]
			/*internal*/ double centerY;
			//[FieldOffset(24)]
			/*internal*/ double centerZ;
			//[FieldOffset(32)]
			/*internal*/ DUCE.ResourceHandle hCenterXAnimations;
			//[FieldOffset(36)]
			/*internal*/ DUCE.ResourceHandle hCenterYAnimations;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hCenterZAnimations;
			//[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle hrotation;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_MATRIXTRANSFORM3D
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ D3DMATRIX matrix;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_PIXELSHADER
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ ShaderRenderMode ShaderRenderMode;
			//[FieldOffset(12)]
			/*internal*/ uint PixelShaderBytecodeSize;
			//[FieldOffset(16)]
			/*internal*/ uint CompileSoftwareShader;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_IMPLICITINPUTBRUSH
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Opacity;
			//[FieldOffset(16)]
			/*internal*/ DUCE.ResourceHandle hOpacityAnimations;
			//[FieldOffset(20)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(24)]
			/*internal*/ DUCE.ResourceHandle hRelativeTransform;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_BLUREFFECT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Radius;
			//[FieldOffset(16)]
			/*internal*/ DUCE.ResourceHandle hRadiusAnimations;
			//[FieldOffset(20)]
			/*internal*/ KernelType KernelType;
			//[FieldOffset(24)]
			/*internal*/ RenderingBias RenderingBias;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_DROPSHADOWEFFECT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double ShadowDepth;
			//[FieldOffset(16)]
			/*internal*/ MilColorF Color;
			//[FieldOffset(32)]
			/*internal*/ double Direction;
			//[FieldOffset(40)]
			/*internal*/ double Opacity;
			//[FieldOffset(48)]
			/*internal*/ double BlurRadius;
			//[FieldOffset(56)]
			/*internal*/ DUCE.ResourceHandle hShadowDepthAnimations;
			//[FieldOffset(60)]
			/*internal*/ DUCE.ResourceHandle hColorAnimations;
			//[FieldOffset(64)]
			/*internal*/ DUCE.ResourceHandle hDirectionAnimations;
			//[FieldOffset(68)]
			/*internal*/ DUCE.ResourceHandle hOpacityAnimations;
			//[FieldOffset(72)]
			/*internal*/ DUCE.ResourceHandle hBlurRadiusAnimations;
			//[FieldOffset(76)]
			/*internal*/ RenderingBias RenderingBias;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_SHADEREFFECT
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double TopPadding;
			//[FieldOffset(16)]
			/*internal*/ double BottomPadding;
			//[FieldOffset(24)]
			/*internal*/ double LeftPadding;
			//[FieldOffset(32)]
			/*internal*/ double RightPadding;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hPixelShader;
			//[FieldOffset(44)]
			/*internal*/ int DdxUvDdyUvRegisterIndex;
			//[FieldOffset(48)]
			/*internal*/ uint ShaderConstantFloatRegistersSize;
			//[FieldOffset(52)]
			/*internal*/ uint DependencyPropertyFloatValuesSize;
			//[FieldOffset(56)]
			/*internal*/ uint ShaderConstantIntRegistersSize;
			//[FieldOffset(60)]
			/*internal*/ uint DependencyPropertyIntValuesSize;
			//[FieldOffset(64)]
			/*internal*/ uint ShaderConstantBoolRegistersSize;
			//[FieldOffset(68)]
			/*internal*/ uint DependencyPropertyBoolValuesSize;
			//[FieldOffset(72)]
			/*internal*/ uint ShaderSamplerRegistrationInfoSize;
			//[FieldOffset(76)]
			/*internal*/ uint DependencyPropertySamplerValuesSize;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_DRAWINGIMAGE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hDrawing;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_TRANSFORMGROUP
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ uint ChildrenSize;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_TRANSLATETRANSFORM
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double X;
			//[FieldOffset(16)]
			/*internal*/ double Y;
			//[FieldOffset(24)]
			/*internal*/ DUCE.ResourceHandle hXAnimations;
			//[FieldOffset(28)]
			/*internal*/ DUCE.ResourceHandle hYAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_SCALETRANSFORM
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double ScaleX;
			//[FieldOffset(16)]
			/*internal*/ double ScaleY;
			//[FieldOffset(24)]
			/*internal*/ double CenterX;
			//[FieldOffset(32)]
			/*internal*/ double CenterY;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hScaleXAnimations;
			//[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle hScaleYAnimations;
			//[FieldOffset(48)]
			/*internal*/ DUCE.ResourceHandle hCenterXAnimations;
			//[FieldOffset(52)]
			/*internal*/ DUCE.ResourceHandle hCenterYAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_SKEWTRANSFORM
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double AngleX;
			//[FieldOffset(16)]
			/*internal*/ double AngleY;
			//[FieldOffset(24)]
			/*internal*/ double CenterX;
			//[FieldOffset(32)]
			/*internal*/ double CenterY;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hAngleXAnimations;
			//[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle hAngleYAnimations;
			//[FieldOffset(48)]
			/*internal*/ DUCE.ResourceHandle hCenterXAnimations;
			//[FieldOffset(52)]
			/*internal*/ DUCE.ResourceHandle hCenterYAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_ROTATETRANSFORM
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Angle;
			//[FieldOffset(16)]
			/*internal*/ double CenterX;
			//[FieldOffset(24)]
			/*internal*/ double CenterY;
			//[FieldOffset(32)]
			/*internal*/ DUCE.ResourceHandle hAngleAnimations;
			//[FieldOffset(36)]
			/*internal*/ DUCE.ResourceHandle hCenterXAnimations;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hCenterYAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_MATRIXTRANSFORM
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ MilMatrix3x2D Matrix;
			//[FieldOffset(56)]
			/*internal*/ DUCE.ResourceHandle hMatrixAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_LINEGEOMETRY
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ Point StartPoint;
			//[FieldOffset(24)]
			/*internal*/ Point EndPoint;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle hStartPointAnimations;
			//[FieldOffset(48)]
			/*internal*/ DUCE.ResourceHandle hEndPointAnimations;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_RECTANGLEGEOMETRY
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double RadiusX;
			//[FieldOffset(16)]
			/*internal*/ double RadiusY;
			//[FieldOffset(24)]
			/*internal*/ Rect Rect;
			//[FieldOffset(56)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(60)]
			/*internal*/ DUCE.ResourceHandle hRadiusXAnimations;
			//[FieldOffset(64)]
			/*internal*/ DUCE.ResourceHandle hRadiusYAnimations;
			//[FieldOffset(68)]
			/*internal*/ DUCE.ResourceHandle hRectAnimations;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_ELLIPSEGEOMETRY
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double RadiusX;
			//[FieldOffset(16)]
			/*internal*/ double RadiusY;
			//[FieldOffset(24)]
			/*internal*/ Point Center;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle hRadiusXAnimations;
			//[FieldOffset(48)]
			/*internal*/ DUCE.ResourceHandle hRadiusYAnimations;
			//[FieldOffset(52)]
			/*internal*/ DUCE.ResourceHandle hCenterAnimations;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_GEOMETRYGROUP
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(12)]
			/*internal*/ FillRule FillRule;
			//[FieldOffset(16)]
			/*internal*/ uint ChildrenSize;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_COMBINEDGEOMETRY
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(12)]
			/*internal*/ GeometryCombineMode GeometryCombineMode;
			//[FieldOffset(16)]
			/*internal*/ DUCE.ResourceHandle hGeometry1;
			//[FieldOffset(20)]
			/*internal*/ DUCE.ResourceHandle hGeometry2;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_PATHGEOMETRY
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(12)]
			/*internal*/ FillRule FillRule;
			//[FieldOffset(16)]
			/*internal*/ uint FiguresSize;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_SOLIDCOLORBRUSH
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Opacity;
			//[FieldOffset(16)]
			/*internal*/ MilColorF Color;
			//[FieldOffset(32)]
			/*internal*/ DUCE.ResourceHandle hOpacityAnimations;
			//[FieldOffset(36)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hRelativeTransform;
			//[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle hColorAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_LINEARGRADIENTBRUSH
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Opacity;
			//[FieldOffset(16)]
			/*internal*/ Point StartPoint;
			//[FieldOffset(32)]
			/*internal*/ Point EndPoint;
			//[FieldOffset(48)]
			/*internal*/ DUCE.ResourceHandle hOpacityAnimations;
			//[FieldOffset(52)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(56)]
			/*internal*/ DUCE.ResourceHandle hRelativeTransform;
			//[FieldOffset(60)]
			/*internal*/ ColorInterpolationMode ColorInterpolationMode;
			//[FieldOffset(64)]
			/*internal*/ BrushMappingMode MappingMode;
			//[FieldOffset(68)]
			/*internal*/ GradientSpreadMethod SpreadMethod;
			//[FieldOffset(72)]
			/*internal*/ uint GradientStopsSize;
			//[FieldOffset(76)]
			/*internal*/ DUCE.ResourceHandle hStartPointAnimations;
			//[FieldOffset(80)]
			/*internal*/ DUCE.ResourceHandle hEndPointAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_RADIALGRADIENTBRUSH
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Opacity;
			//[FieldOffset(16)]
			/*internal*/ Point Center;
			//[FieldOffset(32)]
			/*internal*/ double RadiusX;
			//[FieldOffset(40)]
			/*internal*/ double RadiusY;
			//[FieldOffset(48)]
			/*internal*/ Point GradientOrigin;
			//[FieldOffset(64)]
			/*internal*/ DUCE.ResourceHandle hOpacityAnimations;
			//[FieldOffset(68)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(72)]
			/*internal*/ DUCE.ResourceHandle hRelativeTransform;
			//[FieldOffset(76)]
			/*internal*/ ColorInterpolationMode ColorInterpolationMode;
			//[FieldOffset(80)]
			/*internal*/ BrushMappingMode MappingMode;
			//[FieldOffset(84)]
			/*internal*/ GradientSpreadMethod SpreadMethod;
			//[FieldOffset(88)]
			/*internal*/ uint GradientStopsSize;
			//[FieldOffset(92)]
			/*internal*/ DUCE.ResourceHandle hCenterAnimations;
			//[FieldOffset(96)]
			/*internal*/ DUCE.ResourceHandle hRadiusXAnimations;
			//[FieldOffset(100)]
			/*internal*/ DUCE.ResourceHandle hRadiusYAnimations;
			//[FieldOffset(104)]
			/*internal*/ DUCE.ResourceHandle hGradientOriginAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_IMAGEBRUSH
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Opacity;
			//[FieldOffset(16)]
			/*internal*/ Rect Viewport;
			//[FieldOffset(48)]
			/*internal*/ Rect Viewbox;
			//[FieldOffset(80)]
			/*internal*/ double CacheInvalidationThresholdMinimum;
			//[FieldOffset(88)]
			/*internal*/ double CacheInvalidationThresholdMaximum;
			//[FieldOffset(96)]
			/*internal*/ DUCE.ResourceHandle hOpacityAnimations;
			//[FieldOffset(100)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(104)]
			/*internal*/ DUCE.ResourceHandle hRelativeTransform;
			//[FieldOffset(108)]
			/*internal*/ BrushMappingMode ViewportUnits;
			//[FieldOffset(112)]
			/*internal*/ BrushMappingMode ViewboxUnits;
			//[FieldOffset(116)]
			/*internal*/ DUCE.ResourceHandle hViewportAnimations;
			//[FieldOffset(120)]
			/*internal*/ DUCE.ResourceHandle hViewboxAnimations;
			//[FieldOffset(124)]
			/*internal*/ Stretch Stretch;
			//[FieldOffset(128)]
			/*internal*/ TileMode TileMode;
			//[FieldOffset(132)]
			/*internal*/ AlignmentX AlignmentX;
			//[FieldOffset(136)]
			/*internal*/ AlignmentY AlignmentY;
			//[FieldOffset(140)]
			/*internal*/ CachingHint CachingHint;
			//[FieldOffset(144)]
			/*internal*/ DUCE.ResourceHandle hImageSource;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_DRAWINGBRUSH
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Opacity;
			//[FieldOffset(16)]
			/*internal*/ Rect Viewport;
			//[FieldOffset(48)]
			/*internal*/ Rect Viewbox;
			//[FieldOffset(80)]
			/*internal*/ double CacheInvalidationThresholdMinimum;
			//[FieldOffset(88)]
			/*internal*/ double CacheInvalidationThresholdMaximum;
			//[FieldOffset(96)]
			/*internal*/ DUCE.ResourceHandle hOpacityAnimations;
			//[FieldOffset(100)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(104)]
			/*internal*/ DUCE.ResourceHandle hRelativeTransform;
			//[FieldOffset(108)]
			/*internal*/ BrushMappingMode ViewportUnits;
			//[FieldOffset(112)]
			/*internal*/ BrushMappingMode ViewboxUnits;
			//[FieldOffset(116)]
			/*internal*/ DUCE.ResourceHandle hViewportAnimations;
			//[FieldOffset(120)]
			/*internal*/ DUCE.ResourceHandle hViewboxAnimations;
			//[FieldOffset(124)]
			/*internal*/ Stretch Stretch;
			//[FieldOffset(128)]
			/*internal*/ TileMode TileMode;
			//[FieldOffset(132)]
			/*internal*/ AlignmentX AlignmentX;
			//[FieldOffset(136)]
			/*internal*/ AlignmentY AlignmentY;
			//[FieldOffset(140)]
			/*internal*/ CachingHint CachingHint;
			//[FieldOffset(144)]
			/*internal*/ DUCE.ResourceHandle hDrawing;
		}
		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VISUALBRUSH
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Opacity;
			//[FieldOffset(16)]
			/*internal*/ Rect Viewport;
			//[FieldOffset(48)]
			/*internal*/ Rect Viewbox;
			//[FieldOffset(80)]
			/*internal*/ double CacheInvalidationThresholdMinimum;
			//[FieldOffset(88)]
			/*internal*/ double CacheInvalidationThresholdMaximum;
			//[FieldOffset(96)]
			/*internal*/ DUCE.ResourceHandle hOpacityAnimations;
			//[FieldOffset(100)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(104)]
			/*internal*/ DUCE.ResourceHandle hRelativeTransform;
			//[FieldOffset(108)]
			/*internal*/ BrushMappingMode ViewportUnits;
			//[FieldOffset(112)]
			/*internal*/ BrushMappingMode ViewboxUnits;
			//[FieldOffset(116)]
			/*internal*/ DUCE.ResourceHandle hViewportAnimations;
			//[FieldOffset(120)]
			/*internal*/ DUCE.ResourceHandle hViewboxAnimations;
			//[FieldOffset(124)]
			/*internal*/ Stretch Stretch;
			//[FieldOffset(128)]
			/*internal*/ TileMode TileMode;
			//[FieldOffset(132)]
			/*internal*/ AlignmentX AlignmentX;
			//[FieldOffset(136)]
			/*internal*/ AlignmentY AlignmentY;
			//[FieldOffset(140)]
			/*internal*/ CachingHint CachingHint;
			//[FieldOffset(144)]
			/*internal*/ DUCE.ResourceHandle hVisual;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_BITMAPCACHEBRUSH
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Opacity;
			//[FieldOffset(16)]
			/*internal*/ DUCE.ResourceHandle hOpacityAnimations;
			//[FieldOffset(20)]
			/*internal*/ DUCE.ResourceHandle hTransform;
			//[FieldOffset(24)]
			/*internal*/ DUCE.ResourceHandle hRelativeTransform;
			//[FieldOffset(28)]
			/*internal*/ DUCE.ResourceHandle hBitmapCache;
			//[FieldOffset(32)]
			/*internal*/ DUCE.ResourceHandle hInternalTarget;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_DASHSTYLE
		{
			//[FieldOffset(0)]
			/*internal*/ MILCMD Type;
			//[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
			//[FieldOffset(8)]
			/*internal*/ double Offset;
			//[FieldOffset(16)]
			/*internal*/ DUCE.ResourceHandle hOffsetAnimations;
			//[FieldOffset(20)]
			/*internal*/ uint DashesSize;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_PEN
		{
//			[FieldOffset(0)]
			/*internal*/ MILCMD Type;
//			[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
//			[FieldOffset(8)]
			/*internal*/ double Thickness;
//			[FieldOffset(16)]
			/*internal*/ double MiterLimit;
//			[FieldOffset(24)]
			/*internal*/ DUCE.ResourceHandle hBrush;
//			[FieldOffset(28)]
			/*internal*/ DUCE.ResourceHandle hThicknessAnimations;
//			[FieldOffset(32)]
			/*internal*/ PenLineCap StartLineCap;
//			[FieldOffset(36)]
			/*internal*/ PenLineCap EndLineCap;
//			[FieldOffset(40)]
			/*internal*/ PenLineCap DashCap;
//			[FieldOffset(44)]
			/*internal*/ PenLineJoin LineJoin;
//			[FieldOffset(48)]
			/*internal*/ DUCE.ResourceHandle hDashStyle;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_GEOMETRYDRAWING
		{
//			[FieldOffset(0)]
			/*internal*/ MILCMD Type;
//			[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
//			[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hBrush;
//			[FieldOffset(12)]
			/*internal*/ DUCE.ResourceHandle hPen;
//			[FieldOffset(16)]
			/*internal*/ DUCE.ResourceHandle hGeometry;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_GLYPHRUNDRAWING
		{
//			[FieldOffset(0)]
			/*internal*/ MILCMD Type;
//			[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
//			[FieldOffset(8)]
			/*internal*/ DUCE.ResourceHandle hGlyphRun;
//			[FieldOffset(12)]
			/*internal*/ DUCE.ResourceHandle hForegroundBrush;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_IMAGEDRAWING
		{
//			[FieldOffset(0)]
			/*internal*/ MILCMD Type;
//			[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
//			[FieldOffset(8)]
			/*internal*/ Rect Rect;
//			[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hImageSource;
//			[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle hRectAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_VIDEODRAWING
		{
//			[FieldOffset(0)]
			/*internal*/ MILCMD Type;
//			[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
//			[FieldOffset(8)]
			/*internal*/ Rect Rect;
//			[FieldOffset(40)]
			/*internal*/ DUCE.ResourceHandle hPlayer;
//			[FieldOffset(44)]
			/*internal*/ DUCE.ResourceHandle hRectAnimations;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_DRAWINGGROUP
		{
//			[FieldOffset(0)]
			/*internal*/ MILCMD Type;
//			[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
//			[FieldOffset(8)]
			/*internal*/ double Opacity;
//			[FieldOffset(16)]
			/*internal*/ uint ChildrenSize;
//			[FieldOffset(20)]
			/*internal*/ DUCE.ResourceHandle hClipGeometry;
//			[FieldOffset(24)]
			/*internal*/ DUCE.ResourceHandle hOpacityAnimations;
//			[FieldOffset(28)]
			/*internal*/ DUCE.ResourceHandle hOpacityMask;
//			[FieldOffset(32)]
			/*internal*/ DUCE.ResourceHandle hTransform;
//			[FieldOffset(36)]
			/*internal*/ DUCE.ResourceHandle hGuidelineSet;
//			[FieldOffset(40)]
			/*internal*/ EdgeMode EdgeMode;
//			[FieldOffset(44)]
			/*internal*/ BitmapScalingMode bitmapScalingMode;
//			[FieldOffset(48)]
			/*internal*/ ClearTypeHint ClearTypeHint;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_GUIDELINESET
		{
//			[FieldOffset(0)]
			/*internal*/ MILCMD Type;
//			[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
//			[FieldOffset(8)]
			/*internal*/ uint GuidelinesXSize;
//			[FieldOffset(12)]
			/*internal*/ uint GuidelinesYSize;
//			[FieldOffset(16)]
			/*internal*/ uint IsDynamic;
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MILCMD_BITMAPCACHE
		{
//			[FieldOffset(0)]
			/*internal*/ MILCMD Type;
//			[FieldOffset(4)]
			/*internal*/ DUCE.ResourceHandle Handle;
//			[FieldOffset(8)]
			/*internal*/ double RenderAtScale;
//			[FieldOffset(16)]
			/*internal*/ DUCE.ResourceHandle hRenderAtScaleAnimations;
//			[FieldOffset(20)]
			/*internal*/ uint SnapsToDevicePixels;
//			[FieldOffset(24)]
			/*internal*/ uint EnableClearType;
		}
		/*internal*/ enum ResourceType
		{
			TYPE_NULL,
			TYPE_MEDIAPLAYER,
			TYPE_ROTATION3D,
			TYPE_AXISANGLEROTATION3D,
			TYPE_QUATERNIONROTATION3D,
			TYPE_CAMERA,
			TYPE_PROJECTIONCAMERA,
			TYPE_PERSPECTIVECAMERA,
			TYPE_ORTHOGRAPHICCAMERA,
			TYPE_MATRIXCAMERA,
			TYPE_MODEL3D,
			TYPE_MODEL3DGROUP,
			TYPE_LIGHT,
			TYPE_AMBIENTLIGHT,
			TYPE_DIRECTIONALLIGHT,
			TYPE_POINTLIGHTBASE,
			TYPE_POINTLIGHT,
			TYPE_SPOTLIGHT,
			TYPE_GEOMETRYMODEL3D,
			TYPE_GEOMETRY3D,
			TYPE_MESHGEOMETRY3D,
			TYPE_MATERIAL,
			TYPE_MATERIALGROUP,
			TYPE_DIFFUSEMATERIAL,
			TYPE_SPECULARMATERIAL,
			TYPE_EMISSIVEMATERIAL,
			TYPE_TRANSFORM3D,
			TYPE_TRANSFORM3DGROUP,
			TYPE_AFFINETRANSFORM3D,
			TYPE_TRANSLATETRANSFORM3D,
			TYPE_SCALETRANSFORM3D,
			TYPE_ROTATETRANSFORM3D,
			TYPE_MATRIXTRANSFORM3D,
			TYPE_PIXELSHADER,
			TYPE_IMPLICITINPUTBRUSH,
			TYPE_EFFECT,
			TYPE_BLUREFFECT,
			TYPE_DROPSHADOWEFFECT,
			TYPE_SHADEREFFECT,
			TYPE_VISUAL,
			TYPE_VIEWPORT3DVISUAL,
			TYPE_VISUAL3D,
			TYPE_GLYPHRUN,
			TYPE_RENDERDATA,
			TYPE_DRAWINGCONTEXT,
			TYPE_RENDERTARGET,
			TYPE_HWNDRENDERTARGET,
			TYPE_GENERICRENDERTARGET,
			TYPE_ETWEVENTRESOURCE,
			TYPE_DOUBLERESOURCE,
			TYPE_COLORRESOURCE,
			TYPE_POINTRESOURCE,
			TYPE_RECTRESOURCE,
			TYPE_SIZERESOURCE,
			TYPE_MATRIXRESOURCE,
			TYPE_POINT3DRESOURCE,
			TYPE_VECTOR3DRESOURCE,
			TYPE_QUATERNIONRESOURCE,
			TYPE_IMAGESOURCE,
			TYPE_DRAWINGIMAGE,
			TYPE_TRANSFORM,
			TYPE_TRANSFORMGROUP,
			TYPE_TRANSLATETRANSFORM,
			TYPE_SCALETRANSFORM,
			TYPE_SKEWTRANSFORM,
			TYPE_ROTATETRANSFORM,
			TYPE_MATRIXTRANSFORM,
			TYPE_GEOMETRY,
			TYPE_LINEGEOMETRY,
			TYPE_RECTANGLEGEOMETRY,
			TYPE_ELLIPSEGEOMETRY,
			TYPE_GEOMETRYGROUP,
			TYPE_COMBINEDGEOMETRY,
			TYPE_PATHGEOMETRY,
			TYPE_BRUSH,
			TYPE_SOLIDCOLORBRUSH,
			TYPE_GRADIENTBRUSH,
			TYPE_LINEARGRADIENTBRUSH,
			TYPE_RADIALGRADIENTBRUSH,
			TYPE_TILEBRUSH,
			TYPE_IMAGEBRUSH,
			TYPE_DRAWINGBRUSH,
			TYPE_VISUALBRUSH,
			TYPE_BITMAPCACHEBRUSH,
			TYPE_DASHSTYLE,
			TYPE_PEN,
			TYPE_DRAWING,
			TYPE_GEOMETRYDRAWING,
			TYPE_GLYPHRUNDRAWING,
			TYPE_IMAGEDRAWING,
			TYPE_VIDEODRAWING,
			TYPE_DRAWINGGROUP,
			TYPE_GUIDELINESET,
			TYPE_CACHEMODE,
			TYPE_BITMAPCACHE,
			TYPE_BITMAPSOURCE,
			TYPE_DOUBLEBUFFEREDBITMAP,
			TYPE_D3DIMAGE
		}
//		[StructLayout(LayoutKind.Explicit, Pack = 1)]
		/*internal*/ class MIL_GRADIENTSTOP
		{
//			[FieldOffset(0)]
			/*internal*/ double Position;
//			[FieldOffset(8)]
			/*internal*/ MilColorF Color;
		}
//		[SecurityCritical(SecurityCriticalScope.Everything), SuppressUnmanagedCodeSecurity]
		private static class UnsafeNativeMethods
		{
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilResource_CreateOrAddRefOnChannel(IntPtr pChannel, DUCE.ResourceType resourceType, ref DUCE.ResourceHandle hResource);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilResource_DuplicateHandle(IntPtr pSourceChannel, DUCE.ResourceHandle original, IntPtr pTargetChannel, ref DUCE.ResourceHandle duplicate);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilConnection_CreateChannel(IntPtr pTransport, IntPtr hChannel, out IntPtr channelHandle);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilConnection_DestroyChannel(IntPtr channelHandle);
//			[DllImport("wpfgfx_v0400.dll", EntryPoint = "MilChannel_CloseBatch")]
			/*internal*/ static extern int MilConnection_CloseBatch(IntPtr channelHandle);
//			[DllImport("wpfgfx_v0400.dll", EntryPoint = "MilChannel_CommitChannel")]
			/*internal*/ static extern int MilConnection_CommitChannel(IntPtr channelHandle);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int WgxConnection_SameThreadPresent(IntPtr pConnection);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilChannel_GetMarshalType(IntPtr channelHandle, out ChannelMarshalType marshalType);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ /*unsafe*/ static extern int MilResource_SendCommand(byte* pbData, uint cbSize, boolean sendInSeparateBatch, IntPtr pChannel);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ /*unsafe*/ static extern int MilChannel_BeginCommand(IntPtr pChannel, byte* pbData, uint cbSize, uint cbExtra);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ /*unsafe*/ static extern int MilChannel_AppendCommandData(IntPtr pChannel, byte* pbData, uint cbSize);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilChannel_EndCommand(IntPtr pChannel);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilResource_SendCommandMedia(DUCE.ResourceHandle handle, SafeMediaHandle pMedia, IntPtr pChannel, boolean notifyUceDirect);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilResource_SendCommandBitmapSource(DUCE.ResourceHandle handle, BitmapSourceSafeMILHandle pBitmapSource, IntPtr pChannel);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilResource_ReleaseOnChannel(IntPtr pChannel, DUCE.ResourceHandle hResource, out int deleted);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilChannel_SetNotificationWindow(IntPtr pChannel, IntPtr hwnd, WindowMessage message);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilComposition_WaitForNextMessage(IntPtr pChannel, int nCount, IntPtr[] handles, int bWaitAll, uint waitTimeout, out int waitReturn);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilComposition_PeekNextMessage(IntPtr pChannel, out DUCE.MilMessage.Message message, IntPtr messageSize, out int messageRetrieved);
//			[DllImport("wpfgfx_v0400.dll")]
			/*internal*/ static extern int MilResource_GetRefCountOnChannel(IntPtr pChannel, DUCE.ResourceHandle hResource, out uint refCount);
		}
		/*internal*/ /*const*/static final uint waitInfinite = 4294967295u;
//		[SecurityCritical]
		/*internal*/ /*unsafe*/ static void CopyBytes(byte* pbTo, byte* pbFrom, int cbData)
		{
			for (int i = 0; i < cbData / 4; i++)
			{
				*(int*)(pbTo + (IntPtr)i * 4 / 1) = *(int*)(pbFrom + (IntPtr)i * 4 / 1);
			}
		}
//		[TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
		public DUCE()
		{
		}
	}