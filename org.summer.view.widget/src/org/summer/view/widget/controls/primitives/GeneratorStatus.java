package org.summer.view.widget.controls.primitives;

/// <summary> 
/// This enum is used by the ItemContainerGenerator to indicate its status.
/// </summary> 
public enum GeneratorStatus {
	// /<summary>The generator has not tried to generate content</summary>
	NotStarted,
	// /<summary>The generator is generating containers</summary>
	GeneratingContainers,
	// /<summary>The generator has finished generating containers</summary>
	ContainersGenerated,
	// /<summary>The generator has finished generating containers, but
	// encountered one or more errors</summary>
	Error
}