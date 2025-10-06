import { useState, useEffect } from 'react';
import { foundItemsAPI, lostItemsAPI } from '../services/api';
import { ITEM_TYPES, ROLES, STATUS_FOUND } from '../utils/constants';
import styles from './FoundItemForm.module.css';

const FoundItemForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [lostItems, setLostItems] = useState([]);
  const [matchedItem, setMatchedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', studentStaffId: '', email: '', phone: '', role: '',
    itemType: '', itemName: '', description: '', color: '', brand: '', size: '', image: null,
    dateFound: '', locationFound: '', status: 'Pending', matchedLostItemId: null
  });

  useEffect(() => {
    fetchLostItems();
  }, []);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const response = await lostItemsAPI.getAll();
      const pendingItems = response.data.filter(item => item.status === 'Pending');
      setLostItems(pendingItems);
    } catch (err) {
      console.error(err);
      setError('Failed to load lost items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'file' ? files[0] : value }));
    if (error) setError('');
  };

  const validateStep = (step) => {
    if (step === 1) {
      const { name, studentStaffId, email, role } = formData;
      if (!name.trim() || !studentStaffId.trim() || !email.trim() || !role) {
        setError('Please fill in all required fields'); return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { setError('Please enter a valid email'); return false; }
    }
    if (step === 2) {
      const { itemType, itemName, description, dateFound, locationFound } = formData;
      if (!itemType || !itemName.trim() || !description.trim() || !dateFound || !locationFound.trim()) {
        setError('Please fill in all required fields'); return false;
      }
      const foundDate = new Date(dateFound);
      const today = new Date(); today.setHours(23,59,59,999);
      if (foundDate > today) { setError('Found date cannot be in the future'); return false; }
    }
    return true;
  };

  const handleNext = () => { if (validateStep(currentStep) && currentStep < 2) { setCurrentStep(currentStep+1); setError(''); } };
  const handlePrevious = () => { if (currentStep > 1) { setCurrentStep(currentStep-1); setError(''); } };

  const handleMatchItem = (lostItem) => {
    if (matchedItem?._id === lostItem._id) {
      setMatchedItem(null);
      setFormData(prev => ({ ...prev, matchedLostItemId: null, status: 'Pending' }));
    } else {
      setMatchedItem(lostItem);
      setFormData(prev => ({ ...prev, matchedLostItemId: lostItem._id, status: 'Claimed' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setLoading(true); setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => { if (formData[key] !== null && formData[key] !== '') formDataToSend.append(key, formData[key]); });
      await foundItemsAPI.create(formDataToSend);
      if (matchedItem?._id) { await lostItemsAPI.update(matchedItem._id, { status: 'Returned' }).catch(console.error); }
      alert('Found item reported successfully!');
      setFormData({ name:'', studentStaffId:'', email:'', phone:'', role:'', itemType:'', itemName:'', description:'', color:'', brand:'', size:'', image:null, dateFound:'', locationFound:'', status:'Pending', matchedLostItemId:null });
      setMatchedItem(null); setCurrentStep(1); await fetchLostItems();
    } catch (err) { console.error(err); setError('Error submitting form. Please try again.'); }
    finally { setLoading(false); }
  };

  const renderStep1 = () => (
    <div>
      <h2>Step 1: Finder Details</h2>
      {[
        { label:'Name *', name:'name', type:'text', placeholder:'Enter your full name', required:true },
        { label:'Student/Staff ID *', name:'studentStaffId', type:'text', placeholder:'Enter your ID number', required:true },
        { label:'Email *', name:'email', type:'email', placeholder:'Enter your email address', required:true },
        { label:'Phone', name:'phone', type:'tel', placeholder:'Enter your phone number (optional)', required:false }
      ].map(field => (
        <div key={field.name} className={styles.inputGroup}>
          <label>{field.label}</label>
          <input
            type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder}
            className={`${styles.inputField} ${error && field.required && !formData[field.name].trim() ? styles.inputError : ''}`}
          />
        </div>
      ))}
      <div className={styles.inputGroup}>
        <label>Role *</label>
        <select name="role" value={formData.role} onChange={handleInputChange} className={`${styles.selectField} ${error && !formData.role ? styles.inputError : ''}`}>
          <option value="">Select Role</option>
          {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2>Step 2: Item Details</h2>
      {/* Matching Lost Items */}
      <div className={styles.matchBox}>
        <h3 style={{marginTop:0}}>Does this match any reported lost items?</h3>
        {loading && <p>Loading lost items...</p>}
        {!loading && lostItems.length===0 && <p style={{ color:'#6c757d', fontStyle:'italic'}}>No pending lost items found. You can still report the found item below.</p>}
        {!loading && lostItems.length>0 && (
          <div style={{ maxHeight:'300px', overflowY:'auto' }}>
            {lostItems.map(item => (
              <div key={item._id}
                   onClick={() => handleMatchItem(item)}
                   className={`${styles.matchItem} ${matchedItem?._id===item._id ? styles.matchSelected : styles.matchDefault}`}
                   onMouseEnter={e => { if(matchedItem?._id!==item._id) e.target.style.backgroundColor='#e9ecef'; }}
                   onMouseLeave={e => { if(matchedItem?._id!==item._id) e.target.style.backgroundColor='white'; }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ flex:1 }}>
                    <strong>{item.itemName}</strong> - <span style={{color:'#007bff'}}>{item.itemType}</span><br/>
                    <small style={{color:'#666'}}>{item.color && `Color: ${item.color}`}{item.color && item.brand && ' | '}{item.brand && `Brand: ${item.brand}`}</small><br/>
                    <small style={{color:'#666'}}>Lost at: <strong>{item.locationLost}</strong> on {new Date(item.dateLost).toLocaleDateString()}</small><br/>
                    <small style={{color:'#333', marginTop:'0.25rem', display:'block'}}>{item.description}</small>
                  </div>
                  {matchedItem?._id===item._id && <span style={{color:'#28a745', fontWeight:'bold', fontSize:'1.2rem'}}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        )}
        {matchedItem && <div className={styles.matchedConfirmation}>✓ Matched with: {matchedItem.itemName} <br/> <small>This lost item will be marked as "Returned" when you submit.</small></div>}
      </div>

      {/* Remaining fields */}
      {[
        { label:'Item Type *', name:'itemType', type:'select', options:ITEM_TYPES, required:true },
        { label:'Item Name *', name:'itemName', type:'text', placeholder:'e.g., iPhone 13, Leather Wallet, Textbook', required:true },
        { label:'Description *', name:'description', type:'textarea', placeholder:'Describe the item in detail...', required:true },
        { label:'Color', name:'color', type:'text', placeholder:'e.g., Black, Blue', required:false },
        { label:'Brand', name:'brand', type:'text', placeholder:'e.g., Apple, Nike', required:false },
        { label:'Size', name:'size', type:'text', placeholder:'e.g., Small, Medium, Large', required:false },
        { label:'Upload Image (optional)', name:'image', type:'file', required:false },
        { label:'Date Found *', name:'dateFound', type:'date', required:true, max:new Date().toISOString().split('T')[0] },
        { label:'Location Found *', name:'locationFound', type:'text', placeholder:'e.g., Library, Cafeteria, Room 101', required:true },
        { label:'Status', name:'status', type:'select', options:STATUS_FOUND, required:false }
      ].map(field => (
        <div key={field.name} className={styles.inputGroup}>
          <label>{field.label}</label>
          {field.type==='textarea' ? 
            <textarea name={field.name} value={formData[field.name]} onChange={handleInputChange} rows="3"
                      className={`${styles.textAreaField} ${error && field.required && !formData[field.name].trim() ? styles.inputError : ''}`}
                      placeholder={field.placeholder}/> :
          field.type==='select' ?
            <select name={field.name} value={formData[field.name]} onChange={handleInputChange} className={styles.selectField}>
              <option value="">Select</option>
              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select> :
          <input type={field.type} name={field.name} value={field.type==='file'?'':formData[field.name]} onChange={handleInputChange}
                 placeholder={field.placeholder} max={field.max} className={styles.inputField}/>}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <h1>Report Found Item</h1>
      <div className={{marginBottom:'2rem'}}>
        <div className={styles.stepContainer}>
          {[1,2].map(step => <div key={step} className={styles.stepBar} style={{backgroundColor: step<=currentStep?'#28a745':'#e9ecef'}} />)}
        </div>
        <p className={styles.stepText}>Step {currentStep} of 2</p>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {currentStep===1 && renderStep1()}
        {currentStep===2 && renderStep2()}

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'2rem' }}>
          <button type="button" onClick={handlePrevious} className={`${styles.button} ${currentStep===1?styles.buttonDisabled:styles.buttonPrimary}`}>Previous</button>
          {currentStep<2 ? 
            <button type="button" onClick={handleNext} disabled={loading} className={`${styles.button} ${styles.buttonSuccess}`}>{loading?'Loading...':'Next'}</button> :
            <button type="submit" disabled={loading} className={`${styles.button} ${styles.buttonSuccess}`}>{loading?'Submitting...':'Submit Report'}</button>
          }
        </div>
      </form>
    </div>
  );
};

export default FoundItemForm;