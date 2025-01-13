import React, { useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { database } from '../data/database';
import { constantDatabase } from '../data/constantDatabase';

const BarcodeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [barcodeError, setBarcodeError] = useState(false);

  // Function to validate and format EAN
  const formatEAN = (ean) => {
    if (!ean) return null;
    
    // Remove any non-digit characters
    const cleanEan = ean.toString().replace(/\D/g, '');
    
    // Check if it starts with 2 (weight-based barcode)
    if (cleanEan.startsWith('2')) {
      return cleanEan;
    }
    
    // Regular EAN-13 format
    if (cleanEan.length !== 13) {
      return cleanEan.padStart(13, '0');
    }
    
    return cleanEan;
  };

  useEffect(() => {
    if (result && result.EAN) {
      try {
        document.getElementById('barcode').innerHTML = '';
        setBarcodeError(false);
        
        const formattedEAN = formatEAN(result.EAN);
        
        if (!formattedEAN) {
          throw new Error('Invalid EAN code');
        }

        JsBarcode("#barcode", formattedEAN, {
          format: "EAN13",
          width: 2,
          height: 100,
          displayValue: true,
          fontSize: 16,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000",
          text: formattedEAN,
          valid: (valid) => {
            if (!valid) {
              throw new Error('Invalid barcode format');
            }
          }
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
        document.getElementById('barcode').innerHTML = '';
        setBarcodeError(true);
        // Don't set error state here to allow displaying the item details
      }
    }
  }, [result]);

  const searchInDatabase = (searchTerm, db) => {
    for (const item of db) {
      if (item["Articles Ecommerce"]) {
        const foundItem = item["Articles Ecommerce"].find(article => 
          article["libellé eCommerce"].toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (foundItem) return foundItem;
      }
    }
    return null;
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('Please enter a product name');
      setResult(null);
      return;
    }

    // First search in constant database
    let foundItem = searchInDatabase(searchTerm, constantDatabase);
    let isFromConstant = true;

    // If not found in constant database, search in main database
    if (!foundItem) {
      foundItem = searchInDatabase(searchTerm, database);
      isFromConstant = false;
    }

    if (foundItem) {
      setResult({
        ...foundItem,
        isConstant: isFromConstant
      });
      setError('');
      setBarcodeError(false);
    } else {
      setResult(null);
      setError('Product not found');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-between p-4">
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col items-center gap-6 pt-10">
        {/* Search Container */}
        <div className="w-full flex flex-col items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter product name"
            className="w-full max-w-md px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSearch}
            className="w-48 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
          >
            SEARCH
          </button>
        </div>

        {/* Results Container */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
              {error ? (
                <p className="text-red-500 text-center text-lg">{error}</p>
              ) : result ? (
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
                  <p className="text-lg font-bold">
                    EAN: {result.EAN}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-center text-lg">
                  Enter a product name to search
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-white text-center py-4">
        <p className="text-sm md:text-base">Made by: Wyatt</p>
        <p className="text-sm md:text-base">Powered by: Team AINSBAA</p>
      </div>
    </div>
  );
};

export default BarcodeSearch;