BSA Barcode Search APP
Overview
The BSA Barcode Search APP is a React-based web application that allows users to search for products by name and generate their corresponding EAN barcodes. The application supports both EAN-8 and EAN-13 barcode formats and includes features like swipe navigation for multiple results, an easter egg feature (currently disabled), and a responsive design. This project is licensed under the MIT License to encourage broad use and contributions. The app is used internally by MARJANE HOLDING and GOFLEET for workplace purposes.
Features

Product Search: Search for products by name from databases of EAN codes.
Barcode Generation: Automatically generates EAN-8 or EAN-13 barcodes using the jsbarcode library.
Multiple Results Navigation: Swipe left/right or use buttons to navigate through multiple matching products.
Easter Egg: Enter 4=4 to trigger a placeholder message (animation disabled pending asset licensing).
Responsive Design: Features a dark-themed, modern interface with a centered search bar, optimized for both desktop and mobile devices.
Error Handling: Displays user-friendly error messages for invalid searches or barcode generation failures.

Installation
Prerequisites

Node.js (v14 or higher)
npm or yarn

Steps

Clone the Repository:
git clone https://github.com/mohamed561/Barcode-Search-Application.git
cd bsa-barcode-search


Install Dependencies:
npm install

or
yarn install


Install jsbarcode:
npm install jsbarcode

or
yarn add jsbarcode


Set Up Databases:

The repository includes sample database.js and constantDatabase.js files with generic EAN codes in the following format:
export const database = [
  {
    "Articles Ecommerce": [
      { "libellé eCommerce": "Sample Cereal", "EAN": "1234567890123" },
      { "libellé eCommerce": "Sample Beverage", "EAN": "9876543210987" }
    ]
  }
];

Note: EAN codes are publicly available on product packaging. You can use the provided sample databases or create your own with EAN codes in the same format.



Run the Application:
npm start

or
yarn start

The app will be available at http://localhost:3000.


Usage

Search for a Product:

Enter a product name in the search input and click the "SEARCH" button or press Enter.
The app searches the provided database and constantDatabase for matching EAN codes.


View Results:

If a match is found, the product name, EAN code, and barcode are displayed.
If multiple matches exist, use the "Previous" and "Next" buttons or swipe left/right to navigate.


Easter Egg:

Enter 4=4 in the search field to display a placeholder message (animation disabled pending licensing from Abu Dhabi Sports).


Clear Search:

Click the clear button (X) in the search input to reset the search.



Project Structure
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
├── LICENSE
├── package.json
└── README.md

Dependencies
This project uses the following dependencies, licensed under the MIT License:

React: Frontend library for building the UI.
jsbarcode: Library for generating EAN barcodes.
Tailwind CSS: Used indirectly via inline styles mimicking Tailwind classes.

Licensing
The BSA Barcode Search APP is licensed under the MIT License. This license allows you to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, provided you include the copyright notice and permission notice in all copies or substantial portions of the software. See the LICENSE file for details.
Workplace Use: This application is used by Mohamed Troufi and their coworkers at MARJANE HOLDING and GOFLEET, including all affiliated stores (e.g., Aïn Sebaâ, California, Marina), for internal business purposes.
Notes on Assets and Data

Assets: The easter-egg.gif (sourced from a 2019 football game aired by Abu Dhabi Sports) is currently excluded from this repository due to unresolved copyright status. The easter egg feature displays a placeholder message until permission is obtained or a new licensed asset is added.
Data: The database.js and constantDatabase.js files contain sample EAN codes, which are publicly available on product packaging. Users can use the provided samples or create their own databases with EAN codes in the same format.

Usage Note
This is a search application designed to query EAN codes from user-provided or sample databases. Users are responsible for testing the application with their own data to ensure accuracy and functionality.
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit your changes (git commit -m 'Add feature').
Push to the branch (git push origin feature-name).
Open a pull request.

For detailed guidelines, see the CONTRIBUTING.md file (to be added). Contributions must comply with the MIT License.
Credits

Developed by: Mohamed Troufi
Powered by: Team AINSBAA
Version: 2.0

License
This project is licensed under the MIT License. See the LICENSE file for details.
