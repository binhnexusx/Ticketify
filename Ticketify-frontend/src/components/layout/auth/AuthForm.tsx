import Header from '@/components/layout/Header';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className='bg-root-gray-100'>
      <div className="pt-4 pb-2 border-b-2 border-gray-300 pl-36">
        <a href="/"><img src="./public/assets/images/logo.png" alt="Logo" /></a>
      </div>
      <div className="py-24 px-44">
        <div className="flex gap-10 p-8 border lg:p-16 md:p-12 bg-root-gray-200 rounded-2xl border-root-gray-400">
          <div className="flex items-center justify-center pl-12 lg:w-1/2">
            <img
              src="./public/assets/images/login-img.png"
              alt="Auth illustration"
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/2">{children}</div>
        </div>
      </div>
    </div>
  );
}
