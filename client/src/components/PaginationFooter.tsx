import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

interface footerProps {
  totalPages: number;
  currentPage: number;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (pageNo: number) => void;
}

export default function PaginationFooter({
  totalPages,
  nextPage,
  prevPage,
  currentPage,
  setPage,
}: footerProps) {
  const maxVisiblePages = 5; // Number of page buttons to show at once

  // Helper function to calculate the page numbers to display
  const getVisiblePages = () => {
    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      {/* Previous Button */}
      <div className="-mt-px flex w-0 flex-1">
        <button
          disabled={currentPage === 1}
          onClick={() => prevPage()}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          <ArrowLongLeftIcon
            aria-hidden="true"
            className="mr-3 h-5 w-5 text-gray-400"
          />
          Previous
        </button>
      </div>

      {/* Page Numbers */}
      <div className="hidden md:-mt-px md:flex">
        {/* Show first page and ellipsis if needed */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => setPage(1)}
              aria-current={currentPage === 1 ? "page" : undefined}
              className={`inline-flex items-center border-t-2 ${currentPage === 1 ? "border-custom-blue-3" : "border-transparent"} px-4 pt-4 text-sm font-medium ${currentPage === 1 ? "text-custom-blue-3" : "text-gray-500"} hover:border-gray-300 hover:text-gray-700`}
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                ...
              </span>
            )}
          </>
        )}

        {/* Visible pages */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`inline-flex items-center border-t-2 ${currentPage === page ? "border-custom-blue-3" : "border-transparent"} px-4 pt-4 text-sm font-medium ${currentPage === page ? "text-custom-blue-3" : "text-gray-500"} hover:border-gray-300 hover:text-gray-700`}
          >
            {page}
          </button>
        ))}

        {/* Show last page and ellipsis if needed */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                ...
              </span>
            )}
            <button
              onClick={() => setPage(totalPages)}
              aria-current={currentPage === totalPages ? "page" : undefined}
              className={`inline-flex items-center border-t-2 ${currentPage === totalPages ? "border-custom-blue-3" : "border-transparent"} px-4 pt-4 text-sm font-medium ${currentPage === totalPages ? "text-custom-blue-3" : "text-gray-500"} hover:border-gray-300 hover:text-gray-700`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          disabled={currentPage === totalPages}
          onClick={() => nextPage()}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          Next
          <ArrowLongRightIcon
            aria-hidden="true"
            className="ml-3 h-5 w-5 text-gray-400"
          />
        </button>
      </div>
    </nav>
  );
}
