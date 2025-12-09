import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-6 bg-white">
      {/* <div className="relative w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-adminLayout-grey-400" />
        <Input
          className="pl-10 pr-4 py-2 border border-adminLayout-grey-300 rounded-md w-full bg-adminLayout-grey-50"
          placeholder="Search for rooms and offers"
        />
      </div> */}

      {/* <div className="w-9 h-9 bg-adminLayout-grey-300 rounded-full overflow-hidden">
        <img src="./public/assets/images/avatar-admin.png" alt="avatar" />
      </div> */}
    </header>
  );
}
