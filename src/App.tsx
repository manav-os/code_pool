import React, { useState } from 'react';
import { Code2, Languages, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

type Language = 'en' | 'es' | 'fr';

// Initialize Gemini API
//hi
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [output, setOutput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const analyzeCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setOutput('');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Analyze this code and explain what it does in ${language === 'en' ? 'English' : language === 'es' ? 'Hindi' : 'French'}. Include:
      1. Main purpose
      2. Key components/functions
      3. Any potential issues or improvements
      4. Best practices used or missing
      
      Code to analyze:
      ${code}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setOutput(response.text());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the code');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Code2 className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">CodeBridge</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Code Input</h2>
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-gray-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="border rounded-md px-3 py-1 bg-gray-50"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="w-full h-64 p-4 border rounded-lg font-mono text-sm bg-gray-50"
          />

          <button
            onClick={analyzeCode}
            disabled={isAnalyzing}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 
                     transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Code2 className="w-4 h-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              <p className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </p>
            </div>
          )}
        </div>

        {output && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Analysis Result</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{output}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;