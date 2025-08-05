'use client';
import { useState } from 'react';
import { UploadCloud, Loader2, Download, FileText, X, CheckCircle2, Lock, Eye, EyeOff, Shield } from 'lucide-react';

export default function ProtectPDF() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

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
      setDownloadUrl('');
      setPasswordError('');
    } else {
      alert('Only PDF files are accepted');
    }
  };

  const removeFile = () => {
    setFile(null);
    setDownloadUrl('');
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleProtect = async () => {
    if (!file) {
      alert('Please select a PDF file to protect');
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
      const response = await fetch('http://your-django-backend/api/protect-pdf/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Protection failed:', error);
      alert(`Protection failed: ${error.message}`);
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
            Password Protect PDF
          </h1>
          <p className="text-gray-400">Secure your PDF with a password</p>
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
              <Lock size={48} className={`mb-4 ${isDragging ? 'text-cyan-400' : 'text-gray-500'}`} />
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

              {/* Password Protection */}
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 mb-6">
                <h3 className="font-medium text-gray-300 mb-4">Set Password</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
                        onBlur={() => validatePasswords()}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-gray-400 hover:text-cyan-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
                        onBlur={() => validatePasswords()}
                      />
                      <button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2 text-gray-400 hover:text-cyan-400"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-red-400 mt-1">{passwordError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!downloadUrl ? (
              <button
                onClick={handleProtect}
                disabled={!file || isLoading || !password || !confirmPassword || passwordError}
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all ${
                  !file || isLoading || !password || !confirmPassword || passwordError
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-700 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Protecting...
                  </>
                ) : (
                  <>
                    <Lock size={20} className="mr-2" />
                    {!file ? 'Select a PDF' : `Protect PDF`}
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="bg-gray-700/50 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-center gap-2">
                  <CheckCircle2 className="text-cyan-400" size={20} />
                  <p className="text-cyan-400 font-medium">PDF protected successfully!</p>
                </div>
                <a
                  href={downloadUrl}
                  download={`protected-${file.name}`}
                  className="w-full py-4 rounded-xl font-medium text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg flex items-center justify-center transition-all border border-gray-600"
                >
                  <Download size={20} className="mr-2" />
                  Download Protected PDF
                </a>
                <button
                  onClick={() => {
                    setFile(null);
                    setDownloadUrl('');
                    setPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  className="w-full py-3 rounded-lg font-medium text-cyan-400 hover:text-cyan-300 flex items-center justify-center transition-all border border-gray-600 hover:border-cyan-400/30"
                >
                  Protect Another File
                </button>
              </>
            )}
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Lock className="w-6 h-6 text-cyan-400" />, title: 'Encrypt', desc: 'Password protect your PDF' },
              { icon: <Shield className="w-6 h-6 text-purple-400" />, title: 'Secure', desc: '128-bit AES encryption' },
              { icon: <EyeOff className="w-6 h-6 text-amber-400" />, title: 'Private', desc: 'Files deleted after processing' },
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