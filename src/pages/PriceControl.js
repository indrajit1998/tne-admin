import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import styles from './Styles/PriceControl.module.css';
import api from '../Services/Api'; 

const PriceControl = () => {
  const [pricing, setPricing] = useState({
    TE: 0,
    deliveryFee: 0,
    margin: 0,
    weightRateTrain: 0,
    distanceRateTrain: 0,
    baseFareTrain: 0,
    // --- CORRECTED FIELD NAMES ---
    weightRateFlight: 0,
    distanceRateFlight: 0,
    baseFareFlight: 0,
  });
  const [modalInputs, setModalInputs] = useState({ ...pricing });
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await api.get('/api/v1/admin/getPriceConfig', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        const config = response.data.fareConfig || {};
        console.log('Fetched pricing config:', response);
        
        const newPricing = {
          TE: config.TE || 0,
          deliveryFee: config.deliveryFee || 0,
          margin: config.margin || 0,
          weightRateTrain: config.weightRateTrain || 0,
          distanceRateTrain: config.distanceRateTrain || 0,
          baseFareTrain: config.baseFareTrain || 0,
          // --- CORRECTED FIELD NAMES ---
          weightRateFlight: config.weightRateFlight || 0,
          distanceRateFlight: config.distanceRateFlight || 0,
          baseFareFlight: config.baseFareFlight || 0,
        };
        
        setPricing(newPricing);
        setModalInputs(newPricing);

      } catch (error) {
        console.error('Failed to fetch pricing:', error);
      }
    };
 
    fetchPricing();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value >= 0) {
      setModalInputs(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const payload = {
      TE: parseFloat(modalInputs.TE),
      deliveryFee: parseFloat(modalInputs.deliveryFee),
      margin: parseFloat(modalInputs.margin),
      weightRateTrain: parseFloat(modalInputs.weightRateTrain),
      distanceRateTrain: parseFloat(modalInputs.distanceRateTrain),
      baseFareTrain: parseFloat(modalInputs.baseFareTrain),
      // --- CORRECTED FIELD NAMES ---
      weightRateFlight: parseFloat(modalInputs.weightRateFlight),
      distanceRateFlight: parseFloat(modalInputs.distanceRateFlight),
      baseFareFlight: parseFloat(modalInputs.baseFareFlight),
    };
 
    try {
      const res = await api.patch('/api/v1/admin/managePrices', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
 
      if (res.data) { 
        setPricing(modalInputs);
        setStatus('Pricing updated successfully!');
        setTimeout(() => {
            setIsModalOpen(false);
            setStatus('');
        }, 1500); 
      } else {
        setStatus('Update failed. Please try again.');
      }
 
    } catch (error) {
      console.error('Error updating pricing:', error);
      setStatus('Error updating pricing.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalInputs(pricing); 
    setStatus('');
  };

  // Helper function to format field names for display
  const formatFieldName = (key) => {
    let name = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    // --- CORRECTED FIELD NAMES ---
    if (key === 'weightRateFlight') return 'Weight Rate (Airplane)';
    if (key === 'distanceRateFlight') return 'Distance Rate (Airplane)';
    if (key === 'baseFareFlight') return 'Base Fare (Airplane)';
    if (key === 'weightRateTrain') return 'Weight Rate (Train)';
    if (key === 'distanceRateTrain') return 'Distance Rate (Train)';
    if (key === 'baseFareTrain') return 'Base Fare (Train)';
    return name;
  };

  return (
    <div className={styles.adminWrapper}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.headerBody}>
          <h1 className={styles.header}>Fare Configuration</h1>
        </header>

        <section className={styles.pricingSection}>
          <div className={styles.pricingGrid}>
            {Object.entries(pricing).map(([key, value]) => (
              <div key={key} className={styles.pricingItem}>
                <span className={styles.pricingLabel}>{formatFieldName(key)}</span>
                <span className={styles.pricingValue}>
                  {key === 'margin' ? `${(parseFloat(value)).toFixed(1)}%` : parseFloat(value).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <button className={styles.editButton} onClick={() => setIsModalOpen(true)}>Edit Pricing</button>
        </section>

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <header className={styles.modalHeader}>
                <h2>Edit Pricing</h2>
                <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
              </header>
              <form onSubmit={handleSubmit} className={styles.formGrid}>
                {Object.entries(modalInputs).map(([key, value]) => (
                  <div key={key} className={styles.formGroup}>
                    <label htmlFor={key}>{formatFieldName(key)}</label>
                    <input
                      type="number"
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                ))}
                <div className={styles.formActions}>
                    <button type="submit" className={styles.updateButton}>Update Pricing</button>
                    {status && <p className={styles.statusMsg}>{status}</p>}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PriceControl;