"use client";
import GenericSectionComponent from "./common";
import {
  FaFilePdf,
  FaObjectGroup,
  FaCut,
  FaCompressAlt,
  FaExchangeAlt,
  FaLock,
  FaUnlock,
  FaImage,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaSearch,
  FaWater,
  FaQrcode,
  FaFileDownload,
} from "react-icons/fa";

const PDFToolsSection = () => {
  const toolsData = {
    convert: [
      {
        icon: <FaFileWord className="text-cyan-400 text-2xl" />,
        title: "PDF to Word",
        description: "Convert PDF files into editable Word documents while preserving layout and formatting accurately.",
        usage: "Upload → Convert → Download",
        link: "/convert/pdf_to_word",
      },
      {
        icon: <FaFileExcel className="text-cyan-400 text-2xl" />,
        title: "PDF to Excel",
        description: "Convert PDF tables into editable Excel files with accurate formatting and structure.",
        usage: "Upload → Select tables → Download",
        link: "/convert/pdf_to_excel",
      },
      {
        icon: <FaFilePowerpoint className="text-cyan-400 text-2xl" />,
        title: "PDF to PPT",
        description: "Convert PDF slides into editable PowerPoint presentations with accurate layout and design retention.",
        usage: "Upload → Convert → Download",
        link: "/convert/pdf_to_powerpoint",
      },
      {
        icon: <FaImage className="text-cyan-400 text-2xl" />,
        title: "Image to pdf",
        description: 'Combine images into a single PDF file with high quality and custom page layout.',
        usage: "Upload → Select pages → Download",
        link: "/convert/image_to_pdf",
      },
      {
        icon: <FaExchangeAlt className="text-cyan-400 text-2xl" />,
        title: "Word to PDF",
        description: "Convert Word documents to PDF format while preserving fonts, layout, and formatting perfectly.",
        usage: "Upload → Convert → Download",
        link: "/convert/word_to_pdf",
      },
      {
        icon: <FaExchangeAlt className="text-cyan-400 text-2xl" />,
        title: "Excel to PDF",
        description: "Convert Excel sheets to PDF with accurate formatting, layout, and table structure retention.",
        usage: "Upload → Convert → Download",
        link: "/convert/excel_to_pdf",
      },
    ],
    editors: [
      {
        icon: <FaObjectGroup className="text-cyan-400 text-2xl" />,
        title: "Merge PDF",
        description: "Combine multiple PDF files into a single, organized document in just a few clicks.",
        usage: "Upload files → Arrange → Download",
        link: "/edit/merge_pdf",
      },
      {
        icon: <FaCut className="text-cyan-400 text-2xl" />,
        title: "Split PDF",
        description: "Split a PDF into separate pages or extract specific ranges quickly and easily.",
        usage: "Upload → Select pages → Download",
        link: "/edit/split_pdf",
      },
      {
        icon: <FaCompressAlt className="text-cyan-400 text-2xl" />,
        title: "Compress PDF",
        description: "Reduce PDF file size without losing quality for faster sharing and storage efficiency.",
        usage: "Upload → Compress → Download",
        link: "/edit/compress_pdf",
      },
    ],
    security: [
      {
        icon: <FaLock className="text-cyan-400 text-2xl" />,
        title: "Protect PDF",
        description: "Add password protection to your PDF files to secure sensitive content from unauthorized access.",
        usage: "Upload → Set password → Download",
        link: "/security/protect_pdf",
      },
      {
        icon: <FaUnlock className="text-cyan-400 text-2xl" />,
        title: "Unlock PDF",
        description: "Remove password restrictions from PDF files to enable easy access, editing, and sharing.",
        usage: "Upload → Enter password → Download",
        link: "/security/unlock_pdf",
      },
      {
        icon: <FaWater className="text-cyan-400 text-2xl" />,
        title: "Watermark",
        description: "Add custom text or image watermarks to your PDF files for branding or copyright protection.",
        usage: "Upload → Customize → Download",
        link: "/security/pdf_watermark",
      },
      {
        icon: <FaFileDownload className="text-cyan-400 text-2xl" />,
        title: "Sign PDF",
        description: "Add your digital signature to PDF documents securely and easily, without printing or scanning.",
        usage: "Upload → Sign → Download",
        link: "/security/sign_pdf",
      },
    ],
    ocr: [
      {
        icon: <FaSearch className="text-cyan-400 text-2xl" />,
        title: "OCR PDF",
        description: "Convert scanned PDFs into editable and searchable text using powerful OCR technology.",
        usage: "Upload → Process → Download",
        link: "/ocr/ocr_pdf",
      },
      {
        icon: <FaQrcode className="text-cyan-400 text-2xl" />,
        title: "PDF to Text",
        description: "Extract plain text from PDF files quickly while preserving content accuracy and readability.",
        usage: "Upload → Convert → Download",
        link: "/ocr/pdf_to_text",
      },
    ],
  };

  return (
    <GenericSectionComponent
      title="Complete PDF Toolkit"
      description="All the PDF tools you need in one place. Free, secure, and easy to use. Convert, compress, merge, split, protect, and edit PDFs effortlessly. No installation required — access anytime, anywhere. Designed for speed, simplicity, and privacy."
      tabs={Object.keys(toolsData)}
      toolsData={toolsData}
      primaryColor="blue"
      iconComponent={FaFilePdf}
    />
  );
};

export default PDFToolsSection;