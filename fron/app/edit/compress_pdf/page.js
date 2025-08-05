'use client';
import { useState } from 'react';
import { UploadCloud, Loader2, Download, FileText, X, CheckCircle2, FileInput, Gauge, Shield } from 'lucide-react';
export default function CompressPDF() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

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
      setOriginalSize(selectedFile.size);
      setCompressedSize(0);
      setDownloadUrl('');
    } else {
      alert('Only PDF files are accepted');
    }
  };

  const removeFile = () => {
    setFile(null);
    setDownloadUrl('');
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const handleCompress = async () => {
    if (!file) {
      alert('Please select a PDF file to compress');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('compression_level', compressionLevel);

    try {
      const response = await fetch('http://your-django-backend/api/compress-pdf/', {
        method: 'POST',
        body: formData,
        // Django CSRF token would be handled via cookies in a real app
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const blob = await response.blob();
      setCompressedSize(blob.size);
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Compression failed:', error);
      alert(`Compression failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateReduction = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            Compress PDF Files
          </h1>
          <p className="text-gray-400">Reduce PDF file size while preserving quality</p>
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
              <FileInput size={48} className={`mb-4 ${isDragging ? 'text-cyan-400' : 'text-gray-500'}`} />
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
              <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4 border border-gray-600 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-600 rounded-lg">
                    <FileText size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.size)} • PDF Document
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

              {/* Compression Options */}
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 mb-6">
                <h3 className="font-medium text-gray-300 mb-3">Compression Level</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { level: 'low', label: 'Low', desc: 'Smaller size reduction, best quality' },
                    { level: 'medium', label: 'Medium', desc: 'Balanced size and quality' },
                    { level: 'high', label: 'High', desc: 'Maximum compression, lower quality' },
                  ].map((option) => (
                    <button
                      key={option.level}
                      onClick={() => setCompressionLevel(option.level)}
                      className={`p-3 rounded-lg border transition-all ${
                        compressionLevel === option.level
                          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                          : 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs mt-1">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Size Comparison */}
          {(originalSize > 0 || compressedSize > 0) && (
            <div className="mb-8 bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <h3 className="font-medium text-gray-300 mb-3">Size Comparison</h3>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">Original</p>
                  <p className="font-medium text-gray-200">{formatFileSize(originalSize)}</p>
                </div>
                <div className="relative flex-1">
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" 
                      style={{ width: compressedSize > 0 ? `${(compressedSize / originalSize) * 100}%` : '0%' }}
                    />
                  </div>
                  {compressedSize > 0 && (
                    <p className="absolute right-0 top-6 text-xs text-cyan-400">
                      {calculateReduction()}% smaller
                    </p>
                  )}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm text-gray-400 mb-1">Compressed</p>
                  <p className={`font-medium ${compressedSize > 0 ? 'text-purple-400' : 'text-gray-400'}`}>
                    {compressedSize > 0 ? formatFileSize(compressedSize) : '--'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!downloadUrl ? (
              <button
                onClick={handleCompress}
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
                    Compressing...
                  </>
                ) : (
                  <>
                    <FileInput size={20} className="mr-2" />
                    {!file ? 'Select a PDF' : `Compress PDF (${compressionLevel})`}
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="bg-gray-700/50 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-center gap-2">
                  <CheckCircle2 className="text-cyan-400" size={20} />
                  <p className="text-cyan-400 font-medium">Compression successful! Reduced by {calculateReduction()}%</p>
                </div>
                <a
                  href={downloadUrl}
                  download={`compressed-${file.name}`}
                  className="w-full py-4 rounded-xl font-medium text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg flex items-center justify-center transition-all border border-gray-600"
                >
                  <Download size={20} className="mr-2" />
                  Download Compressed PDF
                </a>
                <button
                  onClick={() => {
                    setFile(null);
                    setDownloadUrl('');
                    setOriginalSize(0);
                    setCompressedSize(0);
                  }}
                  className="w-full py-3 rounded-lg font-medium text-cyan-400 hover:text-cyan-300 flex items-center justify-center transition-all border border-gray-600 hover:border-cyan-400/30"
                >
                  Compress Another File
                </button>
              </>
            )}
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <FileInput className="w-6 h-6 text-cyan-400" />, title: 'Compress', desc: 'Reduce file size significantly' },
              { icon: <Gauge className="w-6 h-6 text-purple-400" />, title: 'Adjustable', desc: 'Control compression level' },
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