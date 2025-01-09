import React, { useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { database } from '../data/database';

const BarcodeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (result && result.EAN) {
      try {
        // Clear any previous barcode
        document.getElementById('barcode').innerHTML = '';
        
        // Generate new barcode with specific settings for better scanning
        JsBarcode("#barcode", result.EAN, {
          format: "EAN13",
          width: 3,
          height: 150,
          displayValue: true,
          fontSize: 20,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000"
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
        setError('Invalid EAN code format');
      }
    }
  }, [result]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('Please enter a product name');
      setResult(null);
      return;
    }

    let foundItem = null;
    for (const item of database) {
      if (item["Articles Ecommerce"]) {
        foundItem = item["Articles Ecommerce"].find(article => 
          article["libellé eCommerce"].toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (foundItem) break;
      }
    }

    if (foundItem) {
      setResult(foundItem);
      setError('');
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
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center">
            {error ? (
              <p className="text-red-500 text-center text-lg">{error}</p>
            ) : result ? (
              <div className="flex flex-col items-center gap-6">
                <p className="text-xl text-center font-medium break-words max-w-full">
                  {result["libellé eCommerce"]}
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <svg id="barcode" className="max-w-full"></svg>
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

      {/* Footer */}
      <div className="w-full text-white text-center py-4">
        <p className="text-sm md:text-base">Made by: Wyatt</p>
        <p className="text-sm md:text-base">Powered by: Team AINSBAA</p>
      </div>
    </div>
  );
};

export default BarcodeSearch;