import FileConverter from '../../component/FileConverter';
import { FileSpreadsheet, FileInput } from 'lucide-react';

export default function ExcelToPDF() {
  return (
    <FileConverter 
      title="Excel to PDF"
      description="Convert Excel spreadsheets to professional PDF files"
      accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      fileType="Excel"
      outputType="PDF"
      icon={<FileSpreadsheet className="w-5 h-5 text-green-500" />}
      apiEndpoint="/api/convert/excel_to_pdf"
    //   features={[
    //     { 
    //       icon: <FileSpreadsheet className="w-6 h-6 text-green-500" />, 
    //       title: 'Sheets Preserved', 
    //       desc: 'Maintains all worksheets' 
    //     },
    //     { 
    //       icon: <Lock className="w-6 h-6 text-purple-400" />, 
    //       title: 'Secure', 
    //       desc: 'Files deleted after 1 hour' 
    //     },
    //     { 
    //       icon: <Sparkles className="w-6 h-6 text-amber-400" />, 
    //       title: 'Print Ready', 
    //       desc: 'Perfect page breaks' 
    //     },
    //   ]}
    />
  );
}