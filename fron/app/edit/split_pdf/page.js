'use client';
import { useState } from 'react';
import { UploadCloud, Loader2, Download, FileText, X, CheckCircle2, Scissors, ListOrdered, Shield } from 'lucide-react';

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [splitMode, setSplitMode] = useState('range'); // 'range' or 'every'
  const [pageRange, setPageRange] = useState('');
  const [interval, setInterval] = useState(1);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
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
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = (selectedFile) => {
    if (selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setFile(selectedFile);
      setDownloadUrls([]);
    } else {
      alert('Only PDF files are accepted');
    }
  };

  const removeFile = () => {
    setFile(null);
    setDownloadUrls([]);
  };

  const handleSplit = async () => {
    if (!file) {
      alert('Please select a PDF file to split');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', splitMode);
    
    if (splitMode === 'range') {
      formData.append('range', pageRange);
    } else {
      formData.append('interval', interval);
    }

    try {
      const response = await fetch('http://your-django-backend/api/split-pdf/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      
      // Assuming backend returns an array of file URLs
      setDownloadUrls(result.files);
    } catch (error) {
      console.error('Split failed:', error);
      alert(`Split failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePageRange = (value) => {
    // Simple validation for page range format (e.g., "1-3,5,7-9")
    return /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/.test(value);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            Split PDF Files
          </h1>
          <p className="text-gray-400">Divide a PDF into multiple documents</p>
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
            onClick={() => document.getElementById('file-input').click()}
          >
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Scissors size={48} className={`mb-4 ${isDragging ? 'text-cyan-400' : 'text-gray-500'}`} />
              <p className={`text-lg font-medium ${isDragging ? 'text-cyan-400' : 'text-gray-400'}`}>
                {isDragging ? 'Drop your PDF here' : 'Drag & drop PDF or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mt-2">Supports: .pdf</p>
            </div>
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* File Preview */}
          {file && (
            <div className="mb-8">
              <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4 border border-gray-600 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-600 rounded-lg">
                    <FileText size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      PDF Document
                    </p>
                  </div>
                </div>
                <button 
                  onClick={removeFile}
                  className="p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Split Options */}
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 mb-6">
                <h3 className="font-medium text-gray-300 mb-3">Split Options</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => setSplitMode('range')}
                    className={`p-3 rounded-lg border transition-all ${
                      splitMode === 'range'
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                        : 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <p className="font-medium">Page Range</p>
                    <p className="text-xs mt-1">Select specific pages</p>
                  </button>
                  <button
                    onClick={() => setSplitMode('every')}
                    className={`p-3 rounded-lg border transition-all ${
                      splitMode === 'every'
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                        : 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <p className="font-medium">Interval</p>
                    <p className="text-xs mt-1">Split every N pages</p>
                  </button>
                </div>

                {splitMode === 'range' ? (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Page Range (e.g., 1-3,5,7-9)</label>
                    <input
                      type="text"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      placeholder="1-5,8,10-12"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-2">Enter page numbers or ranges separated by commas</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Split every N pages</label>
                    <input
                      type="number"
                      min="1"
                      value={interval}
                      onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {downloadUrls.length === 0 ? (
              <button
                onClick={handleSplit}
                disabled={!file || isLoading || (splitMode === 'range' && !validatePageRange(pageRange))}
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all ${
                  !file || isLoading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-700 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Splitting...
                  </>
                ) : (
                  <>
                    <Scissors size={20} className="mr-2" />
                    {!file ? 'Select a PDF' : `Split PDF`}
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="bg-gray-700/50 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-center gap-2">
                  <CheckCircle2 className="text-cyan-400" size={20} />
                  <p className="text-cyan-400 font-medium">Split successful! {downloadUrls.length} files created</p>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {downloadUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      download={`split-document-${index + 1}.pdf`}
                      className="w-full py-3 px-4 rounded-lg font-medium text-gray-200 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-cyan-400/30 flex items-center justify-between transition-all"
                    >
                      <span>Part {index + 1}</span>
                      <Download size={18} className="text-cyan-400" />
                    </a>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setDownloadUrls([]);
                    setPageRange('');
                    setInterval(1);
                  }}
                  className="w-full py-3 rounded-lg font-medium text-cyan-400 hover:text-cyan-300 flex items-center justify-center transition-all border border-gray-600 hover:border-cyan-400/30"
                >
                  Split Another File
                </button>
              </>
            )}
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Scissors className="w-6 h-6 text-cyan-400" />, title: 'Split', desc: 'Divide PDF into multiple files' },
              { icon: <ListOrdered className="w-6 h-6 text-purple-400" />, title: 'Flexible', desc: 'By page range or interval' },
              { icon: <Shield className="w-6 h-6 text-amber-400" />, title: 'Secure', desc: 'Files deleted after processing' },
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