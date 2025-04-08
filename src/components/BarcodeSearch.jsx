import React, { useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { database } from '../data/database';
import { constantDatabase } from '../data/constantDatabase';
import easterEggGif from '../assets/easter-egg.gif';

const BarcodeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [barcodeError, setBarcodeError] = useState(false);
  const [isEasterEgg, setIsEasterEgg] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  const formatEAN = (ean) => {
    if (!ean) return null;
    const cleanEan = ean.toString().replace(/\D/g, '');
    if (cleanEan.length === 8) return cleanEan;
    if (cleanEan.length === 13) return cleanEan.replace(/^0+/, '');
    return cleanEan;
  };

  const normalizeString = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  useEffect(() => {
    if (result && result.EAN) {
      try {
        document.getElementById('barcode').innerHTML = '';
        setBarcodeError(false);
        const formattedEAN = formatEAN(result.EAN);
        if (!formattedEAN) throw new Error('Invalid EAN code');
        const barcodeFormat = formattedEAN.length === 8 ? "EAN8" : "EAN13";
        JsBarcode("#barcode", formattedEAN, {
          format: barcodeFormat,
          width: 2,
          height: 100,
          displayValue: true,
          fontSize: 16,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000",
          text: formattedEAN,
          valid: (valid) => {
            if (!valid) throw new Error('Invalid barcode format');
          }
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
        document.getElementById('barcode').innerHTML = '';
        setBarcodeError(true);
      }
    }
  }, [result]);

  useEffect(() => {
    const hasReviewed = localStorage.getItem('hasReviewed'); // Check if user has completed review
    const lastShown = localStorage.getItem('feedbackPopupLastShown');
    const now = new Date().getTime();
    const tenHours = 10 * 60 * 60 * 1000; // 10 hours in milliseconds

    if (!hasReviewed) {
      // If they haven’t reviewed, show popup every time unless suppressed by "Review"
      setShowFeedbackPopup(true);
    } else if (lastShown && now - parseInt(lastShown) < tenHours) {
      // If reviewed but less than 10 hours have passed, don’t show
      setShowFeedbackPopup(false);
    } else {
      // If reviewed and 10+ hours have passed, show again
      setShowFeedbackPopup(true);
    }
  }, []);

  // Handle "Review" button click with time tracking
  const handleReviewClick = () => {
    const startTime = new Date().getTime();
    localStorage.setItem('feedbackPopupLastShown', startTime.toString());
    const reviewWindow = window.open('https://forms.gle/oKGgzeRU4zfkraQN9', '_blank');

    const checkTimeSpent = setInterval(() => {
      if (reviewWindow.closed) {
        const endTime = new Date().getTime();
        const timeSpent = (endTime - startTime) / 1000; // Time in seconds
        if (timeSpent >= 30) {
          localStorage.setItem('hasReviewed', 'true'); // Mark as reviewed if 30+ seconds
        }
        clearInterval(checkTimeSpent);
      }
    }, 1000); // Check every second

    setShowFeedbackPopup(false); // Hide popup immediately
  };

  // Handle "Close" button click
  const handleCloseClick = () => {
    // Don’t set hasReviewed, so it keeps showing every time
    localStorage.setItem('feedbackPopupLastShown', new Date().getTime().toString());
    setShowFeedbackPopup(false);
  };

  const searchInDatabase = (searchTerm, db) => {
    const normalizedSearchTerm = normalizeString(searchTerm);
    for (const item of db) {
      if (item["Articles Ecommerce"]) {
        const foundItem = item["Articles Ecommerce"].find(article => {
          const normalizedLibelle = normalizeString(article["libellé eCommerce"]);
          return normalizedLibelle.includes(normalizedSearchTerm);
        });
        if (foundItem) return foundItem;
      }
    }
    return null;
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('Please enter a product name');
      setResult(null);
      setIsEasterEgg(false);
      return;
    }
    if (searchTerm.trim() === '4=4') {
      setResult({ easterEgg: true });
      setError('');
      setBarcodeError(false);
      setIsEasterEgg(true);
      return;
    }
    setIsEasterEgg(false);
    let foundItem = searchInDatabase(searchTerm, constantDatabase);
    let isFromConstant = true;
    if (!foundItem) {
      foundItem = searchInDatabase(searchTerm, database);
      isFromConstant = false;
    }
    if (foundItem) {
      setResult({ ...foundItem, isConstant: isFromConstant });
      setError('');
      setBarcodeError(false);
    } else {
      setResult(null);
      setError('Product not found');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setError('');
    setResult(null);
    setIsEasterEgg(false);
    document.getElementById('search-input').focus();
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      background: 'linear-gradient(135deg, #111827, #030712)',
      color: '#f9fafb',
    },
    appContainer: {
      width: '100%',
      maxWidth: '28rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
    },
    header: {
      textAlign: 'center',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#f9fafb',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '0.875rem',
      color: '#9ca3af',
    },
    searchContainer: {
      width: '100%',
    },
    inputWrapper: {
      position: 'relative',
      width: '100%',
      marginBottom: '1rem',
    },
    input: {
      width: '100%',
      backgroundColor: 'rgba(31, 41, 55, 0.8)',
      color: '#f9fafb',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.75rem 2.5rem 0.75rem 1rem',
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box',
    },
    clearButton: {
      position: 'absolute',
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#9ca3af',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.25rem',
    },
    searchButton: {
      width: '100%',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.2s',
    },
    resultsContainer: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    resultsHeader: {
      backgroundColor: '#f3f4f6',
      padding: '0.75rem 1rem',
      borderBottom: '1px solid #e5e7eb',
      textAlign: 'center',
    },
    resultsTitle: {
      fontSize: '1rem',
      fontWeight: '500',
      color: '#374151',
      margin: '0',
    },
    resultsContent: {
      padding: '1.5rem',
      minHeight: '16rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '1rem',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#9ca3af',
    },
    emptyStateIcon: {
      width: '4rem',
      height: '4rem',
      marginBottom: '1rem',
    },
    emptyStateText: {
      margin: '0',
      marginBottom: '0.5rem',
    },
    emptyStateSubtext: {
      fontSize: '0.875rem',
      margin: '0',
    },
    productResult: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      width: '100%',
    },
    productName: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: '#1f2937',
      textAlign: 'center',
      wordBreak: 'break-word',
    },
    barcodeContainer: {
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '0.375rem',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    barcodeError: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginTop: '0.5rem',
    },
    eanDisplay: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#1f2937',
    },
    easterEgg: {
      width: '12rem',
      height: 'auto',
    },
    footer: {
      textAlign: 'center',
      paddingTop: '2rem',
      color: '#9ca3af',
      fontSize: '0.875rem',
    },
    footerText: {
      margin: '0.25rem 0',
    },
    popupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    popupContent: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '0.5rem',
      textAlign: 'center',
      maxWidth: '24rem',
      width: '90%',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    popupTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1rem',
    },
    popupText: {
      fontSize: '1rem',
      color: '#374151',
      marginBottom: '1.5rem',
    },
    popupButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    popupCloseButton: {
      background: 'none',
      border: 'none',
      color: '#9ca3af',
      fontSize: '0.875rem',
      cursor: 'pointer',
      marginTop: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      {showFeedbackPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <h3 style={styles.popupTitle}>!V2.0 مرحبا بك ف</h3>
            <p style={styles.popupText}>
              !الا كان ممكنك تعطي ملاحظات على التطبيق، غادي نكونو ممتنين بزاف
            </p>
            <button
              style={styles.popupButton}
              onClick={handleReviewClick}
            >
              اظغط هنا
            </button>
            <button
              style={styles.popupCloseButton}
              onClick={handleCloseClick}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
      <div style={styles.appContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>EAN Barcode Finder</h1>
          <p style={styles.subtitle}>Search for products and generate EAN barcodes instantly</p>
        </div>
        <div style={styles.searchContainer}>
          <div style={styles.inputWrapper}>
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter product name..."
              style={styles.input}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={styles.clearButton}
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <button onClick={handleSearch} style={styles.searchButton}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            SEARCH
          </button>
        </div>
        <div style={styles.resultsContainer}>
          <div style={styles.resultsHeader}>
            <h2 style={styles.resultsTitle}>Search Results</h2>
          </div>
          <div style={styles.resultsContent}>
            {error ? (
              <p style={styles.errorMessage}>{error}</p>
            ) : result ? (
              result.easterEgg ? (
                <img src={easterEggGif} alt="Easter egg animation" style={styles.easterEgg} />
              ) : (
                <div style={styles.productResult}>
                  <p style={styles.productName}>{result["libellé eCommerce"]}</p>
                  <div style={styles.barcodeContainer}>
                    <svg id="barcode"></svg>
                    {barcodeError && <p style={styles.barcodeError}>Unable to generate barcode</p>}
                  </div>
                  {!barcodeError && <p style={styles.eanDisplay}>EAN: {result.EAN}</p>}
                </div>
              )
            ) : (
              <div style={styles.emptyState}>
                <svg style={styles.emptyStateIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p style={styles.emptyStateText}>Enter a product name to search</p>
                <p style={styles.emptyStateSubtext}>Results will appear here</p>
              </div>
            )}
          </div>
        </div>
        <div style={styles.footer}>
          <p style={styles.footerText}>Made by: Wyatt</p>
          <p style={styles.footerText}>Powered by: Team AINSBAA</p>
          <p style={styles.footerText}>V2.0</p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeSearch;