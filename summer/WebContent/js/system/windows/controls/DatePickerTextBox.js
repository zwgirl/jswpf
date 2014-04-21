/**
 * DatePickerTextBox
 */

define(["dojo/_base/declare", "system/Type", "controls/TextBox", "windows/DependencyPropertyChangedEventHandler"], 
		function(declare, Type, TextBox, DependencyPropertyChangedEventHandler){
//	private const String 
	var ElementContentName = "PART_Watermark";
	
	var DatePickerTextBox = declare("DatePickerTextBox", TextBox,{
		constructor:function(){
//		       private ContentControl 
			this.elementContent = null;
            this.SetCurrentValue(DatePickerTextBox.WatermarkProperty, "Date"/*SR.Get(SRID.DatePickerTextBox_DefaultWatermarkText)*/); 
            this.AddLoadedHandler(new RoutedEventHandler(this, this.OnLoaded));
            this.AddIsEnabledChanged(new DependencyPropertyChangedEventHandler(this, this.OnDatePickerTextBoxIsEnabledChanged)); 
		},
		
		/// <summary>
        /// Called when template is applied to the control. 
        /// </summary>
//        public override void 
		OnApplyTemplate:function()
        {
			TextBox.protoype.OnApplyTemplate.call(this); 

            this.elementContent = this.ExtractTemplatePart/*<ContentControl>*/(ElementContentName, ContentControl); 
 
            // We dont want to expose watermark property as public yet, because there
            // is a good chance in future that the implementation will change when 
            // a WatermarkTextBox control gets implemented. This is mostly to
            // mimc SL. Hence setting the binding in code rather than in control template.
            if (this.elementContent != null)
            { 
                var watermarkBinding = new Binding("Watermark");
                watermarkBinding.Source = this; 
                this.elementContent.SetBinding(ContentControl.ContentProperty, watermarkBinding); 
            }
 
            this.OnWatermarkChanged();
        },

//        protected override void 
        OnGotFocus:function(/*RoutedEventArgs*/ e) 
        {
        	TextBox.protoype.OnGotFocus.call(this, e); 
            if (this.IsEnabled) 
            {
                if (!String.IsNullOrEmpty(this.Text)) 
                {
                    Select(0, this.Text.Length);
                }
            } 
        },

//        private void 
        OnLoaded:function(/*object*/ sender, /*RoutedEventArgs*/ e)
        {
            this.ApplyTemplate(); 
        },
 
        /// <summary> 
        /// Change to the correct visual state for the textbox.
        /// </summary> 
        /// <param name="useTransitions">
        /// true to use transitions when updating the visual state, false to
        /// snap directly to the new visual state.
        /// </param> 
//        internal override void 
        ChangeVisualState:function(/*bool*/ useTransitions)
        { 
            TextBox.prototype.ChangeVisualState.call(this, useTransitions); 

            // Update the WatermarkStates group 
            if (this.Watermark != null && String.IsNullOrEmpty(this.Text))
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateWatermarked, VisualStates.StateUnwatermarked);
            } 
            else
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateUnwatermarked); 
            }
        }, 

//        private T 
        ExtractTemplatePart/*<T>*/:function(/*String*/ partName, T) // where T : DependencyObject
        {
            var obj = this.GetTemplateChild(partName); 
            return ExtractTemplatePart/*<T>*/(partName, obj, T);
        },
        
        /// <summary> 
        /// Called when the IsEnabled property changes.
        /// </summary> 
        /// <param name="sender">Sender object</param>
        /// <param name="e">Property changed args</param>
//        private void 
        OnDatePickerTextBoxIsEnabledChanged:function(/*object*/ sender, /*DependencyPropertyChangedEventArgs*/ e)
        { 
//            Debug.Assert(e.NewValue is bool);
            var isEnabled = e.NewValue; 
 
            this.SetCurrentValueInternal(IsReadOnlyProperty, !isEnabled);
        },

//        private void 
        OnWatermarkChanged:function()
        {
            if (this.elementContent != null) 
            {
                var watermarkControl = this.Watermark instanceof Control ? this.Watermark : null; 
                if (watermarkControl != null) 
                {
                    watermarkControl.IsTabStop = false; 
                    watermarkControl.IsHitTestVisible = false;
                }
            }
        } 
	});
	
	Object.defineProperties(DatePickerTextBox.prototype,{
        /// <summary>
        /// Watermark content
        /// </summary>
        /// <value>The watermark.</value> 
//        internal object 
		Watermark:
        { 
            get:function() { return this.GetValue(DatePickerTextBox.WatermarkProperty); }, 
            set:function(value) { this.SetValue(DatePickerTextBox.WatermarkProperty, value); }
        } 

	});
	
	Object.defineProperties(DatePickerTextBox,{
        /// <summary> 
        /// Watermark dependency property
        /// </summary> 
//        internal static readonly DependencyProperty 
		WatermarkProperty:
        {
        	get:function(){
        		if(DatePicker._WatermarkProperty === undefined){
        			DatePicker._WatermarkProperty = DependencyProperty.Register( 
        		            "Watermark", Object.Type, DatePickerTextBox.Type, /*new PropertyMetadata(OnWatermarkPropertyChanged)*/
        		            PropertyMetadata.BuildWithPropChangeCB(new PropertyChangedCallback(null, OnWatermarkPropertyChanged)));  
        		}
        		
        		return DatePicker._WatermarkProperty;
        	}
        }, 
	});
	
//	private static T 
	function ExtractTemplatePart/*<T>*/(/*String*/ partName, /*DependencyObject*/ obj, T)//where T : DependencyObject
    { 
//        Debug.Assert(
//            obj == null || typeof(T).IsInstanceOfType(obj),
//            String.Format(CultureInfo.InvariantCulture, SR.Get(SRID.DatePickerTextBox_TemplatePartIsOfIncorrectType), partName, typeof(T).Name));
        return obj instanceof T ? obj : null; 
    }
	
    /// <summary> 
    /// Called when watermark property is changed. 
    /// </summary>
    /// <param name="sender">The sender.</param> 
    /// <param name="args">The <see cref="System.Windows.DependencyPropertyChangedEventArgs"/> instance containing the event data.</param>
//    private static void 
	function OnWatermarkPropertyChanged(/*DependencyObject*/ sender, /*DependencyPropertyChangedEventArgs*/ args)
    {
        var datePickerTextBox = sender instanceof DatePickerTextBox ? sender : null; 
//        Debug.Assert(datePickerTextBox != null, "The source is not an instance of a DatePickerTextBox!");
        datePickerTextBox.OnWatermarkChanged(); 
        datePickerTextBox.UpdateVisualState(); 
    }
	
    /// <summary>
    /// Static constructor 
    /// </summary>
//    static DatePickerTextBox()
	function Initialize()
    {
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(DatePickerTextBox.Type, 
        		/*new FrameworkPropertyMetadata(DatePickerTextBox.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(DatePickerTextBox.Type)); 
        TextBox.TextProperty.OverrideMetadata(DatePickerTextBox.Type, 
        		/*new FrameworkPropertyMetadata(OnVisualStatePropertyChanged)*/
        		FrameworkPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, Control.OnVisualStatePropertyChanged)));
    }
	
	DatePickerTextBox.Type = new Type("DatePickerTextBox", DatePickerTextBox, [TextBox.Type]);
	Initialize();
	
	return DatePickerTextBox;
});

 


