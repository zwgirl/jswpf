/**
 */
package org.summer.view.widget.controls.primitives;

import org.eclipse.emf.ecore.EFactory;

/**
 * <!-- begin-user-doc -->
 * The <b>Factory</b> for the model.
 * It provides a create method for each non-abstract class of the model.
 * <!-- end-user-doc -->
 * @see org.summer.view.widget.controls.primitives.PrimitivesPackage
 * @generated
 */
public interface PrimitivesFactory extends EFactory {
	/**
	 * The singleton instance of the factory.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	PrimitivesFactory eINSTANCE = org.summer.view.widget.controls.primitives.impl.PrimitivesFactoryImpl.init();

	/**
	 * Returns a new object of class '<em>Multi Selector</em>'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return a new object of class '<em>Multi Selector</em>'.
	 * @generated
	 */
	MultiSelector createMultiSelector();

	/**
	 * Returns a new object of class '<em>Selector</em>'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return a new object of class '<em>Selector</em>'.
	 * @generated
	 */
	Selector createSelector();

	/**
	 * Returns a new object of class '<em>Menu Base</em>'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return a new object of class '<em>Menu Base</em>'.
	 * @generated
	 */
	MenuBase createMenuBase();

	/**
	 * Returns a new object of class '<em>Button Base</em>'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return a new object of class '<em>Button Base</em>'.
	 * @generated
	 */
	ButtonBase createButtonBase();

	/**
	 * Returns a new object of class '<em>Toggle Button</em>'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return a new object of class '<em>Toggle Button</em>'.
	 * @generated
	 */
	ToggleButton createToggleButton();

	/**
	 * Returns a new object of class '<em>Text Box Base</em>'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return a new object of class '<em>Text Box Base</em>'.
	 * @generated
	 */
	TextBoxBase createTextBoxBase();

	/**
	 * Returns a new object of class '<em>Range Base</em>'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return a new object of class '<em>Range Base</em>'.
	 * @generated
	 */
	RangeBase createRangeBase();

	/**
	 * Returns the package supported by this factory.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the package supported by this factory.
	 * @generated
	 */
	PrimitivesPackage getPrimitivesPackage();

} //PrimitivesFactory
