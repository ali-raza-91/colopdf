import FileConverter from '../../component/FileConverter';
import { FileSpreadsheet } from 'lucide-react';

export default function PDFToExcel() {
  return (
    <FileConverter 
      title="PDF to Excel"
      description="Convert PDF tables to editable Excel spreadsheets"
      accept=".pdf"
      fileType="PDF"
      outputType="Excel"
      icon={<FileSpreadsheet className="w-5 h-5 text-green-400" />}
      apiEndpoint="/api/convert/pdf_to_excel"
    //   features={[
    //     { 
    //       icon: <FileSpreadsheet className="w-6 h-6 text-green-400" />, 
    //       title: 'Tables Preserved', 
    //       desc: 'Maintains table structure' 
    //     },
    //     { 
    //       icon: <Lock className="w-6 h-6 text-purple-400" />, 
    //       title: 'Secure', 
    //       desc: 'Files auto-delete after processing' 
    //     },
    //     { 
    //       icon: <Sparkles className="w-6 h-6 text-amber-400" />, 
    //       title: 'Formulas', 
    //       desc: 'Detects and converts formulas' 
    //     },
    //   ]}
    />
  );
}