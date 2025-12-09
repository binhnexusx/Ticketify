import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmailRequestModal } from '@/components/layout/profile/EmailRequestModal';
import { PasswordSettingModal } from '@/components/layout/profile/PasswordSettingModal';
import { ChevronRight } from 'lucide-react';

const AccountSecuritySettings: React.FC = () => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const settingsOptions = [
    {
      label: 'Email',
      onClick: () => setIsEmailModalOpen(true),
    },
    {
      label: 'Change Password',
      onClick: () => setIsPasswordModalOpen(true),
    },
  ];

  return (
    <Card className="w-full h-full mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold">Settings</h2>
        <h4>Sign in and security</h4>
        <p className="text-xs line-clamp-1">
          Keep your account safe with a secure password and by signing out of devices you're not
          actively using.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col space-y-3 max-w-xs">
          {settingsOptions.map(({ label, onClick }) => (
            <Button
              key={label}
              variant="outline"
              className="justify-between w-full px-4 py-6 border border-root-grey-300 text-root-grey-500"
              onClick={onClick}
            >
              <span className="flex items-start justify-between gap-20 w-full text-left font-normal text-black font-base">
                {label}
                <ChevronRight />
              </span>
            </Button>
          ))}
        </div>
      </CardContent>

      <EmailRequestModal open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen} />
      <PasswordSettingModal open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} />
    </Card>
  );
};

export default AccountSecuritySettings;
