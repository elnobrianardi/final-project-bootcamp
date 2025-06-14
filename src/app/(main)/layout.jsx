import Footer from '@/components/user/Footer';
import Navbar from '@/components/user/Navbar';

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer/>
    </div>
  );
}