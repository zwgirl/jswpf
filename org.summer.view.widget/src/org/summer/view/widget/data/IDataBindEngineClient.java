package org.summer.view.widget.data;

import org.summer.view.widget.DependencyObject;
 interface IDataBindEngineClient
    {
        void TransferValue(); 
        void UpdateValue();
        boolean AttachToContext(boolean lastChance); 
        void VerifySourceReference(boolean lastChance); 
        void OnTargetUpdated();
        DependencyObject TargetElement { get; } 
    }