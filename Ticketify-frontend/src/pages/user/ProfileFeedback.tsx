import { Button } from '@/components/ui/button';
import { HelpCircle, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import FeedbackForm from '@/components/layout/profile/FeedbackForm';

export default function HelpSection() {
    return (
        <div className="p-6 rounded-lg bg-white min-h-[505px]">
        <h1 className="text-black text-2xl font-bold mb-1">Help</h1>
        <p className="text-black text-sm font-normal mb-4">
            Have Questions Or Feedback For Us? We're listening.
        </p>

      <div className="flex flex-col max-w-xs space-y-3 ">
        <Button
          variant="outline"
          className="justify-between w-full px-4 py-6 text-left border-adminLayout-grey-300"
        >
          <div className="flex items-center content-between gap-20 space-x-2 font-normal text-black font-base">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Visit The Help Center</span>
            </div>
            <span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Button>
        <Button
          variant="outline"
          className="justify-between w-full px-4 py-6 text-left border-adminLayout-grey-300"
        >
          <div className="flex items-center content-between space-x-2 font-normal text-black gap-36 font-base">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Call Easyset</span>
            </div>
            <span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="justify-between w-full px-4 py-6 border-adminLayout-grey-300"
            >
              <div className="flex items-center content-between gap-20 space-x-2 font-normal text-black font-base">
                <div className="flex items-center space-x-2">
                  <span>Share your feedback</span>
                </div>
                <span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl p-0 bg-transparent border-none shadow-none">
            <div className="overflow-hidden bg-white shadow-lg rounded-xl w-[500px] h-[550px]">
              <FeedbackForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
