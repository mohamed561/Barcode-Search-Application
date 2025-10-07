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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [copySuccess, setCopySuccess] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState({
    registered: false,
    version: null,
    updateFound: false,
    lastCheck: null
  });
  const [showPopup, setShowPopup] = useState(true);

  const resultContainerRef = useRef(null);
  const barcodeRef = useRef(null);

  // Initialize Auto Ads after component mounts
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    const initializeAutoAds = () => {
      try {
        if (window.adsbygoogle && window.adsbygoogle.push) {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({
            google_ad_client: "ca-pub-5558307543618104",
            enable_page_level_ads: true
          });
          console.log('✅ Auto Ads initialized successfully');
          return true;
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.log(`⏳ AdSense script loading... (attempt ${retryCount}/${maxRetries})`);
          setTimeout(initializeAutoAds, 2000);
          return false;
        } else {
          console.log('ℹ️ AdSense script not available - this is normal during approval process');
          console.log('📝 Next steps: Wait for Google AdSense approval (1-14 days)');
          return false;
        }
      } catch (error) {
        console.log('ℹ️ Ads not ready yet - app continues normally');
        return false;
      }
    };

    setTimeout(initializeAutoAds, 1000);
  }, []);

  // Notify AdSense about page content changes
  useEffect(() => {
    if (result || error) {
      try {
        if (window.adsbygoogle && window.adsbygoogle.loaded) {
          window.dispatchEvent(new Event('resize'));
        }
      } catch (error) {}
    }
  }, [result, error]);

  // Check for app updates
  const checkForUpdates = async () => {
    const checkTime = new Date().toISOString();
    console.log('🔍 Checking for updates at:', checkTime);
    
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        setServiceWorkerStatus(prev => ({
          ...prev,
          registered: true,
          lastCheck: checkTime
        }));
        
        console.log('📋 Service Worker Registration:', registration);
        console.log('🔄 Active SW:', registration.active);
        console.log('⏳ Waiting SW:', registration.waiting);
        console.log('🔄 Installing SW:', registration.installing);
        
        if (registration.waiting) {
          console.log('⚡ Update available - service worker waiting');
          setUpdateAvailable(true);
          setServiceWorkerStatus(prev => ({
            ...prev,
            updateFound: true,
            version: 'Update Waiting'
          }));
          return;
        }
        
        console.log('🔍 Forcing service worker update check...');
        await registration.update();
        
        if (registration.active) {
          try {
            const channel = new MessageChannel();
            registration.active.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
            channel.port1.onmessage = (event) => {
              const swVersion = event.data.version || 'Unknown';
              console.log('📝 Service Worker Version:', swVersion);
              setServiceWorkerStatus(prev => ({
                ...prev,
                version: swVersion
              }));
            };
          } catch (error) {
            console.log('📝 Could not get SW version:', error);
            setServiceWorkerStatus(prev => ({
              ...prev,
              version: 'Active (No version info)'
            }));
          }
        }
        
        registration.addEventListener('updatefound', () => {
          console.log('🆕 New service worker found!');
          const newWorker = registration.installing;
          setServiceWorkerStatus(prev => ({
            ...prev,
            updateFound: true
          }));
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              console.log('🔄 New SW state:', newWorker.state);
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('✅ New service worker installed and ready');
                setUpdateAvailable(true);
              }
            });
          }
        });
        
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          console.log('💾 Available caches:', cacheNames);
        }
      } else {
        console.log('❌ Service Workers not supported');
        setServiceWorkerStatus(prev => ({
          ...prev,
          registered: false,
          version: 'Not Supported'
        }));
      }
      
      const currentVersion = '3.1.1';
      const buildTime = new Date('2025-08-27').getTime();
      const currentTime = Date.now();
      const daysSinceBuild = Math.floor((currentTime - buildTime) / (1000 * 60 * 60 * 24));
      
      console.log('📱 App Version:', currentVersion);
      console.log('📅 Build Age:', daysSinceBuild, 'days');
      
    } catch (error) {
      console.log('❌ Update check failed:', error);
      setServiceWorkerStatus(prev => ({
        ...prev,
        lastCheck: checkTime,
        version: 'Check Failed'
      }));
    }
  };

  const logServiceWorkerStatus = async () => {
    console.log('🔍 === SERVICE WORKER DEBUG INFO ===');
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        console.log('📋 Registration scope:', registration.scope);
        console.log('🔄 Active SW:', registration.active?.scriptURL);
        console.log('⏳ Waiting SW:', registration.waiting?.scriptURL);
        console.log('🔄 Installing SW:', registration.installing?.scriptURL);
        console.log('📅 Last update check:', registration.updateViaCache);
        
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          console.log('💾 Cache names:', cacheNames);
          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            console.log(`📦 Cache "${cacheName}" has ${keys.length} entries`);
          }
        }
      } catch (error) {
        console.log('❌ SW Debug failed:', error);
      }
    } else {
      console.log('❌ Service Workers not supported in this browser');
    }
    console.log('🔍 === END DEBUG INFO ===');
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        } else {
          window.location.reload();
        }
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.log('Update failed:', error);
      window.location.reload();
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setTimeout(checkForUpdates, 2000);
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      setTimeout(checkForUpdates, 5000);
    }

    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        logServiceWorkerStatus();
        console.log('📊 Current App State:', {
          isOnline,
          updateAvailable,
          isUpdating,
          serviceWorkerStatus,
          searchTerm,
          resultsCount: allResults.length
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  const downloadBarcode = () => {
    const svg = document.getElementById('barcode');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      const resolutionScale = 2;
      const padding = 40 * resolutionScale;
      const lineHeight = 30 * resolutionScale;
      const eanHeight = 40 * resolutionScale;
      const maxWidth = img.width * resolutionScale;

      ctx.font = `bold ${24 * resolutionScale}px Arial`;
      const titleText = result["libellé eCommerce"];
      const words = titleText.split(' ');
      let lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      const textHeight = lines.length * lineHeight;
      const totalHeight = textHeight + (img.height * resolutionScale) + eanHeight + padding * 3;

      canvas.width = (img.width * resolutionScale) + padding * 2;
      canvas.height = totalHeight;

      ctx.scale(resolutionScale, resolutionScale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${24}px Arial`;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / (2 * resolutionScale), (padding / resolutionScale) + (index + 1) * (lineHeight / resolutionScale));
      });

      ctx.drawImage(img, padding / resolutionScale, (textHeight + padding * 2) / resolutionScale, img.width, img.height);

      ctx.font = `bold ${24}px Arial`;
      ctx.fillText(`EAN: ${result.EAN}`, canvas.width / (2 * resolutionScale), (totalHeight - eanHeight) / resolutionScale);

      const link = document.createElement('a');
      link.download = `barcode_${result.EAN}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyEAN = async () => {
    if (!result || !result.EAN) return;
    
    try {
      await navigator.clipboard.writeText(result.EAN);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy EAN:', err);
      const textArea = document.createElement('textarea');
      textArea.value = result.EAN;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const findAllMatchingItems = (searchTerm) => {
    const normalizedSearchTerm = normalizeString(searchTerm);
    const allMatches = [];

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
    setCopySuccess(false);
    document.getElementById('search-input').focus();
  };

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
      setCurrentResultIndex(currentResultIndex + 1);
    } else if (isRightSwipe && currentResultIndex > 0) {
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
      position: 'relative',
      width: '100%',
    },
    onlineIndicator: {
      position: 'absolute',
      top: '-0.5rem',
      right: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: isOnline ? '#10b981' : '#ef4444',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      padding: '0.25rem 0.75rem',
      borderRadius: '1rem',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
    },
    statusDot: {
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      backgroundColor: isOnline ? '#10b981' : '#ef4444',
      boxShadow: `0 0 0.5rem ${isOnline ? '#10b981' : '#ef4444'}`,
      animation: isOnline ? 'pulse 2s infinite' : 'none',
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
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
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
    buttonsContainer: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    downloadButton: {
      backgroundColor: '#10b981',
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
    },
    copyButton: {
      backgroundColor: copySuccess ? '#10b981' : '#3b82f6',
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
      minWidth: '120px',
      justifyContent: 'center',
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
      backgroundColor: 'rgba(156, 163, 175, 0.5)',
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
    updateButton: {
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      backgroundColor: '#f59e0b',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 1000,
      transition: 'all 0.2s',
      animation: 'slideInUp 0.3s ease-out',
    },
    updateButtonUpdating: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
    },
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      maxWidth: '90%',
      width: '28rem',
      textAlign: 'center',
      direction: 'rtl',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      fontFamily: '"Amiri", serif',
    },
    modalTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '1rem',
      fontFamily: '"Amiri", serif',
    },
    modalText: {
      fontSize: '1rem',
      color: '#374151',
      lineHeight: '1.5',
      marginBottom: '1rem',
      fontFamily: '"Amiri", serif',
    },
    modalCloseButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'background-color 0.2s',
      fontFamily: '"Amiri", serif',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes slideInUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          /* START POPUP FONT IMPORT - Delete this to remove popup font */
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
          /* END POPUP FONT IMPORT */
        `}
      </style>
      {/* POPUP FUNCTION */}
      {/*
  START POPUP FUNCTION - Delete from here to remove popup

  {showPopup && (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}> UPDATE NOTICE</h2>
        <p style={styles.modalText}>
          الآن في النسخة الجديدة ديال الأبليكاسيون تقدر دير كوبي للكود غير بكليك وحدة و تقدر تيليشارجي الكودبار في حالة بغيتي تسيفطو لشي واحد بلا ماتحتاج دير ليه سكرين شوت، هاد التحديث الجديد غادي يعون الناس لي كيخدمو بالتلفون ديالهم بحال الناس ديال الاكسبريس أكثر، ثاني زدنا خاصية التحديث التلقائي، دابا بلا ماتحتاج تأكتياليزي الباج، الأبليكاسيون غادي دير تحديث لراسها 2 ثواني من ورا ما تكونيكطا بالأنترنيت، هادشي غادي يعون فأنه تكون عاندك آخر نسخة ديال الداتا بايس ديال لي كود ديما، زائد ماشي جديدة و لكن غير إعلام دابا تقدر تخدم الأبليكاسيون بلا أنترنيت، غير هو مرة مرة كونيكطيها بالأنترنيت باش دير التحديث إلى كان، هادشي لي كاين، الله يسر.
          <br /><br />
          <span style={{ color: '#114c3c', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', fontSize: '1.3rem', letterSpacing: '1px' }}>
            💚 VAMOS R.C.A 💚
          </span>
          <br />
        </p>
        <button
          onClick={() => setShowPopup(false)}
          style={styles.modalCloseButton}
        >
          إغلاق
        </button>
      </div>
    </div>
  )}

  END POPUP FUNCTION - Delete up to here to remove popup
*/}
      <div style={styles.appContainer}>
        <div style={styles.header}>
          <div style={styles.onlineIndicator}>
            <div style={styles.statusDot}></div>
            <span>{isOnline ? 'Connected' : 'Offline'}</span>
          </div>
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
                    <svg id="barcode" ref={barcodeRef}></svg>
                    {barcodeError && <p style={styles.barcodeError}>Unable to generate barcode</p>}
                  </div>
                  <p style={styles.eanDisplay}>EAN: {result.EAN}</p>
                  {!barcodeError && (
                    <div style={styles.buttonsContainer}>
                      <button onClick={copyEAN} style={styles.copyButton}>
                        {copySuccess ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                            Copy EAN
                          </>
                        )}
                      </button>
                      <button onClick={downloadBarcode} style={styles.downloadButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download Barcode
                      </button>
                    </div>
                  )}
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
          <p style={styles.footerText}>
            Built with <span style={{ color: "#e25555" }}>❤️</span> by <strong>Wyatt</strong> · <strong>Team AINSBAA</strong>
          </p>
          <p style={styles.footerText}>
            DB Snapshot: <strong>2025-10-07</strong>
          </p>
          <p style={styles.footerText}>
            <strong>Version 3.1.1</strong>
          </p>
          {serviceWorkerStatus.lastCheck && (
            <p style={{ ...styles.footerText, fontSize: '0.75rem', color: '#6b7280' }}>
              Last update check: {new Date(serviceWorkerStatus.lastCheck).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
      {updateAvailable && (
        <button
          onClick={handleUpdate}
          style={{
            ...styles.updateButton,
            ...(isUpdating ? styles.updateButtonUpdating : {})
          }}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Available'}
        </button>
      )}
    </div>
  );
};

export default BarcodeSearch;