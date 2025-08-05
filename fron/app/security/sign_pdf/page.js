'use client';
import { useState, useRef, useEffect } from 'react';
import { UploadCloud, Loader2, Download, FileText, X, CheckCircle2, PenTool, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

export default function SignPDF() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [signatureMode, setSignatureMode] = useState('draw');
  const [signatureData, setSignatureData] = useState(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 150 });
  const [showPreview, setShowPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const previewRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    if (signatureMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
    }
  }, [signatureMode]);

  // Generate PDF preview when file is selected
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Track preview container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (previewRef.current) {
        setPreviewDimensions({
          width: previewRef.current.offsetWidth,
          height: previewRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [showPreview]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    validateAndSetFile(selected);
  };

  const handleSignatureImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignatureData(event.target.result);
      };
      reader.readAsDataURL(file);
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
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (file) => {
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      setFile(file);
      setDownloadUrl('');
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  // Drawing functions
  const startDrawing = (e) => {
    if (signatureMode !== 'draw') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
  };

  const draw = (e) => {
    if (!isDrawing || signatureMode !== 'draw') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
  };

  const handleTouchStart = (e) => {
    if (signatureMode !== 'draw') return;
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDrawing(mouseEvent);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing || signatureMode !== 'draw') return;
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    draw(mouseEvent);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const saveSignature = () => {
    if (signatureMode === 'draw') {
      setSignatureData(canvasRef.current.toDataURL());
    }
  };

  const handleSign = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }

    if (!signatureData) {
      alert('Please create or upload a signature first');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signatureData);
    formData.append('x', position.x.toString());
    formData.append('y', position.y.toString());

    try {
      const response = await fetch('http://your-django-backend/api/sign-pdf/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Signing failed');
      }

      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Signing failed:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate scaled position for preview
  const getScaledPosition = () => {
    if (!previewDimensions.width) return { x: 0, y: 0 };
    
    // Assuming PDF standard size of 595x842 points (A4 at 72dpi)
    const scaleX = previewDimensions.width / 595;
    const scaleY = previewDimensions.height / 842;
    
    return {
      x: position.x * scaleX,
      y: position.y * scaleY,
      width: 150 * scaleX,
      height: 60 * scaleY
    };
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            Sign PDF
          </h1>
          <p className="text-gray-400">Add your digital signature to PDF documents</p>
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
              <FileText size={48} className={`mb-4 ${isDragging ? 'text-cyan-400' : 'text-gray-500'}`} />
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded-md text-gray-200"
                >
                  {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPreview ? 'Hide' : 'Preview'}
                </button>
                <button 
                  onClick={() => {
                    setFile(null);
                    setDownloadUrl('');
                    setShowPreview(false);
                  }}
                  className="p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* PDF Preview with Signature Position */}
          {showPreview && file && (
            <div className="mb-6 relative border border-gray-600 rounded-lg overflow-hidden bg-gray-900">
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {signatureData && (
                  <div
                    className="absolute border-2 border-dashed border-cyan-400 bg-cyan-400/10 flex items-center justify-center"
                    style={{
                      left: `${getScaledPosition().x}px`,
                      top: `${getScaledPosition().y}px`,
                      width: `${getScaledPosition().width}px`,
                      height: `${getScaledPosition().height}px`,
                    }}
                  >
                    <span className="text-xs text-cyan-400 font-medium bg-gray-900/80 px-2 py-1 rounded">
                      SIGN HERE
                    </span>
                  </div>
                )}
              </div>
              <div ref={previewRef} className="w-full h-[500px] flex items-center justify-center">
                <iframe
                  src={pdfPreviewUrl}
                  className="w-full h-full"
                  style={{ pointerEvents: 'none' }}
                  title="PDF Preview"
                />
                {!signatureData && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70">
                    <p className="text-gray-400">Create or upload a signature to see position preview</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Signature Section */}
          {file && (
            <div className="mb-8 bg-gray-700/30 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Create Your Signature</h3>
              
              {/* Signature Mode Toggle */}
              <div className="flex mb-6">
                <button
                  onClick={() => setSignatureMode('draw')}
                  className={`flex-1 py-2 rounded-l-lg border-t border-b border-l ${
                    signatureMode === 'draw' 
                      ? 'bg-cyan-600/30 border-cyan-400 text-cyan-400' 
                      : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <PenTool className="inline mr-2" size={18} />
                  Draw Signature
                </button>
                <button
                  onClick={() => setSignatureMode('upload')}
                  className={`flex-1 py-2 rounded-r-lg border-t border-b border-r ${
                    signatureMode === 'upload' 
                      ? 'bg-cyan-600/30 border-cyan-400 text-cyan-400' 
                      : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <ImageIcon className="inline mr-2" size={18} />
                  Upload Signature
                </button>
              </div>

              {/* Draw Signature */}
              {signatureMode === 'draw' && (
                <div className="mb-6">
                  <div className="bg-white rounded-lg border border-gray-400 overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={canvasSize.width}
                      height={canvasSize.height}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={stopDrawing}
                      className="w-full cursor-crosshair touch-none"
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={clearSignature}
                      className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500"
                    >
                      Clear
                    </button>
                    <button
                      onClick={saveSignature}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500"
                    >
                      Save Signature
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Signature */}
              {signatureMode === 'upload' && (
                <div className="mb-6">
                  <div 
                    className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => signatureInputRef.current.click()}
                  >
                    {signatureData ? (
                      <div className="flex items-center justify-center">
                        <img 
                          src={signatureData} 
                          alt="Signature" 
                          className="max-h-32 max-w-full"
                        />
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto text-gray-500 mb-2" size={24} />
                        <p className="text-gray-400">Click to upload signature image</p>
                        <p className="text-sm text-gray-500 mt-1">Supports: PNG, JPG (Transparent background recommended)</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={signatureInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureImageChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Position Controls */}
              <div className="mt-6">
                <h4 className="text-gray-300 mb-3">Signature Position</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 mb-2">X Position: {position.x}px</label>
                    <input
                      type="range"
                      min="0"
                      max="595"  // Standard PDF width (A4 at 72dpi)
                      value={position.x}
                      onChange={(e) => setPosition({...position, x: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Y Position: {position.y}px</label>
                    <input
                      type="range"
                      min="0"
                      max="842"  // Standard PDF height (A4 at 72dpi)
                      value={position.y}
                      onChange={(e) => setPosition({...position, y: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Mini position preview */}
                <div className="relative h-32 bg-gray-800 rounded border border-gray-600 overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div key={i} className="border border-gray-700/50"></div>
                    ))}
                  </div>
                  {signatureData && (
                    <div
                      className="absolute bg-cyan-400/20 border border-cyan-400/50 transition-all duration-100"
                      style={{
                        left: `${(position.x / 595) * 100}%`,
                        top: `${(position.y / 842) * 100}%`,
                        width: '25%',
                        height: '15%',
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PenTool size={14} className="text-cyan-400" />
                      </div>
                    </div>
                  )}
                  {!signatureData && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                      Signature position will appear here
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!downloadUrl ? (
              <button
                onClick={handleSign}
                disabled={!file || !signatureData || isLoading}
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all ${
                  !file || !signatureData || isLoading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-700 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Signing PDF...
                  </>
                ) : (
                  <>
                    <PenTool size={20} className="mr-2" />
                    {file ? 'Sign PDF' : 'Upload PDF First'}
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="bg-gray-700/50 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-center gap-2">
                  <CheckCircle2 className="text-cyan-400" size={20} />
                  <p className="text-cyan-400 font-medium">PDF Signed Successfully!</p>
                </div>
                <a
                  href={downloadUrl}
                  download={`signed_${file.name}`}
                  className="w-full py-4 rounded-xl font-medium text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg flex items-center justify-center transition-all border border-gray-600"
                >
                  <Download size={20} className="mr-2" />
                  Download Signed PDF
                </a>
                <button
                  onClick={() => {
                    setFile(null);
                    setDownloadUrl('');
                    setSignatureData(null);
                    setShowPreview(false);
                  }}
                  className="w-full py-3 rounded-lg font-medium text-cyan-400 hover:text-cyan-300 flex items-center justify-center transition-all border border-gray-600 hover:border-cyan-400/30"
                >
                  Sign Another PDF
                </button>
              </>
            )}
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <PenTool className="w-6 h-6 text-cyan-400" />, title: 'Draw Signature', desc: 'Create signature with mouse/touch' },
              { icon: <ImageIcon className="w-6 h-6 text-purple-400" />, title: 'Upload Signature', desc: 'Use your existing signature' },
              { icon: <FileText className="w-6 h-6 text-amber-400" />, title: 'Precise Placement', desc: 'Position anywhere on document' },
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