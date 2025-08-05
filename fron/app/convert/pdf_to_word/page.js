
import FileConverter from '../../component/FileConverter';
import { FileText } from 'lucide-react';

export default function PDFToWord() {
  return (
    <FileConverter 
      title="PDF to Word"
      description="Convert PDF documents to editable Word files"
      accept=".pdf"
      fileType="PDF"
      outputType="Word"
      icon={<FileText className="w-5 h-5 text-cyan-400" />}
      apiEndpoint="convert/pdf_to_word/"
    />
  );
}