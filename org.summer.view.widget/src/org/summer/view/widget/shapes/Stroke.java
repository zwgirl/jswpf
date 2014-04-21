/**
 */
package org.summer.view.widget.shapes;

import org.eclipse.emf.ecore.EObject;
import org.summer.view.widget.style.Length;
import org.summer.view.widget.style.RGB;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Stroke</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * <ul>
 *   <li>{@link org.summer.view.widget.shapes.Stroke#getColor <em>Color</em>}</li>
 *   <li>{@link org.summer.view.widget.shapes.Stroke#getWidth <em>Width</em>}</li>
 *   <li>{@link org.summer.view.widget.shapes.Stroke#getDasharray <em>Dasharray</em>}</li>
 *   <li>{@link org.summer.view.widget.shapes.Stroke#getDashoffset <em>Dashoffset</em>}</li>
 *   <li>{@link org.summer.view.widget.shapes.Stroke#getLinecap <em>Linecap</em>}</li>
 *   <li>{@link org.summer.view.widget.shapes.Stroke#getLinejoin <em>Linejoin</em>}</li>
 *   <li>{@link org.summer.view.widget.shapes.Stroke#getLinemiterlimit <em>Linemiterlimit</em>}</li>
 * </ul>
 * </p>
 *
 * @see org.summer.view.widget.shapes.ShapesPackage#getStroke()
 * @model
 * @generated
 */
public interface Stroke extends EObject {
	/**
	 * Returns the value of the '<em><b>Color</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Color</em>' containment reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Color</em>' containment reference.
	 * @see #setColor(RGB)
	 * @see org.summer.view.widget.shapes.ShapesPackage#getStroke_Color()
	 * @model containment="true"
	 * @generated
	 */
	RGB getColor();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.shapes.Stroke#getColor <em>Color</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Color</em>' containment reference.
	 * @see #getColor()
	 * @generated
	 */
	void setColor(RGB value);

	/**
	 * Returns the value of the '<em><b>Width</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Width</em>' containment reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Width</em>' containment reference.
	 * @see #setWidth(Length)
	 * @see org.summer.view.widget.shapes.ShapesPackage#getStroke_Width()
	 * @model containment="true"
	 * @generated
	 */
	Length getWidth();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.shapes.Stroke#getWidth <em>Width</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Width</em>' containment reference.
	 * @see #getWidth()
	 * @generated
	 */
	void setWidth(Length value);

	/**
	 * Returns the value of the '<em><b>Dasharray</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Dasharray</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Dasharray</em>' attribute.
	 * @see #setDasharray(int)
	 * @see org.summer.view.widget.shapes.ShapesPackage#getStroke_Dasharray()
	 * @model
	 * @generated
	 */
	int getDasharray();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.shapes.Stroke#getDasharray <em>Dasharray</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Dasharray</em>' attribute.
	 * @see #getDasharray()
	 * @generated
	 */
	void setDasharray(int value);

	/**
	 * Returns the value of the '<em><b>Dashoffset</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Dashoffset</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Dashoffset</em>' attribute.
	 * @see #setDashoffset(int)
	 * @see org.summer.view.widget.shapes.ShapesPackage#getStroke_Dashoffset()
	 * @model
	 * @generated
	 */
	int getDashoffset();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.shapes.Stroke#getDashoffset <em>Dashoffset</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Dashoffset</em>' attribute.
	 * @see #getDashoffset()
	 * @generated
	 */
	void setDashoffset(int value);

	/**
	 * Returns the value of the '<em><b>Linecap</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Linecap</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Linecap</em>' attribute.
	 * @see #setLinecap(int)
	 * @see org.summer.view.widget.shapes.ShapesPackage#getStroke_Linecap()
	 * @model
	 * @generated
	 */
	int getLinecap();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.shapes.Stroke#getLinecap <em>Linecap</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Linecap</em>' attribute.
	 * @see #getLinecap()
	 * @generated
	 */
	void setLinecap(int value);

	/**
	 * Returns the value of the '<em><b>Linejoin</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Linejoin</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Linejoin</em>' attribute.
	 * @see #setLinejoin(int)
	 * @see org.summer.view.widget.shapes.ShapesPackage#getStroke_Linejoin()
	 * @model
	 * @generated
	 */
	int getLinejoin();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.shapes.Stroke#getLinejoin <em>Linejoin</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Linejoin</em>' attribute.
	 * @see #getLinejoin()
	 * @generated
	 */
	void setLinejoin(int value);

	/**
	 * Returns the value of the '<em><b>Linemiterlimit</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Linemiterlimit</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Linemiterlimit</em>' attribute.
	 * @see #setLinemiterlimit(int)
	 * @see org.summer.view.widget.shapes.ShapesPackage#getStroke_Linemiterlimit()
	 * @model
	 * @generated
	 */
	int getLinemiterlimit();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.shapes.Stroke#getLinemiterlimit <em>Linemiterlimit</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Linemiterlimit</em>' attribute.
	 * @see #getLinemiterlimit()
	 * @generated
	 */
	void setLinemiterlimit(int value);

} // Stroke
