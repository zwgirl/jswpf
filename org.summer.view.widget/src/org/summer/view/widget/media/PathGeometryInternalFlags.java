package org.summer.view.widget.media;
#region PathGeometryInternalFlags
    [System.Flags]
    internal enum PathGeometryInternalFlags
    { 
        None            = 0x0,
        Invalid         = 0x1, 
        Dirty           = 0x2, 
        BoundsValid     = 0x4
    } 
    #endregion

    #region PathGeometry
   