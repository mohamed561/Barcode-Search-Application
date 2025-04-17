import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { database } from '../data/database';
import { constantDatabase } from '../data/constantDatabase';
import easterEggGif from '../assets/easter-egg.gif';

const BarcodeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [error, setError] = useState('');
  const [barcodeError, setBarcodeError] = useState(false);
  const [isEasterEgg, setIsEasterEgg] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  // Commented popup state - uncomment when needed
  /* const [showFeedbackPopup, setShowFeedbackPopup] = useState(false); */

  const resultContainerRef = useRef(null);

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
    if (allResults.length > 0) {
      setResult(allResults[currentResultIndex]);
    }
  }, [currentResultIndex, allResults]);

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

  // Commented popup effect - uncomment when needed
  /* 
  useEffect(() => {
    const hasReviewed = localStorage.getItem('hasReviewed');
    const lastShown = localStorage.getItem('feedbackPopupLastShown');
    const now = new Date().getTime();
    const tenHours = 10 * 60 * 60 * 1000;

    if (!hasReviewed) {
      setShowFeedbackPopup(true);
    } else if (lastShown && now - parseInt(lastShown) < tenHours) {
      setShowFeedbackPopup(false);
    } else {
      setShowFeedbackPopup(true);
    }
  }, []);
  */

  // Commented popup handlers - uncomment when needed
  /*
  const handleReviewClick = () => {
    const startTime = new Date().getTime();
    localStorage.setItem('feedbackPopupLastShown', startTime.toString());
    const reviewWindow = window.open('https://forms.gle/oKGgzeRU4zfkraQN9', '_blank');

    const checkTimeSpent = setInterval(() => {
      if (reviewWindow.closed) {
        const endTime = new Date().getTime();
        const timeSpent = (endTime - startTime) / 1000;
        if (timeSpent >= 30) {
          localStorage.setItem('hasReviewed', 'true');
        }
        clearInterval(checkTimeSpent);
      }
    }, 1000);

    setShowFeedbackPopup(false);
  };

  const handleCloseClick = () => {
    localStorage.setItem('feedbackPopupLastShown', new Date().getTime().toString());
    setShowFeedbackPopup(false);
  };
  */

  const findAllMatchingItems = (searchTerm) => {
    const normalizedSearchTerm = normalizeString(searchTerm);
    const allMatches = [];

    // Search in constant database
    constantDatabase.forEach(item => {
      if (item["Articles Ecommerce"]) {
        item["Articles Ecommerce"].forEach(article => {
          const normalizedLibelle = normalizeString(article["libellé eCommerce"]);
          if (normalizedLibelle.includes(normalizedSearchTerm)) {
            allMatches.push({...article, isConstant: true});
          }
        });
      }
    });

    // Search in regular database
    database.forEach(item => {
      if (item["Articles Ecommerce"]) {
        item["Articles Ecommerce"].forEach(article => {
          const normalizedLibelle = normalizeString(article["libellé eCommerce"]);
          if (normalizedLibelle.includes(normalizedSearchTerm)) {
            allMatches.push({...article, isConstant: false});
          }
        });
      }
    });

    return allMatches;
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('Please enter a product name');
      setResult(null);
      setAllResults([]);
      setIsEasterEgg(false);
      return;
    }
    
    if (searchTerm.trim() === '4=4') {
      setResult({ easterEgg: true });
      setAllResults([{ easterEgg: true }]);
      setCurrentResultIndex(0);
      setError('');
      setBarcodeError(false);
      setIsEasterEgg(true);
      return;
    }
    
    setIsEasterEgg(false);
    const matchingItems = findAllMatchingItems(searchTerm);
    
    if (matchingItems.length > 0) {
      setAllResults(matchingItems);
      setCurrentResultIndex(0);
      setResult(matchingItems[0]);
      setError('');
      setBarcodeError(false);
    } else {
      setResult(null);
      setAllResults([]);
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
    setAllResults([]);
    setCurrentResultIndex(0);
    setIsEasterEgg(false);
    document.getElementById('search-input').focus();
  };

  // Swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentResultIndex < allResults.length - 1) {
      // Swipe left to see next result
      setCurrentResultIndex(currentResultIndex + 1);
    } else if (isRightSwipe && currentResultIndex > 0) {
      // Swipe right to see previous result
      setCurrentResultIndex(currentResultIndex - 1);
    }
  };

  const nextResult = () => {
    if (currentResultIndex < allResults.length - 1) {
      setCurrentResultIndex(currentResultIndex + 1);
    }
  };

  const prevResult = () => {
    if (currentResultIndex > 0) {
      setCurrentResultIndex(currentResultIndex - 1);
    }
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
      position: 'relative',
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
      position: 'relative',
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
      color: 'rgba(156, 163, 175, 0.8)',
      fontSize: '0.875rem',
    },
    footerText: {
      margin: '0.25rem 0',
    },
    multipleResultsWarning: {
      color: '#ef4444',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginTop: '0.5rem',
      textAlign: 'center',
      animation: 'pulse 2s infinite',
    },
    resultsNavigation: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: '1rem',
    },
    navButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'background-color 0.2s',
      opacity: '0.9',
    },
    navDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'default',
      opacity: '0.5',
    },
    navButtonsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: '0.5rem',
    },
    resultCounter: {
      fontSize: '0.875rem',
      color: '#4b5563',
      marginTop: '0.5rem',
    },
    swipeHintContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '0.5rem',
    },
    swipeHint: {
      color: '#ef4444',
      fontSize: '0.75rem',
      textAlign: 'center',
      marginTop: '0.5rem',
    },
    // Commented popup styles - uncomment when needed
    /*
    popupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-in-out',
    },
    popupContent: {
      background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
      padding: '1.25rem',
      borderRadius: '0.75rem',
      textAlign: 'center',
      maxWidth: '20rem',
      width: '85%',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
      position: 'relative',
      overflow: 'hidden',
    },
    popupTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1e40af',
      marginBottom: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
    },
    popupText: {
      fontSize: '0.9rem',
      color: '#4b5563',
      marginBottom: '1rem',
      lineHeight: '1.4',
    },
    popupButton: {
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.6rem 1.5rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s, background-color 0.2s',
      boxShadow: '0 3px 10px rgba(30, 64, 175, 0.25)',
    },
    popupButtonHover: {
      backgroundColor: '#1e3a8a',
      transform: 'scale(1.03)',
    },
    popupCloseButton: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      background: 'none',
      border: 'none',
      color: '#6b7280',
      fontSize: '1rem',
      cursor: 'pointer',
      padding: '0.2rem',
      transition: 'color 0.2s',
    },
    */
  };

  return (
    <div style={styles.container}>
      {/* Commented popup JSX - uncomment when needed
      {showFeedbackPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <button
              style={styles.popupCloseButton}
              onClick={handleCloseClick}
              onMouseEnter={(e) => (e.target.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.target.style.color = '#6b7280')}
            >
              ✕
            </button>
            <h3 style={styles.popupTitle}>!V2.0 مرحبا بك في</h3>
            <p style={styles.popupText}>
              !إذا كان ممكنك تعطينا ملاحظاتك على التطبيق، غادي نكونو ممتنين بزاف
            </p>
            <button
              style={styles.popupButton}
              onClick={handleReviewClick}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.popupButtonHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.popupButton)}
            >
              اضغط هنا
            </button>
          </div>
        </div>
      )}
      */}
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
                <div 
                  ref={resultContainerRef}
                  style={styles.productResult}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <p style={styles.productName}>{result["libellé eCommerce"]}</p>
                  <div style={styles.barcodeContainer}>
                    <svg id="barcode"></svg>
                    {barcodeError && <p style={styles.barcodeError}>Unable to generate barcode</p>}
                  </div>
                  {!barcodeError && <p style={styles.eanDisplay}>EAN: {result.EAN}</p>}
                  
                  {allResults.length > 1 && (
                    <>
                      <div style={styles.swipeHintContainer}>
                        <p style={styles.swipeHint}>
                          This item has {allResults.length} different EAN codes. 
                          Swipe left/right to explore.
                        </p>
                      </div>
                      <p style={styles.resultCounter}>
                        {currentResultIndex + 1} of {allResults.length}
                      </p>
                      <div style={styles.navButtonsContainer}>
                        <button
                          onClick={prevResult}
                          style={{
                            ...styles.navButton,
                            ...(currentResultIndex === 0 ? styles.navDisabled : {})
                          }}
                          disabled={currentResultIndex === 0}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Previous
                        </button>
                        <button
                          onClick={nextResult}
                          style={{
                            ...styles.navButton,
                            ...(currentResultIndex === allResults.length - 1 ? styles.navDisabled : {})
                          }}
                          disabled={currentResultIndex === allResults.length - 1}
                        >
                          Next
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
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