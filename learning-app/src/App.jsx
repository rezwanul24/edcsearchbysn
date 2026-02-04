import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [serial, setSerial] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Unified fetch function (used by both live + button search)
  const fetchData = async (value) => {
    if (!value) {
      setError('Please enter a serial number');
      setData(null);
      return;
    }

    try {
      const res = await fetch(`https://script.google.com/macros/s/AKfycbxDSazECZDythUcrOCShfBhgOd6Wm36J3be082OIwvOXOGIQVa0CmPWiiK4Y3mSwq_P/exec${value}`);
      const result = await res.json();

      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result);
        setError('');
      }
    } catch {
      setError('Failed to fetch data. Please try again.');
      setData(null);
    }
  };

  // 🔄 Live search (onChange debounce)
  useEffect(() => {
    if (!serial) {
      setData(null);
      setError('');
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      fetchData(serial);
    }, 1);

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [serial]);

  // 🔍 Manual search button
  const handleSearch = () => {
    if (typingTimeout) clearTimeout(typingTimeout); // cancel live delay
    fetchData(serial);
  };

  return (
    <div className="h-screen w-screen bg-gray-100 text-black flex items-center justify-center px-6 py-12 mt-6">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-300">
        <h1 className="text-2xl sm:text-3xl font-medium text-black mb-8 text-center tracking-tight font-[Hind Siliguri]">
          EDC S.N. অনুসারে তথ্য অনুসন্ধান
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="যেমন: 746"
            className="w-full px-6 py-3 rounded-xl bg-gray-100 text-black placeholder-gray-500 shadow-inner focus:outline-none focus:ring-4 focus:ring-purple-400 transition border border-gray-300"
          />
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-100 text-black font-medium shadow-inner border border-gray-300 hover:bg-purple-200 transition"
          >
            অনুসন্ধান করুন
          </button>
        </div>

        {error && <p className="text-red-600 text-center font-medium mb-4">{error}</p>}

        {data && (
          <div className="bg-gray-50 rounded-xl p-6 overflow-x-auto border border-gray-300">
            <table className="w-full text-sm table-auto border border-gray-300">
              <tbody>
                {Object.entries(data).map(([key, value]) => (
                  <tr key={key} className="border border-gray-300 text-center align-top">
                    <td className="py-3 px-4 font-medium text-gray-600 border border-gray-300 text-center align-top">{key}</td>
                    <td className="py-3 px-4 text-gray-800 border border-gray-300 text-center align-top">{value || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
