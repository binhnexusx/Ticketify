import { Deal } from "@/types/deal";
import { SquarePen, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import DealTablePagination from "./DealTablePagination";

interface DealTableProps {
  items: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete?: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DealTable({
  items,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: DealTableProps) {
  return (
    <div className="p-4 bg-white">
      <div className="overflow-hidden border rounded-xl border-adminLayout-grey-250">
        <table className="min-w-full text-sm text-left bg-white table-fixed">
          <thead className="border bg-adminLayout-grey-10 text-adminLayout-grey-20">
            <tr>
              <th className="p-3 font-medium">Reference number</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Start</th>
              <th className="p-3 font-medium">End</th>
              <th className="p-3 font-medium">Discount</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((deal) => (
              <tr key={deal.deal_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-semibold text-gray-800">
                  #{deal.deal_id}
                </td>
                <td className="p-3">{deal.deal_name}</td>
                <td className="p-3">
                  {dayjs(deal.start_date).format("DD/MM/YYYY")}
                </td>
                <td className="p-3">
                  {dayjs(deal.end_date).format("DD/MM/YYYY")}
                </td>
                <td className="p-3">
                  {Number.isInteger(deal.discount_rate * 100)
                    ? deal.discount_rate * 100
                    : (deal.discount_rate * 100).toFixed(2)
                  }% off
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-xl text-xs font-medium ${
                      deal.status === "Ongoing"
                        ? "bg-blue-100 text-blue-600"
                        : deal.status === "Finished"
                        ? "bg-red-100 text-red-500"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {deal.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => onEdit(deal)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <SquarePen size={16} />
                  </button>
                  <button
                    onClick={() => onDelete?.(deal.deal_id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DealTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
