// This is the complete code for the React frontend application.
// Replace the entire content of `decksmith-ai/frontend/src/App.jsx` with this code.

import { useState } from 'react';
import axios from 'axios';

function App() {
  // State variables to hold user input and application status
  const [text, setText] = useState('');
  const [guidance, setGuidance] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [templateFile, setTemplateFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    
    // Basic validation
    if (!text || !apiKey || !templateFile) {
      setError('Please fill in all required fields: text, API key, and template file.');
      return;
    }

    // Clear previous errors and set loading state
    setError('');
    setIsLoading(true);

    // Create a FormData object to send file and text data
    const formData = new FormData();
    formData.append('text', text);
    formData.append('guidance', guidance);
    formData.append('apiKey', apiKey);
    formData.append('template', templateFile);

    try {
      // Send the request to the backend API
      const response = await axios.post('/api/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Important to handle the file download response
      });

      // Create a URL for the returned file blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'generated_presentation.pptx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (err) {
      // Handle errors from the API
      const errorText = err.response && err.response.data.error 
        ? err.response.data.error 
        : 'An unknown error occurred. Check the backend console.';
      setError(errorText);
      console.error(err);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };
  
  // The JSX that defines the user interface
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            DeckSmith AI
          </h1>
          <p className="text-gray-400 mt-2">Your Text, Your Style – Auto-Generate a Presentation</p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-2xl space-y-6">
          {/* Text Input */}
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
              Paste Your Text or Markdown *
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="Paste a large chunk of text, an article, or meeting notes here..."
            />
          </div>

          {/* Guidance Input */}
          <div>
            <label htmlFor="guidance" className="block text-sm font-medium text-gray-300 mb-2">
              Guidance (Optional)
            </label>
            <input
              type="text"
              id="guidance"
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="e.g., 'Turn this into an investor pitch deck'"
            />
          </div>

          {/* API Key and Template Upload Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                Your Gemini API Key *
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="Your key is not stored or logged"
              />
            </div>
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-300 mb-2">
                Upload PowerPoint Template (.pptx) *
              </label>
              <input
                type="file"
                id="template"
                onChange={(e) => setTemplateFile(e.target.files[0])}
                accept=".pptx,.potx"
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition"
              />
            </div>
          </div>
          
          {/* Error Message Display */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
              <p><span className="font-bold">Error:</span> {error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Generating...' : 'Generate Presentation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;

// --- How to Run and Test the Full Application ---
// 1. Open TWO terminals in VS Code.
// 2. In Terminal 1 (Backend):
//    - Navigate to `decksmith-ai/backend`.
//    - Activate the venv: `source venv/bin/activate`
//    - Run the server: `python app.py`
// 3. In Terminal 2 (Frontend):
//    - Navigate to `decksmith-ai/frontend`.
//    - Run the React app: `npm run dev`
// 4. A URL like `http://localhost:5173/` will be shown in Terminal 2. Open it in your browser.
// 5. The web app should appear. Fill in the form, upload a .pptx file, and click generate.
// 6. If everything is correct, a new PowerPoint file should download after a few seconds.