# BSA Barcode Search APP

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## Overview

The BSA Barcode Search APP is a React-based web application that allows users to search for products by name and generate their corresponding EAN barcodes. The application supports both EAN-8 and EAN-13 barcode formats and includes features like swipe navigation for multiple results, an easter egg feature (currently disabled), and a responsive design. This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0) to allow non-commercial use while restricting commercial applications. The app is used internally by MARJANE HOLDING and GOFLEET for workplace purposes, with specific permissions granted for such use.

## Features

- **Product Search**: Search for products by name from databases of EAN codes.
- **Barcode Generation**: Automatically generates EAN-8 or EAN-13 barcodes using the `jsbarcode` library.
- **Multiple Results Navigation**: Swipe left/right or use buttons to navigate through multiple matching products.
- **Easter Egg**: Enter `4=4` to trigger a placeholder message (animation disabled pending asset licensing).
- **Responsive Design**: Optimized for both desktop and mobile devices with touch support.
- **Error Handling**: Displays user-friendly error messages for invalid searches or barcode generation failures.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the Repository**:

   ```bash
   git clone <[text](https://github.com/mohamed561/Barcode-Search-Application.git)>
   cd bsa-barcode-search
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Install jsbarcode**:

   ```bash
   npm install jsbarcode
   ```

   or

   ```bash
   yarn add jsbarcode
   ```

4. **Set Up Databases**:

   - The repository includes sample `database.js` and `constantDatabase.js` files with generic EAN codes in the following format:

     ```javascript
     export const database = [
       {
         "Articles Ecommerce": [
           { "libellé eCommerce": "Sample Cereal", "EAN": "1234567890123" },
           { "libellé eCommerce": "Sample Beverage", "EAN": "9876543210987" }
         ]
       }
     ];
     ```

     **Note**: EAN codes are publicly available on product packaging. You can use the provided sample databases or create your own with EAN codes in the same format.

5. **Run the Application**:

   ```bash
   npm start
   ```

   or

   ```bash
   yarn start
   ```

   The app will be available at `http://localhost:3000`.

## Usage

1. **Search for a Product**:

   - Enter a product name in the search input and click the "SEARCH" button or press Enter.
   - The app searches the provided `database` and `constantDatabase` for matching EAN codes.

2. **View Results**:

   - If a match is found, the product name, EAN code, and barcode are displayed.
   - If multiple matches exist, use the "Previous" and "Next" buttons or swipe left/right to navigate.

3. **Easter Egg**:

   - Enter `4=4` in the search field to display a placeholder message (animation disabled pending licensing from Abu Dhabi Sports).

4. **Clear Search**:

   - Click the clear button (X) in the search input to reset the search.

## Project Structure

```
bsa-barcode-search/
├── src/
│   ├── assets/
│   │   └── placeholder.txt # easter-egg.gif excluded pending licensing
│   ├── data/
│   │   ├── database.js        # Sample EAN codes
│   │   └── constantDatabase.js # Sample EAN codes
│   ├── components/
│   │   └── BarcodeSearch.js
│   ├── App.js
│   └── index.js
├── public/
│   └── index.html
├── LICENSE.md
├── package.json
└── README.md
```

## Dependencies

This project uses the following dependencies, licensed under the MIT License:
- **React**: Frontend library for building the UI.
- **jsbarcode**: Library for generating EAN barcodes.
- **Tailwind CSS**: Used indirectly via inline styles mimicking Tailwind classes.

## Licensing

The BSA Barcode Search APP is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)**. This license allows you to:
- Use, modify, and share the code for **non-commercial purposes** (e.g., personal projects, educational use).
- Share derivatives under the same CC BY-NC-SA 4.0 license.
- Credit Mohamed Troufi as the original author.

**Commercial Use**: The CC BY-NC-SA 4.0 license prohibits commercial use, including selling the code or using it in professional products. If you wish to use this project commercially (e.g., to sell an improved version or integrate it into a commercial product), please contact Mohamed Troufi at mohamedtroufi01@gmail.com to negotiate a separate commercial license. Commercial licenses may include terms for restitution, such as a licensing fee or royalty agreement.

**Workplace Use**: This application is used by Mohamed Troufi and their coworkers for internal business purposes at MARJANE HOLDING and GOFLEET, including all affiliated stores (e.g., Aïn Sebaâ, California, Marina). The copyright holder (Mohamed Troufi) grants MARJANE HOLDING and GOFLEET permission to use the BSA Barcode Search APP internally, provided it is not sold or redistributed externally. Any external commercial use or distribution requires a separate commercial license.

### Development of Licensing Choice
The CC BY-NC-SA 4.0 license was chosen to encourage non-commercial use (e.g., personal projects, educational purposes, or open-source contributions) while protecting the project from unauthorized commercial exploitation. This license ensures that any derivatives remain non-commercial and openly shared, aligning with the goal of fostering community use without allowing others to profit directly from the code. For commercial applications, a separate licensing process was established to provide fair restitution to the original author, Mohamed Troufi. The workplace context was addressed by granting explicit permission for internal use by MARJANE HOLDING and GOFLEET, ensuring compliance with the non-commercial restriction while supporting its use in the developer’s professional environment.

### Notes on Assets and Data
- **Assets**: The `easter-egg.gif` (sourced from a 2019 football game aired by Abu Dhabi Sports) is currently excluded from this repository and license due to unresolved copyright status. The easter egg feature displays a placeholder message until permission is obtained or a new licensed asset is added.
- **Data**: The `database.js` and `constantDatabase.js` files contain sample EAN codes, which are publicly available on product packaging. Users can use the provided samples or create their own databases with EAN codes in the same format.

### Usage Note
This is a search application designed to query EAN codes from user-provided or sample databases. Users are responsible for testing the application with their own data to ensure accuracy and functionality.

## Contributing

Contributions are welcome for non-commercial purposes! Please contact me at the provided email below.
## Credits

- **Developed by**: Mohamed Troufi
- **Powered by**: Team AINSBAA
- **Version**: 2.0

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. See the [LICENSE.md](//LICENSE.md) file for details. For commercial use, contact Mohamed Troufi at mohamedtroufi01@gmail.com to discuss licensing options.