interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DealTablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    const isActive = currentPage === page;

    return (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-adminLayout-grey-10 text-blue-600"
            : "text-gray-400 hover:bg-blue-100"
        }`}
      >
        {page}
      </button>
    );
  });

  return (
    <div className="flex justify-between items-center px-4 py-4 bottom-0">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm rounded border disabled:opacity-50 "
      >
        &lt; Previous
      </button>

      <div className="flex gap-2">{pages}</div>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm rounded border disabled:opacity-50"
      >
        Next &gt;
      </button>
    </div>
  );
}
