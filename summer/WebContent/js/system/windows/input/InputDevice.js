 /**
 * InputDevice
 */

define(["dojo/_base/declare", "system/Type", "threading/DispatcherObject"], 
		function(declare, Type, DispatcherObject){
	var InputDevice = declare("InputDevice", DispatcherObject,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(InputDevice.prototype,{
		  
	});
	
	InputDevice.Type = new Type("InputDevice", InputDevice, [DispatcherObject.Type]);
	return InputDevice;
});
//        /// <summary>
//        ///     Returns the element that input from this device is sent to. 
//        /// </summary>
//        public abstract IInputElement Target{get;} 
// 
//        /// <summary>
//        ///     Returns the PresentationSource that is reporting input for this device. 
//        /// </summary>
//        public abstract PresentationSource ActiveSource { get; }
