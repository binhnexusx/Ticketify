import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-6 text-sm">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        className="text-adminLayout-grey-500 border-adminLayout-grey-400"
      >
        Previous
      </Button>

      <div className="space-x-2">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className={
                currentPage === page
                  ? "bg-adminLayout-primary-50 text-adminLayout-primary-600"
                  : "text-adminLayout-grey-400 border-none"
              }
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        className="text-adminLayout-grey-500 border-adminLayout-grey-400"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
