'use client';
import { useState } from 'react';
import { UploadCloud, Loader2, Download, FileText, X, CheckCircle2, Merge, ListOrdered, Shield } from 'lucide-react';

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [order, setOrder] = useState([]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    addFiles(newFiles);
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
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (validFiles.length !== newFiles.length) {
      alert('Only PDF files are accepted');
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles].slice(0, 10); // Limit to 10 files
      setFiles(updatedFiles);
      setOrder(updatedFiles.map((_, index) => index)); // Initialize order
      setDownloadUrl('');
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setOrder(order.filter(pos => pos !== index).map(pos => pos > index ? pos - 1 : pos));
  };

  const moveFile = (fromIndex, toIndex) => {
    const newOrder = [...order];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    setOrder(newOrder);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    
    // Add files in the selected order
    order.forEach((fileIndex) => {
      formData.append('files', files[fileIndex]);
    });

    try {
      const response = await fetch('http://your-django-backend/api/merge-pdf/', {
        method: 'POST',
        body: formData,
        // Django CSRF token would be handled via cookies in a real app
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Merge failed:', error);
      alert(`Merge failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            Merge PDF Files
          </h1>
          <p className="text-gray-400">Combine multiple PDFs into one document</p>
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
              <Merge size={48} className={`mb-4 ${isDragging ? 'text-cyan-400' : 'text-gray-500'}`} />
              <p className={`text-lg font-medium ${isDragging ? 'text-cyan-400' : 'text-gray-400'}`}>
                {isDragging ? 'Drop your PDFs here' : 'Drag & drop PDFs or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mt-2">Supports: .pdf (Max 10 files)</p>
            </div>
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="mb-8 space-y-3 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Files to merge ({files.length} selected)
              </h3>
              {order.map((fileIndex, position) => (
                <div 
                  key={fileIndex}
                  className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4 border border-gray-600 group"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', position)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromPosition = parseInt(e.dataTransfer.getData('text/plain'));
                    moveFile(fromPosition, position);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-600 rounded-lg">
                      <FileText size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">{files[fileIndex].name}</p>
                      <p className="text-xs text-gray-400">
                        {(files[fileIndex].size / 1024 / 1024).toFixed(2)} MB • Page {position + 1}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(fileIndex)}
                    className="p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!downloadUrl ? (
              <button
                onClick={handleMerge}
                disabled={files.length < 2 || isLoading}
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all ${
                  files.length < 2 || isLoading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-700 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Merging...
                  </>
                ) : (
                  <>
                    <Merge size={20} className="mr-2" />
                    {files.length < 2 ? 'Select 2+ PDFs' : `Merge ${files.length} PDFs`}
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="bg-gray-700/50 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-center gap-2">
                  <CheckCircle2 className="text-cyan-400" size={20} />
                  <p className="text-cyan-400 font-medium">Merge successful!</p>
                </div>
                <a
                  href={downloadUrl}
                  download="merged-document.pdf"
                  className="w-full py-4 rounded-xl font-medium text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg flex items-center justify-center transition-all border border-gray-600"
                >
                  <Download size={20} className="mr-2" />
                  Download Merged PDF
                </a>
                <button
                  onClick={() => {
                    setFiles([]);
                    setDownloadUrl('');
                    setOrder([]);
                  }}
                  className="w-full py-3 rounded-lg font-medium text-cyan-400 hover:text-cyan-300 flex items-center justify-center transition-all border border-gray-600 hover:border-cyan-400/30"
                >
                  Merge More Files
                </button>
              </>
            )}
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Merge className="w-6 h-6 text-cyan-400" />, title: 'Combine', desc: 'Merge unlimited pages' },
              { icon: <ListOrdered className="w-6 h-6 text-purple-400" />, title: 'Reorder', desc: 'Drag to arrange files' },
              { icon: <Shield className="w-6 h-6 text-amber-400" />, title: 'Secure', desc: 'Private processing' },
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