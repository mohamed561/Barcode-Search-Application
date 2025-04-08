<meta name="google-site-verification" content="4vVWKVtziRoM4FUWxmGgAfPuLWT71TMUWPBD-ZaKNJc" />
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

    // Easter egg check
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

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-between p-4">
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col items-center gap-6 pt-10">
        <div className="w-full flex flex-col items-center gap-4 relative">
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter product name"
            className="w-full max-w-md px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          )}
          <button 
            onClick={handleSearch}
            className="w-48 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
          >
            SEARCH
          </button>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
              {error ? (
                <p className="text-red-500 text-lg font-medium">{error}</p>
              ) : result ? (
                result.easterEgg ? (
                  <img
                    src={easterEggGif}
                    alt="Easter egg animation"
                    className="w-[200px] h-auto"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-6 w-full">
                    <p className="text-xl text-center font-medium break-words w-full">
                      {result["libellé eCommerce"]}
                    </p>
                    <div className="bg-white p-4 rounded-lg flex justify-center w-full">
                      <svg id="barcode" className="w-full"></svg>
                      {barcodeError && (
                        <p className="text-red-500 text-sm mt-2">Unable to generate barcode</p>
                      )}
                    </div>
                    <p className="text-lg font-bold">EAN: {result.EAN}</p>
                  </div>
                )
              ) : (
                <p className="text-gray-500 text-center text-lg">
                  Enter a product name to search
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-white text-center py-4">
        {isEasterEgg ? (
          <p className="text-sm md:text-base">🦅🦅🦅 T3ich Raja 🦅🦅🦅</p>
        ) : (
          <>
            <p className="text-sm md:text-base">Made by: Wyatt</p>
            <p className="text-sm md:text-base">Powered by: Team AINSBAA</p>
          </>
        )}
      </div>
    </div>
  );
};

export default BarcodeSearch;