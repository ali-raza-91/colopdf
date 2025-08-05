'use client';
import { useState, useRef, useEffect } from 'react';
import { UploadCloud, Loader2, Download, FileText, X, CheckCircle2, ScanText, Sparkles } from 'lucide-react';

export default function OCRPDF() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [language, setLanguage] = useState('eng'); // Default to English
  const fileInputRef = useRef(null);

  // Supported languages for OCR
  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'fra', name: 'French' },
    { code: 'spa', name: 'Spanish' },
    { code: 'deu', name: 'German' },
    { code: 'chi_sim', name: 'Chinese Simplified' },
    { code: 'ara', name: 'Arabic' },
  ];

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
      setDownloadUrl('');
      setOcrText('');
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const performOCR = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setOcrText('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    try {
      // Using a mock progress for demonstration
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 300);

      const response = await fetch('http://your-backend-api/perform-ocr/', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('OCR processing failed');
      }

      const result = await response.json();
      setOcrText(result.text);

      // If your backend returns a downloadable file
      if (result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
      }

    } catch (error) {
      console.error('OCR failed:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTextFile = () => {
    if (!ocrText) return;
    
    const blob = new Blob([ocrText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr_result_${file.name.replace('.pdf', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            OCR PDF Converter
          </h1>
          <p className="text-gray-400">Convert scanned PDFs into editable and searchable text</p>
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
              <ScanText size={48} className={`mb-4 ${isDragging ? 'text-cyan-400' : 'text-gray-500'}`} />
              <p className={`text-lg font-medium ${isDragging ? 'text-cyan-400' : 'text-gray-400'}`}>
                {isDragging ? 'Drop your PDF here' : 'Drag & drop scanned PDF or click to browse'}
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
                  setDownloadUrl('');
                  setOcrText('');
                }}
                className="p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Language Selection */}
          {file && (
            <div className="mb-6 bg-gray-700/30 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-medium text-gray-300 mb-4">OCR Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Document Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:border-cyan-400 focus:outline-none"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isLoading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* OCR Results */}
          {ocrText && (
            <div className="mb-6 bg-gray-700/30 rounded-lg p-6 border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-300">Extracted Text</h3>
                <button
                  onClick={downloadTextFile}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white"
                >
                  <Download size={16} /> Download Text
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">{ocrText}</pre>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!ocrText ? (
              <button
                onClick={performOCR}
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
                    Processing PDF...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="mr-2" />
                    {file ? 'Extract Text with OCR' : 'Upload PDF First'}
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="bg-gray-700/50 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-center gap-2">
                  <CheckCircle2 className="text-cyan-400" size={20} />
                  <p className="text-cyan-400 font-medium">OCR Completed Successfully!</p>
                </div>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={`ocr_${file.name}`}
                    className="w-full py-4 rounded-xl font-medium text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg flex items-center justify-center transition-all border border-gray-600"
                  >
                    <Download size={20} className="mr-2" />
                    Download Searchable PDF
                  </a>
                )}
                <button
                  onClick={() => {
                    setFile(null);
                    setDownloadUrl('');
                    setOcrText('');
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
              { icon: <ScanText className="w-6 h-6 text-cyan-400" />, title: 'OCR Technology', desc: 'Extract text from scanned documents' },
              { icon: <FileText className="w-6 h-6 text-purple-400" />, title: 'Multi-Language', desc: 'Supports 100+ languages' },
              { icon: <Sparkles className="w-6 h-6 text-amber-400" />, title: 'High Accuracy', desc: 'Advanced text recognition' },
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