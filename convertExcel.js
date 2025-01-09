const XLSX = require('xlsx');
const fs = require('fs');

function convertExcelToJson(excelFilePath) {
    // Read the Excel file
    const workbook = XLSX.readFile(excelFilePath);
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Write to a JSON file
    fs.writeFileSync(
        './src/data/database.json',
        JSON.stringify(jsonData, null, 2)
    );
    
    console.log('Conversion completed! Check database.json');
}

// Replace 'your-excel-file.xlsx' with your actual file name
convertExcelToJson('your-excel-file.xlsx');