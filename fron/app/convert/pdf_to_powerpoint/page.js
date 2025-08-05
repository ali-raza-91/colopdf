import FileConverter from '../../component/FileConverter';
import { Presentation } from 'lucide-react';

export default function PDFToPPT() {
  return (
    <FileConverter 
      title="PDF to PowerPoint"
      description="Convert PDF slides to editable PowerPoint presentations"
      accept=".pdf"
      fileType="PDF"
      outputType="PowerPoint"
      icon={<Presentation className="w-5 h-5 text-orange-400" />}
      apiEndpoint="/api/convert/pdf_to_ppt"
      // features={[
      //   { 
      //     icon: <Presentation className="w-6 h-6 text-orange-400" />, 
      //     title: 'Slides Preserved', 
      //     desc: 'Maintains slide layouts' 
      //   },
      //   { 
      //     icon: <Lock className="w-6 h-6 text-purple-400" />, 
      //     title: 'Secure', 
      //     desc: 'Private document processing' 
      //   },
      //   { 
      //     icon: <Sparkles className="w-6 h-6 text-amber-400" />, 
      //     title: 'Animations', 
      //     desc: 'Preserves slide transitions' 
      //   },
      // ]}
    />
  );
}