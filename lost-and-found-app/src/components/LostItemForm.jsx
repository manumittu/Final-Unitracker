import { useState } from 'react';
import { lostItemsAPI } from '../services/api';
import { ITEM_TYPES, ROLES, STATUS_LOST } from '../utils/constants';
import styles from './LostItemForm.module.css';

const LostItemForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', studentStaffId: '', email: '', phone: '', role: '',
    itemType: '', itemName: '', description: '', color: '', brand: '', size: '', image: null,
    dateLost: '', locationLost: '', status: 'Pending', additionalNotes: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'file' ? files[0] : value }));
  };

  const handleNext = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const handlePrevious = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => { if (formData[key]) formDataToSend.append(key, formData[key]); });
      await lostItemsAPI.create(formDataToSend);
      alert('Lost item reported successfully!');
      setFormData({
        name: '', studentStaffId: '', email: '', phone: '', role: '',
        itemType: '', itemName: '', description: '', color: '', brand: '', size: '', image: null,
        dateLost: '', locationLost: '', status: 'Pending', additionalNotes: ''
      });
      setCurrentStep(1);
    } catch (error) {
      console.error(error);
      alert('Error submitting form. Please try again.');
    }
  };

  const renderStep1 = () => (
    <div>
      <h2>Step 1: Reporter Details</h2>
      {[
        { label:'Name *', name:'name', type:'text', placeholder:'Enter your full name' },
        { label:'Student/Staff ID *', name:'studentStaffId', type:'text', placeholder:'Enter your ID number' },
        { label:'Email *', name:'email', type:'email', placeholder:'Enter your email' },
        { label:'Phone', name:'phone', type:'tel', placeholder:'Optional' }
      ].map(field => (
        <div key={field.name} className={styles.inputGroup}>
          <label>{field.label}</label>
          <input
            type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder}
            className={styles.inputField}
          />
        </div>
      ))}
      <div className={styles.inputGroup}>
        <label>Role *</label>
        <select name="role" value={formData.role} onChange={handleInputChange} className={styles.selectField}>
          <option value="">Select Role</option>
          {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2>Step 2: Item Details</h2>
      {[
        { label:'Item Type *', name:'itemType', type:'select', options: ITEM_TYPES },
        { label:'Item Name *', name:'itemName', type:'text', placeholder:'e.g., iPhone 13, Wallet' },
        { label:'Description *', name:'description', type:'textarea', placeholder:'Describe the item' },
        { label:'Color', name:'color', type:'text', placeholder:'Optional' },
        { label:'Brand', name:'brand', type:'text', placeholder:'Optional' },
        { label:'Size', name:'size', type:'text', placeholder:'Optional' },
        { label:'Upload Image', name:'image', type:'file' }
      ].map(field => (
        <div key={field.name} className={styles.inputGroup}>
          <label>{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea name={field.name} value={formData[field.name]} onChange={handleInputChange} rows="3" className={styles.textAreaField} placeholder={field.placeholder} />
          ) : field.type === 'select' ? (
            <select name={field.name} value={formData[field.name]} onChange={handleInputChange} className={styles.selectField}>
              <option value="">Select</option>
              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input type={field.type} name={field.name} value={field.type==='file'?'':formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder} className={styles.inputField} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2>Step 3: Location & Status</h2>
      {[
        { label:'Date Lost *', name:'dateLost', type:'date' },
        { label:'Location Lost *', name:'locationLost', type:'text', placeholder:'e.g., Library, Room 101' },
        { label:'Status', name:'status', type:'select', options: STATUS_LOST },
        { label:'Additional Notes', name:'additionalNotes', type:'textarea', placeholder:'Optional' }
      ].map(field => (
        <div key={field.name} className={styles.inputGroup}>
          <label>{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea name={field.name} value={formData[field.name]} onChange={handleInputChange} rows="3" className={styles.textAreaField} placeholder={field.placeholder} />
          ) : field.type === 'select' ? (
            <select name={field.name} value={formData[field.name]} onChange={handleInputChange} className={styles.selectField}>
              <option value="">Select</option>
              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} className={styles.inputField} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <h1>Report Lost Item</h1>
      <div className={styles.stepContainer}>
        {[1, 2, 3].map(step => (
          <div key={step} className={styles.stepBar} style={{ backgroundColor: step <= currentStep ? '#007bff' : '#e9ecef' }} />
        ))}
      </div>
      <p className={styles.stepText}>Step {currentStep} of 3</p>

      <form onSubmit={handleSubmit}>
        {currentStep===1 && renderStep1()}
        {currentStep===2 && renderStep2()}
        {currentStep===3 && renderStep3()}

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'2rem' }}>
          <button type="button" onClick={handlePrevious} className={`${styles.button} ${currentStep===1 ? styles.buttonDisabled : styles.buttonSuccess}`}>Previous</button>
          {currentStep<3 ? (
            <button type="button" onClick={handleNext} className={`${styles.button} ${styles.buttonPrimary}`}>Next</button>
          ) : (
            <button type="submit" className={`${styles.button} ${styles.buttonDanger}`}>Submit Report</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LostItemForm;