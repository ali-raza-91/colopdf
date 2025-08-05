'use client';
import { useState, useRef } from 'react';
import { UploadCloud, Loader2, Download, FileText, X, CheckCircle2, ImageIcon, Type, FileImage } from 'lucide-react';

export default function WatermarkPDF() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [watermarkType, setWatermarkType] = useState('text'); // 'text' or 'image'
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.5);
  const [color, setColor] = useState('#000000');
  const [imageFile, setImageFile] = useState(null);
  const [position, setPosition] = useState('center'); // 'center', 'top-left', etc.
  const [pages, setPages] = useState('all'); // 'all', 'first', 'last'
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [rotation, setRotation] = useState(45);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    validateAndSetFile(selected);
  };

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith('image/')) {
      setImageFile(selected);
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

  const handleWatermark = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }

    if (watermarkType === 'text' && !text.trim()) {
      alert('Please enter watermark text');
      return;
    }

    if (watermarkType === 'image' && !imageFile) {
      alert('Please select a watermark image');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', watermarkType);
    formData.append('pages', pages);
    formData.append('position', position);
    formData.append('x_offset', xOffset.toString());
    formData.append('y_offset', yOffset.toString());
    formData.append('rotation', rotation.toString());
    formData.append('opacity', opacity.toString());

    if (watermarkType === 'text') {
      formData.append('text', text);
      formData.append('font_size', fontSize.toString());
      formData.append('color', color);
    } else {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://your-django-backend/api/watermark-pdf/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Watermarking failed');
      }

      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Watermark failed:', error);
      alert(error.message);
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
            Watermark PDF
          </h1>
          <p className="text-gray-400">Add text or image watermarks to your PDF</p>
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
              <button 
                onClick={() => {
                  setFile(null);
                  setDownloadUrl('');
                }}
                className="p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Watermark Options */}
          {file && (
            <div className="mb-8 bg-gray-700/30 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Watermark Settings</h3>
              
              {/* Watermark Type Toggle */}
              <div className="flex mb-6">
                <button
                  onClick={() => setWatermarkType('text')}
                  className={`flex-1 py-2 rounded-l-lg border-t border-b border-l ${
                    watermarkType === 'text' 
                      ? 'bg-cyan-600/30 border-cyan-400 text-cyan-400' 
                      : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Type className="inline mr-2" size={18} />
                  Text Watermark
                </button>
                <button
                  onClick={() => setWatermarkType('image')}
                  className={`flex-1 py-2 rounded-r-lg border-t border-b border-r ${
                    watermarkType === 'image' 
                      ? 'bg-cyan-600/30 border-cyan-400 text-cyan-400' 
                      : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <ImageIcon className="inline mr-2" size={18} />
                  Image Watermark
                </button>
              </div>

              {/* Text Watermark Options */}
              {watermarkType === 'text' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-400 mb-2">Watermark Text</label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200"
                      placeholder="Enter watermark text"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Font Size</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">{fontSize}px</span>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Opacity</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={opacity}
                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">{opacity * 100}%</span>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="h-10 w-10 cursor-pointer"
                        />
                        <span className="text-gray-400">{color}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Watermark Options */}
              {watermarkType === 'image' && (
                <div className="mb-6">
                  <div 
                    className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => imageInputRef.current.click()}
                  >
                    {imageFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileImage className="text-cyan-400" size={24} />
                        <span className="text-gray-300">{imageFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto text-gray-500 mb-2" size={24} />
                        <p className="text-gray-400">Click to select watermark image</p>
                        <p className="text-sm text-gray-500 mt-1">Supports: PNG, JPG (Max 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Position Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Pages to Watermark</label>
                  <select
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200"
                  >
                    <option value="all">All Pages</option>
                    <option value="first">First Page Only</option>
                    <option value="last">Last Page Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200"
                  >
                    <option value="center">Center</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="custom">Custom Position</option>
                  </select>
                </div>
              </div>

              {/* Custom Position Options */}
              {position === 'custom' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2">X Offset (px)</label>
                    <input
                      type="number"
                      value={xOffset}
                      onChange={(e) => setXOffset(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Y Offset (px)</label>
                    <input
                      type="number"
                      value={yOffset}
                      onChange={(e) => setYOffset(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Rotation (deg)</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-400">{rotation}°</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!downloadUrl ? (
              <button
                onClick={handleWatermark}
                disabled={!file || isLoading || (watermarkType === 'image' && !imageFile)}
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all ${
                  !file || isLoading || (watermarkType === 'image' && !imageFile)
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-700 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Applying Watermark...
                  </>
                ) : (
                  <>
                    <ImageIcon size={20} className="mr-2" />
                    {file ? 'Apply Watermark' : 'Upload PDF First'}
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="bg-gray-700/50 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-center gap-2">
                  <CheckCircle2 className="text-cyan-400" size={20} />
                  <p className="text-cyan-400 font-medium">Watermark Applied Successfully!</p>
                </div>
                <a
                  href={downloadUrl}
                  download={`watermarked_${file.name}`}
                  className="w-full py-4 rounded-xl font-medium text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg flex items-center justify-center transition-all border border-gray-600"
                >
                  <Download size={20} className="mr-2" />
                  Download Watermarked PDF
                </a>
                <button
                  onClick={() => {
                    setFile(null);
                    setDownloadUrl('');
                    setImageFile(null);
                    setText('CONFIDENTIAL');
                  }}
                  className="w-full py-3 rounded-lg font-medium text-cyan-400 hover:text-cyan-300 flex items-center justify-center transition-all border border-gray-600 hover:border-cyan-400/30"
                >
                  Watermark Another PDF
                </button>
              </>
            )}
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Type className="w-6 h-6 text-cyan-400" />, title: 'Text Watermarks', desc: 'Customizable text with fonts' },
              { icon: <ImageIcon className="w-6 h-6 text-purple-400" />, title: 'Image Watermarks', desc: 'PNG, JPG with transparency' },
              { icon: <FileText className="w-6 h-6 text-amber-400" />, title: 'Precise Control', desc: 'Position on any page' },
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