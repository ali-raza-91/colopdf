
import Navbar from '../component/Navbar'
export default function RootLayout({ children }) {
  return (
   <>
        <Navbar />
        {children}
     </>
  );
}
