package org.summer.view.widget.documents;
public class TextEmbeddedObjectMetrics 
    {
        private double          _width; 
        private double          _height;
        private double          _baseline;

 
        /// <summary>
        /// Construct a text object size 
        /// </summary> 
        /// <param name="width">object width</param>
        /// <param name="height">object height</param> 
        /// <param name="baseline">object baseline in ratio relative to run height</param>
        public TextEmbeddedObjectMetrics(
            double          width,
            double          height, 
            double          baseline
            ) 
        { 
            _width = width;
            _height = height; 
            _baseline = baseline;
        }

 
        /// <summary>
        /// Object width 
        /// </summary> 
        public double Width
        { 
            get { return _width; }
        }

 
        /// <summary>
        /// Object height 
        /// </summary> 
        /// <value></value>
        public double Height 
        {
            get { return _height; }
        }
 

        /// <summary> 
        /// Object baseline in ratio relative to run height 
        /// </summary>
        public double Baseline 
        {
            get { return _baseline; }
        }
    } 