/**
 */
package org.summer.view.widget.style;

import org.eclipse.emf.ecore.EObject;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Background</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * <ul>
 *   <li>{@link org.summer.view.widget.style.Background#getAttachment <em>Attachment</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Background#getImage <em>Image</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Background#getRepeat <em>Repeat</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Background#getColor <em>Color</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Background#getPosition <em>Position</em>}</li>
 * </ul>
 * </p>
 *
 * @see org.summer.view.widget.style.StylePackage#getBackground()
 * @model
 * @generated
 */
public interface Background extends EObject {
	/**
	 * Returns the value of the '<em><b>Attachment</b></em>' attribute.
	 * The literals are from the enumeration {@link org.summer.view.widget.style.BackgroundAttachment}.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Attachment</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Attachment</em>' attribute.
	 * @see org.summer.view.widget.style.BackgroundAttachment
	 * @see #setAttachment(BackgroundAttachment)
	 * @see org.summer.view.widget.style.StylePackage#getBackground_Attachment()
	 * @model
	 * @generated
	 */
	BackgroundAttachment getAttachment();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Background#getAttachment <em>Attachment</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Attachment</em>' attribute.
	 * @see org.summer.view.widget.style.BackgroundAttachment
	 * @see #getAttachment()
	 * @generated
	 */
	void setAttachment(BackgroundAttachment value);

	/**
	 * Returns the value of the '<em><b>Image</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Image</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Image</em>' attribute.
	 * @see #setImage(String)
	 * @see org.summer.view.widget.style.StylePackage#getBackground_Image()
	 * @model
	 * @generated
	 */
	String getImage();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Background#getImage <em>Image</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Image</em>' attribute.
	 * @see #getImage()
	 * @generated
	 */
	void setImage(String value);

	/**
	 * Returns the value of the '<em><b>Repeat</b></em>' attribute.
	 * The literals are from the enumeration {@link org.summer.view.widget.style.BackgroundRepeat}.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Repeat</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Repeat</em>' attribute.
	 * @see org.summer.view.widget.style.BackgroundRepeat
	 * @see #setRepeat(BackgroundRepeat)
	 * @see org.summer.view.widget.style.StylePackage#getBackground_Repeat()
	 * @model
	 * @generated
	 */
	BackgroundRepeat getRepeat();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Background#getRepeat <em>Repeat</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Repeat</em>' attribute.
	 * @see org.summer.view.widget.style.BackgroundRepeat
	 * @see #getRepeat()
	 * @generated
	 */
	void setRepeat(BackgroundRepeat value);

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
	 * @see org.summer.view.widget.style.StylePackage#getBackground_Color()
	 * @model containment="true"
	 * @generated
	 */
	RGB getColor();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Background#getColor <em>Color</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Color</em>' containment reference.
	 * @see #getColor()
	 * @generated
	 */
	void setColor(RGB value);

	/**
	 * Returns the value of the '<em><b>Position</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Position</em>' reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Position</em>' reference.
	 * @see #setPosition(BackgroundPosition)
	 * @see org.summer.view.widget.style.StylePackage#getBackground_Position()
	 * @model
	 * @generated
	 */
	BackgroundPosition getPosition();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Background#getPosition <em>Position</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Position</em>' reference.
	 * @see #getPosition()
	 * @generated
	 */
	void setPosition(BackgroundPosition value);

} // Background
