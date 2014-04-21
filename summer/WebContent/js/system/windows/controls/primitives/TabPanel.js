/**
 * TabPanel
 */

define(["dojo/_base/declare", "system/Type", "controls/Panel"], 
		function(declare, Type, Panel){
	var TabPanel = declare("TabPanel", Panel,{
		constructor:function(){
//	        private int 
			this._numRows = 1;       // Nubmer of row calculated in measure and used in arrange 
//	        private int 
			this._numHeaders = 0;    // Number of headers excluding the collapsed items 
//	        private double 
			this._rowHeight = 0;  // Maximum of all headers height
		},
		
	       /// <summary> 
        /// Updates DesiredSize of the TabPanel.  Called by parent UIElement.  This is the first pass of layout.
        /// </summary> 
        /// <remarks>
        /// TabPanel
        /// </remarks>
        /// <param name="constraint">Constraint size is an "upper limit" that TabPanel should not exceed.</param> 
        /// <returns>TabPanel' desired size.</returns>
//        protected override Size 
		MeasureOverride:function(/*Size constraint*/) 
        { 
            var tabAlignment = this.TabStripPlacement; 

            _numRows = 1;
            _numHeaders = 0;
            _rowHeight = 0; 

            // For top and bottom placement the panel flow its children to calculate the number of rows and 
            // desired vertical size 
            if (tabAlignment == Dock.Top || tabAlignment == Dock.Bottom)
            { 
                for/*each*/ (var i=0; i<this.InternalChildren.Count; i++) //UIElement child in InternalChildren) 
                {
                	var child = this.InternalChildren.Get(i);
                    if (child.Visibility == Visibility.Collapsed) 
                        continue; 

                    _numHeaders++; 

                    // Helper measures child, and deals with Min, Max, and base Width & Height properties.
                    // Helper returns the size a child needs to take up (DesiredSize or property specified size).
                    child.Measure(constraint); 
                } 
            } 
            else if (tabAlignment == Dock.Left || tabAlignment == Dock.Right)
            {
                for/*each*/ (var i=0; i<this.InternalChildren.Count; i++) //UIElement child in InternalChildren)
                { 
                	var child = this.InternalChildren.Get(i);
                    if (child.Visibility == Visibility.Collapsed)
                        continue; 
 
                    _numHeaders++;
 
                    // Helper measures child, and deals with Min, Max, and base Width & Height properties.
                    // Helper returns the size a child needs to take up (DesiredSize or property specified size).
                    child.Measure(constraint);
                }
            }
 
            // Returns our minimum size & sets DesiredSize.
            return contentSize; 
        },

        /// <summary> 
        /// TabPanel arranges each of its children.
        /// </summary>
        /// <param name="arrangeSize">Size that TabPanel will assume to position children.</param>
//        protected override Size 
        ArrangeOverride:function() 
        {
            var tabAlignment = this.TabStripPlacement; 
            if (tabAlignment == Dock.Top || tabAlignment == Dock.Bottom) 
            {
                ArrangeHorizontal(arrangeSize); 
            }
            else if (tabAlignment == Dock.Left || tabAlignment == Dock.Right)
            {
                ArrangeVertical(arrangeSize); 
            }
            return arrangeSize; 
        },

        /// <summary> 
        /// Override of <seealso cref="UIElement.GetLayoutClip"/>.
        /// </summary>
        /// <returns>Geometry to use as additional clip in case when element is larger then available space</returns>
//        protected override Geometry 
        GetLayoutClip:function(/*Size*/ layoutSlotSize) 
        {
            return null; 
        }, 
 
//        private Size 
        GetDesiredSizeWithoutMargin:function(/*UIElement*/ element)
        {
            Thickness margin = (Thickness)element.GetValue(MarginProperty);
            Size desiredSizeWithoutMargin = new Size(); 
            desiredSizeWithoutMargin.Height = Math.Max(0d, element.DesiredSize.Height - margin.Top - margin.Bottom);
            desiredSizeWithoutMargin.Width = Math.Max(0d, element.DesiredSize.Width - margin.Left - margin.Right); 
            return desiredSizeWithoutMargin; 
        },
 
//        private void 
        ArrangeHorizontal:function(/*Size*/ arrangeSize)
        { 
            var tabAlignment = TabStripPlacement;
            bool isMultiRow = _numRows > 1;
            int activeRow = 0;
            int[] solution = new int[0]; 
            Vector childOffset = new Vector();
            double[] headerSize = GetHeadersSize(); 
 
            // If we have multirows, then calculate the best header distribution
            if (isMultiRow) 
            {
                solution = CalculateHeaderDistribution(arrangeSize.Width, headerSize);
                activeRow = GetActiveRow(solution);
 
                // TabPanel starts to layout children depend on activeRow which should be always on bottom (top)
                // The first row should start from Y = (_numRows - 1 - activeRow) * _rowHeight 
                if (tabAlignment == Dock.Top) 
                    childOffset.Y = (_numRows - 1 - activeRow) * _rowHeight;
 
                if (tabAlignment == Dock.Bottom && activeRow != 0)
                    childOffset.Y = (_numRows - activeRow) * _rowHeight;
            }
 
            int childIndex = 0;
            int separatorIndex = 0; 
            foreach (UIElement child in InternalChildren) 
            {
                if (child.Visibility == Visibility.Collapsed) 
                    continue;

                Thickness margin = (Thickness)child.GetValue(MarginProperty);
                double leftOffset = margin.Left; 
                double rightOffset = margin.Right;
                double topOffset = margin.Top; 
                double bottomOffset = margin.Bottom; 

                bool lastHeaderInRow = isMultiRow && (separatorIndex < solution.Length && solution[separatorIndex] == childIndex || childIndex == _numHeaders - 1); 

                //Length left, top, right, bottom;
                Size cellSize = new Size(headerSize[childIndex], _rowHeight);
 
                // Align the last header in the row; If headers are not aligned directional nav would not work correctly
                if (lastHeaderInRow) 
                { 
                    cellSize.Width = arrangeSize.Width - childOffset.X;
                } 

                child.Arrange(new Rect(childOffset.X, childOffset.Y, cellSize.Width, cellSize.Height));

                Size childSize = cellSize; 
                childSize.Height = Math.Max(0d, childSize.Height - topOffset - bottomOffset);
                childSize.Width = Math.Max(0d, childSize.Width - leftOffset - rightOffset); 
 
                // Calculate the offset for the next child
                childOffset.X += cellSize.Width; 
                if (lastHeaderInRow)
                {
                    if ((separatorIndex == activeRow && tabAlignment == Dock.Top) ||
                        (separatorIndex == activeRow - 1 && tabAlignment == Dock.Bottom)) 
                        childOffset.Y = 0d;
                    else 
                        childOffset.Y += _rowHeight; 

                    childOffset.X = 0d; 
                    separatorIndex++;
                }

                childIndex++; 
            }
        },
 
//        private void 
        ArrangeVertical:function(/*Size*/ arrangeSize)
        { 
            double childOffsetY = 0d;
            foreach (UIElement child in InternalChildren)
            {
                if (child.Visibility != Visibility.Collapsed) 
                {
                    Size childSize = GetDesiredSizeWithoutMargin(child); 
                    child.Arrange(new Rect(0, childOffsetY, arrangeSize.Width, childSize.Height)); 

                    // Calculate the offset for the next child 
                    childOffsetY += childSize.Height;
                }
            }
        }, 

        // Returns the row which contain the child with IsSelected==true 
//        private int 
        GetActiveRow:function(/*int[]*/ solution) 
        {
            int activeRow = 0; 
            int childIndex = 0;
            if (solution.Length > 0)
            {
                foreach (UIElement child in InternalChildren) 
                {
                    if (child.Visibility == Visibility.Collapsed) 
                        continue; 

                    var isActiveTab = child.GetValue(Selector.IsSelectedProperty); 

                    if (isActiveTab)
                    {
                        return activeRow; 
                    }
 
                    if (activeRow < solution.Length && solution[activeRow] == childIndex) 
                    {
                        activeRow++; 
                    }

                    childIndex++;
                } 
            }
 
            // If the is no selected element and aligment is Top  - then the active row is the last row 
            if (TabStripPlacement == Dock.Top)
            { 
                activeRow = _numRows - 1;
            }

            return activeRow; 
        },
        
        /*   TabPanel layout calculation: 

        After measure call we have: 
        rowWidthLimit - width of the TabPanel
        Header[0..n-1]  - headers
        headerWidth[0..n-1] - header width
 
        Calculated values:
        numSeparators                       - number of separators between numSeparators+1 rows 
        rowWidth[0..numSeparators]           - row width 
        rowHeaderCount[0..numSeparators]    - Row Count = number of headers on that row
        rowAverageGap[0..numSeparators]     - Average Gap for the row i = (rowWidth - rowWidth[i])/rowHeaderCount[i] 
        currentSolution[0..numSeparators-1] - separator currentSolution[i]=x means Header[x] and h[x+1] are separated with new line
        bestSolution[0..numSeparators-1]    - keep the last Best Solution
        bestSolutionRowAverageGap           - keep the last Best Solution Average Gap
 
        Between all separators distribution the best solution have minimum Average Gap -
        this is the amount of pixels added to the header (to justify) in the row 
 
        How does it work:
        First we flow the headers to calculate the number of necessary rows (numSeparators+1). 
        That means we need to insert numSeparators separators between n headers (numSeparators<n always).
        For each current state rowAverageGap[1..numSeparators+1] are calculated for each row.
        Current state rowAverageGap = MAX (rowAverageGap[1..numSeparators+1]).
        Our goal is to find the solution with MIN (rowAverageGap). 
        On each iteration step we move a header from a previous row to the row with maximum rowAverageGap.
        We countinue the itterations only if we move to better solution, i.e. rowAverageGap is smaller. 
        Maximum iteration steps are less the number of headers. 

        */ 
        // Input: Row width and width of all headers
        // Output: int array which size is the number of separators and contains each separator position
//        private int[] 
        CalculateHeaderDistribution:function(/*double*/ rowWidthLimit, /*double[]*/ headerWidth)
        { 
            double bestSolutionMaxRowAverageGap = 0;
            int numHeaders = headerWidth.Length; 
 
            int numSeparators = _numRows - 1;
            double currentRowWidth = 0; 
            int numberOfHeadersInCurrentRow = 0;
            double currentAverageGap = 0;
            int[] currentSolution = new int[numSeparators];
            int[] bestSolution = new int[numSeparators]; 
            int[] rowHeaderCount = new int[_numRows];
            double[] rowWidth = new double[_numRows]; 
            double[] rowAverageGap = new double[_numRows]; 
            double[] bestSolutionRowAverageGap = new double[_numRows];
 
            // Initialize the current state; Do the initial flow of the headers
            int currentRowIndex = 0;

            for (int index = 0; index < numHeaders; index++) 
            {
                if (currentRowWidth + headerWidth[index] > rowWidthLimit && numberOfHeadersInCurrentRow > 0) 
                { // if we cannot add next header - flow to next row 
                    // Store current row before we go to the next
                    rowWidth[currentRowIndex] = currentRowWidth; // Store the current row width 
                    rowHeaderCount[currentRowIndex] = numberOfHeadersInCurrentRow; // For each row we store the number os headers inside
                    currentAverageGap = Math.Max(0d, (rowWidthLimit - currentRowWidth) / numberOfHeadersInCurrentRow); // The amout of width that should be added to justify the header
                    rowAverageGap[currentRowIndex] = currentAverageGap;
                    currentSolution[currentRowIndex] = index - 1; // Separator points to the last header in the row 
                    if (bestSolutionMaxRowAverageGap < currentAverageGap) // Remember the maximum of all currentAverageGap
                        bestSolutionMaxRowAverageGap = currentAverageGap; 
 
                    // Iterate to next row
                    currentRowIndex++; 
                    currentRowWidth = headerWidth[index]; // Accumulate header widths on the same row
                    numberOfHeadersInCurrentRow = 1;
                }
                else 
                {
                    currentRowWidth += headerWidth[index]; // Accumulate header widths on the same row 
                    // Increase the number of headers only if they are not collapsed (width=0) 
                    if (headerWidth[index] != 0)
                        numberOfHeadersInCurrentRow++; 
                }
            }

            // If everithing fit in 1 row then exit (no separators needed) 
            if (currentRowIndex == 0)
                return new int[0]; 
 
            // Add the last row
            rowWidth[currentRowIndex] = currentRowWidth; 
            rowHeaderCount[currentRowIndex] = numberOfHeadersInCurrentRow;
            currentAverageGap = (rowWidthLimit - currentRowWidth) / numberOfHeadersInCurrentRow;
            rowAverageGap[currentRowIndex] = currentAverageGap;
            if (bestSolutionMaxRowAverageGap < currentAverageGap) 
                bestSolutionMaxRowAverageGap = currentAverageGap;
 
            currentSolution.CopyTo(bestSolution, 0); // Remember the first solution as initial bestSolution 
            rowAverageGap.CopyTo(bestSolutionRowAverageGap, 0); // bestSolutionRowAverageGap is used in ArrangeOverride to calculate header sizes
 
            // Search for the best solution
            // The exit condition if when we cannot move header to the next row
            while (true)
            { 
                // Find the row with maximum AverageGap
                int worstRowIndex = 0; // Keep the row index with maximum AverageGap 
                double maxAG = 0; 

                for (int i = 0; i < _numRows; i++) // for all rows 
                {
                    if (maxAG < rowAverageGap[i])
                    {
                        maxAG = rowAverageGap[i]; 
                        worstRowIndex = i;
                    } 
                } 

                // If we are on the first row - cannot move from previous 
                if (worstRowIndex == 0)
                    break;

                // From the row with maximum AverageGap we try to move a header from previous row 
                int moveToRow = worstRowIndex;
                int moveFromRow = moveToRow - 1; 
                int moveHeader = currentSolution[moveFromRow]; 
                double movedHeaderWidth = headerWidth[moveHeader];
 
                rowWidth[moveToRow] += movedHeaderWidth;

                // If the moved header cannot fit - exit. We have the best solution already.
                if (rowWidth[moveToRow] > rowWidthLimit) 
                    break;
 
                // If header is moved successfully to the worst row 
                // we update the arrays keeping the row state
                currentSolution[moveFromRow]--; 
                rowHeaderCount[moveToRow]++;
                rowWidth[moveFromRow] -= movedHeaderWidth;
                rowHeaderCount[moveFromRow]--;
                rowAverageGap[moveFromRow] = (rowWidthLimit - rowWidth[moveFromRow]) / rowHeaderCount[moveFromRow]; 
                rowAverageGap[moveToRow] = (rowWidthLimit - rowWidth[moveToRow]) / rowHeaderCount[moveToRow];
 
                // EvaluateSolution: 
                // If the current solution is better than bestSolution - keep it in bestSolution
                maxAG = 0; 
                for (int i = 0; i < _numRows; i++) // for all rows
                {
                    if (maxAG < rowAverageGap[i])
                    { 
                        maxAG = rowAverageGap[i];
                    } 
                } 

                if (maxAG < bestSolutionMaxRowAverageGap) 
                {
                    bestSolutionMaxRowAverageGap = maxAG;
                    currentSolution.CopyTo(bestSolution, 0);
                    rowAverageGap.CopyTo(bestSolutionRowAverageGap, 0); 
                }
            } 
 
            // Each header size should be increased so headers in the row stretch to fit the row
            currentRowIndex = 0; 
            for (int index = 0; index < numHeaders; index++)
            {
                headerWidth[index] += bestSolutionRowAverageGap[currentRowIndex];
                if (currentRowIndex < numSeparators && bestSolution[currentRowIndex] == index) 
                    currentRowIndex++;
            } 
            // Use the best solution bestSolution[0..numSeparators-1] to layout 
            return bestSolution;
        } 
	});
	
	Object.defineProperties(TabPanel.prototype,{
//        private Dock 
		TabStripPlacement:
        {
            get:function() 
            {
                var placement = Dock.Top; 
                var tc = this.TemplatedParent instanceof TabControl ? this.TemplatedParent : null; 
                if (tc != null)
                    placement = tc.TabStripPlacement; 
                return placement;
            }
        }
	});
	
	Object.defineProperties(TabPanel,{
		  
	});
	
//    static TabPanel()
	function Initialize()
    { 
        KeyboardNavigation.TabNavigationProperty.OverrideMetadata(typeof(TabPanel), new FrameworkPropertyMetadata(KeyboardNavigationMode.Once));
        KeyboardNavigation.DirectionalNavigationProperty.OverrideMetadata(typeof(TabPanel), new FrameworkPropertyMetadata(KeyboardNavigationMode.Cycle));
    }
	
	TabPanel.Type = new Type("TabPanel", TabPanel, [Panel.Type]);
	Initialize();
	
	return TabPanel;
});



