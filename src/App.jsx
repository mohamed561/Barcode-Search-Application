import BarcodeSearch from './components/BarcodeSearch'
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      <BarcodeSearch />
      <Analytics />
    </div>
  )
}

export default App