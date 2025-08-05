'use client';
import { useState, useRef } from 'react';
import { UploadCloud, Loader2, Download, FileText, X, CheckCircle2, FileInput } from 'lucide-react';

export default function PDFToText() {
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [preserveLayout, setPreserveLayout] = useState(true);
  const [includePageBreaks, setIncludePageBreaks] = useState(true);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    validateAndSetFile(selected);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (file) => {
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      setFile(file);
      setTextContent('');
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const extractText = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }

    setIsLoading(true);
    setTextContent('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('preserveLayout', preserveLayout);
    formData.append('includePageBreaks', includePageBreaks);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://your-backend-api/pdf-to-text/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Text extraction failed');
      }

      const result = await response.json();
      setTextContent(result.text || 'No text content found');

    } catch (error) {
      console.error('Extraction failed:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTextFile = () => {
    if (!textContent) return;
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_text_${file.name.replace('.pdf', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-700 bg-gradient-to-r from-gray-800/50 to-gray-800">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            PDF to Text Converter
          </h1>
          <p className="text-gray-400">Extract clean, readable text from PDF documents</p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-8 mb-6 transition-all cursor-pointer ${
              isDragging ? 'border-cyan-400 bg-gray-700/50' : 'border-gray-600 hover:border-cyan-400/50 bg-gray-800/30'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileInput size={48} className={`mb-4 ${isDragging ? 'text-cyan-400' : 'text-gray-500'}`} />
              <p className={`text-lg font-medium ${isDragging ? 'text-cyan-400' : 'text-gray-400'}`}>
                {isDragging ? 'Drop your PDF here' : 'Drag & drop PDF or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mt-2">Supports: .pdf (Max 50MB)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* File Preview */}
          {file && (
            <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-600 rounded-lg">
                  <FileText size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-200">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setFile(null);
                  setTextContent('');
                }}
                className="p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Extraction Options */}
          {file && !textContent && (
            <div className="mb-6 bg-gray-700/30 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Extraction Options</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preserveLayout"
                    checked={preserveLayout}
                    onChange={(e) => setPreserveLayout(e.target.checked)}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="preserveLayout" className="ml-3 block text-sm font-medium text-gray-400">
                    Preserve document layout
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includePageBreaks"
                    checked={includePageBreaks}
                    onChange={(e) => setIncludePageBreaks(e.target.checked)}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="includePageBreaks" className="ml-3 block text-sm font-medium text-gray-400">
                    Include page breaks
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Text */}
          {textContent && (
            <div className="mb-6 bg-gray-700/30 rounded-lg p-6 border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-300">Extracted Text</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(textContent)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-gray-200 text-sm"
                  >
                    Copy Text
                  </button>
                  <button
                    onClick={downloadTextFile}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-sm"
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-700">
                <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
                  {includePageBreaks 
                    ? textContent.replace(/\f/g, '\n\n--- Page Break ---\n\n') 
                    : textContent}
                </pre>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!textContent ? (
              <button
                onClick={extractText}
                disabled={!file || isLoading}
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all ${
                  !file || isLoading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-700 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Extracting Text...
                  </>
                ) : (
                  <>
                    <FileText size={20} className="mr-2" />
                    {file ? 'Extract Text from PDF' : 'Upload PDF First'}
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="bg-gray-700/50 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-center gap-2">
                  <CheckCircle2 className="text-cyan-400" size={20} />
                  <p className="text-cyan-400 font-medium">Text Extraction Completed!</p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setTextContent('');
                  }}
                  className="w-full py-3 rounded-lg font-medium text-cyan-400 hover:text-cyan-300 flex items-center justify-center transition-all border border-gray-600 hover:border-cyan-400/30"
                >
                  Process Another PDF
                </button>
              </>
            )}
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <FileText className="w-6 h-6 text-cyan-400" />, title: 'Accurate Extraction', desc: 'Preserves original content structure' },
              { icon: <UploadCloud className="w-6 h-6 text-purple-400" />, title: 'Fast Processing', desc: 'Quickly extract text from any PDF' },
              { icon: <CheckCircle2 className="w-6 h-6 text-green-400" />, title: 'Clean Output', desc: 'Readable text without PDF artifacts' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600 text-center hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-center mb-3">
                  {item.icon}
                </div>
                <h4 className="font-medium text-gray-200 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}