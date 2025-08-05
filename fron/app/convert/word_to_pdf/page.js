import FileConverter from '../../component/FileConverter';
import { FileText, FileInput } from 'lucide-react';

export default function WordToPDF() {
  return (
    <FileConverter 
      title="Word to PDF"
      description="Convert Word documents to professional PDF files"
      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      fileType="Word"
      outputType="PDF"
      icon={<FileInput className="w-5 h-5 text-blue-400" />}
      apiEndpoint="/api/convert/word_to_pdf"
    //   features={[
    //     { 
    //       icon: <FileText className="w-6 h-6 text-blue-400" />, 
    //       title: 'Format Preserved', 
    //       desc: 'Maintains all formatting' 
    //     },
    //     { 
    //       icon: <Lock className="w-6 h-6 text-purple-400" />, 
    //       title: 'Secure', 
    //       desc: 'Files deleted after conversion' 
    //     },
    //     { 
    //       icon: <Sparkles className="w-6 h-6 text-amber-400" />, 
    //       title: 'High Quality', 
    //       desc: 'Print-ready PDF output' 
    //     },
    //   ]}
    />
  );
}