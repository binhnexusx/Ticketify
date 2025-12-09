import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CircleCheckBig } from 'lucide-react';

export default function Success() {
  return (
    <div className="flex-1 flex flex-col justify-center px-10 text-center">
      <div className="flex justify-center mb-4">
        <CircleCheckBig size={48} className="text-green-500" />
      </div>
      <h1 className="text-xl font-bold">Verification successful</h1>
      <p className="text-sm mb-4">
        Your password has been updated successfully. You will be redirected to login page in a
        moment.
      </p>
      <Button asChild>
        <Link to="/login">Go to Login</Link>
      </Button>
    </div>
  );
}
