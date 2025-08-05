import FileConverter from '../../component/FileConverter';
import { Image } from 'lucide-react';

export default function ImageToPDF() {
  return (
    <FileConverter 
      title="Image to PDF"
      description="Convert images to PDF documents"
      accept="image/*"
      fileType="Image"
      outputType="PDF"
      icon={<Image className="w-5 h-5 text-cyan-400" />}
      apiEndpoint="/api/convert/image_to_pdf"
    />
  );
}