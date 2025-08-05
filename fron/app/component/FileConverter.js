"use client";
import { useState } from "react";
import {
  UploadCloud,
  Loader2,
  Download,
  FileText,
  X,
  CheckCircle2,
  Zap,
  Lock,
  Sparkles,
} from "lucide-react";

export default function FileConverter({
  description = "Convert your files",
  accept = ".pdf",
  fileType = "PDF",
  outputType = "Word",
  icon = <FileText />,
  apiEndpoint = "/api/convert",
  features = [
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: "Fast",
      desc: "Quick conversions",
    },
    {
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      title: "Secure",
      desc: "Private processing",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      title: "Quality",
      desc: "Perfect output",
    },
  ],
}) {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    if (file) {
      setFile(file);
      setDownloadUrl("");
    } else {
      alert(`Please upload a valid ${fileType} file`);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Conversion failed");

      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 flex justify-center items-center">
      <div className="w-full h-fit my-4 max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            {fileType.toLocaleUpperCase()} TO {outputType.toLocaleUpperCase()}{" "}
            CONVERTER
          </h2>
          <p className="text-gray-400">{description}</p>
        </div>
        {/* Drag & Drop Area */}
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-xl p-4 mb-3 transition-all duration-200 cursor-pointer ${
              isDragging
                ? "border-cyan-400 bg-gray-800/50 backdrop-blur-sm"
                : "border-gray-600 hover:border-cyan-400/50 bg-gray-800/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input").click()}
          >
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <UploadCloud
                size={48}
                className={`mb-4 ${
                  isDragging ? "text-cyan-400" : "text-gray-500"
                }`}
              />
              <p
                className={`text-lg font-medium ${
                  isDragging ? "text-cyan-400" : "text-gray-400"
                }`}
              >
                {isDragging
                  ? `Drop your ${fileType} here`
                  : `Drag & drop your ${fileType} or click to browse`}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports: {accept} (Max 10MB)
              </p>
            </div>
            <input
              id="file-input"
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-700 rounded-lg">{icon}</div>
              <div className="w-fit max-w-[200px]">
                <p className="font-medium text-gray-200 truncate text-ellipsis overflow-x-hidden whitespace-nowrap">
                  {file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="p-1 text-gray-400 hover:text-gray-200 rounded-full hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {/* File Preview */}( ){/* Action Buttons */}
        <div className="space-y-4">
          {!downloadUrl ? (
            <button
              onClick={handleConvert}
              disabled={!file || isLoading}
              className={`w-full py-4 rounded-xl font-medium text-white flex items-center justify-center transition-all ${
                !file || isLoading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/30"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Converting...
                </>
              ) : (
                <>
                  {icon}
                  <span className="ml-2">Convert to {outputType}</span>
                </>
              )}
            </button>
          ) : (
            <>
              <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-center gap-2">
                <CheckCircle2 className="text-cyan-400" size={20} />
                <p className="text-cyan-400 font-medium">
                  Conversion successful!
                </p>
              </div>
              <a
                href={downloadUrl}
                download={`${file.name.replace(
                  new RegExp(`.${fileType.toLowerCase()}$`),
                  ""
                )}.${outputType.toLowerCase()}`}
                className="w-full py-4 rounded-xl font-medium text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 shadow-lg flex items-center justify-center transition-all border border-gray-700"
              >
                <Download size={18} className="mr-2" />
                Download {outputType} File
              </a>
              <button
                onClick={() => {
                  setFile(null);
                  setDownloadUrl("");
                }}
                className="w-full py-3 rounded-lg font-medium text-cyan-400 hover:text-cyan-300 flex items-center justify-center transition-all border border-gray-700 hover:border-cyan-400/30"
              >
                Convert Another File
              </button>
            </>
          )}
        </div>
        {/* Features */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 text-center hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex justify-center mb-3">{feature.icon}</div>
              <h4 className="font-medium text-gray-200 mb-1">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
