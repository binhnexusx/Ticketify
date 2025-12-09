import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdminPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-between items-center mt-6 text-sm">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        className="text-adminLayout-grey-400 border-adminLayout-grey-200 min-w-[90px] flex items-center gap-2"
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      {totalPages > 1 && (
        <div className="space-x-2">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                className={
                  currentPage === page
                    ? 'bg-adminLayout-primary-50 text-adminLayout-primary-600 border-adminLayout-primary-500 font-semibold rounded-md w-9 h-9 p-0 '
                    : 'text-adminLayout-grey-400 border-none rounded-md w-9 h-9 p-0'
                }
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
        </div>
      )}
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        className="text-adminLayout-grey-400 border-adminLayout-grey-200 min-w-[90px] flex items-center gap-1"
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default AdminPagination;
