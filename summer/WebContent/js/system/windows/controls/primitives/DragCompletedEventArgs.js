/**
 * DragCompletedEventArgs
 */
/// <summary> 
/// This DragCompletedEventArgs class contains additional information about the 
/// DragCompleted event.
/// </summary> 
/// <seealso cref="Thumb.DragCompletedEvent" />
/// <seealso cref="RoutedEventArgs" />
define(["dojo/_base/declare", "system/Type", "controls/RoutedEventArgs"], 
		function(declare, Type, RoutedEventArgs){
	var DragCompletedEventArgs = declare("DragCompletedEventArgs", RoutedEventArgs,{
		constructor:function(/*double*/ horizontalChange, /*double*/ verticalChange, /*bool*/ canceled)
        {
//			 : base()
            this._horizontalChange = horizontalChange;
            this._verticalChange = verticalChange; 
            this._wasCanceled = canceled;
            this.RoutedEvent = Thumb.DragCompletedEvent; 
		},
        /// <summary> 
        /// This method is used to perform the proper type casting in order to
        /// call the type-safe DragCompletedEventHandler delegate for the DragCompletedEvent event.
        /// </summary>
        /// <param name="genericHandler">The handler to invoke.</param> 
        /// <param name="genericTarget">The current object along the event's route.</param>
        /// <returns>Nothing.</returns> 
        /// <seealso cref="Thumb.DragCompletedEvent" /> 
        /// <seealso cref="DragCompletedEventHandler" />
//        protected override void 
		InvokeEventHandler:function(/*Delegate*/ genericHandler, /*object*/ genericTarget) 
        {
            /*DragCompletedEventHandler*/var handler = /*(DragCompletedEventHandler)*/genericHandler;
            handler.Invoke(genericTarget, this);
        } 
	});
	
	Object.defineProperties(DragCompletedEventArgs.prototype,{
		/// <value> 
        /// Read-only access to the horizontal distance between the point where mouse's left-button
        /// was pressed and the point where mouse's left-button was released
        /// </value>
//        public double 
		HorizontalChange: 
        {
            get:function() { return this._horizontalChange; } 
        }, 

        /// <value> 
        /// Read-only access to the vertical distance between the point where mouse's left-button
        /// was pressed and the point where mouse's left-button was released
        /// </value>
//        public double 
		VerticalChange: 
        {
            get:function() { return this._verticalChange; } 
        }, 

        /// <summary> 
        /// Read-only access to boolean states whether the drag operation was canceled or not.
        /// </summary>
        /// <value></value>
//        public bool 
		Canceled: 
        {
            get:function() { return this._wasCanceled; } 
        }   
	});
	
	Object.defineProperties(DragCompletedEventArgs,{
		  
	});
	
	DragCompletedEventArgs.Type = new Type("DragCompletedEventArgs", DragCompletedEventArgs, [RoutedEventArgs.Type]);
	return DragCompletedEventArgs;
});


