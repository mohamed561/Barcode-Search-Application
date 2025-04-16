# 📦 BSA Barcode Search APP

The **BSA Barcode Search APP** is a simple, dark-themed React app designed to help users look up product stock and details using an EAN barcode. It features barcode rendering, multi-database search, keyboard navigation, and feedback collection.

![screenshot](screenshot.png) <!-- optional: replace with actual screenshot path -->

## 🚀 Features

- 🔍 **EAN Search**: Enter a product name or EAN to search across multiple datasets.
- 🧠 **Smart Matching**: Supports normalized search with fallback suggestions.
- 📦 **Stock Checker**: View stock quantity and details instantly.
- 🧾 **Barcode Generator**: Generates scannable barcodes using JsBarcode.
- 💬 **Feedback Prompt**: Asks for user feedback (once every 3 days).
- 🌙 **Modern UI**: Clean dark interface using Tailwind CSS.

## 🛠️ Tech Stack

- **React** (with functional components & hooks)
- **Tailwind CSS**
- **JsBarcode**
- **LocalStorage** (for feedback control)
- **Two-level JSON product databases**

## 📂 Folder Structure

src/ ├── components/ │ └── BarcodeSearch.jsx # Main component ├── assets/ │ └── productData.json # Primary product database │ └── extraProductData.json # Secondary fallback database ├── App.jsx └── index.js

bash
Copy
Edit

## 🧪 Usage

### 1. Clone the repo

```bash
git clone https://github.com/mohamed561/Barcode-Search-Application.git
cd bsa-barcode-search-app
2. Install dependencies
bash
Copy
Edit
npm install
3. Run the app
bash
Copy
Edit
npm start
The app will run on http://localhost:3000.

🧑‍💻 Developer Notes
The app prioritizes fast access and usability in warehouse or retail environments.

To extend the search capability, just update the two JSON datasets with new products.

Feedback modal appears only every 3 days (configurable via localStorage).

📌 Future Plans
Add QR code generation support

Export product results as PDF or CSV

Sync with a live product database API

Add mobile layout improvements

📧 Contact
For security issues or inquiries: Mohamed – mohamedtroufi01@gmail.com

Made with ❤️ using React + Tailwind CSS

yaml
Copy
Edit

---

Let me know if you'd like this in a downloadable file or need help generating the screenshot preview section.