import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeftFromLine } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header />
      <div
  className="w-full h-svh bg-cover bg-no-repeat bg-center flex items-center justify-center relative"
  style={{
    backgroundImage: "url('/assets/images/404.jpg')",
    backgroundPosition: 'center 65%',
  }}
>
  <div className="text-center text-white px-6 py-8 translate-y-10">
    <h1 className="text-8xl font-bold text-white">404</h1>
    <p className="text-2xl mt-4 font-bold">The page was not found. Sorry!</p>
    <div className="mt-6 flex justify-center">
      <Link
        to="/"
        className="w-72 px-6 py-3 bg-root-primary-500 text-white font-semibold rounded shadow flex items-center justify-center gap-3"
      >
        <ArrowLeftFromLine />
        Return To Home Page
      </Link>
    </div>
  </div>
</div>

      <Footer />
    </>
  );
}
