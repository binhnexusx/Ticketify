import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Deal } from "@/types/deal";
import DealTable from "@/components/common/DealTable";
import AddDealDialog from "@/components/common/AddDealDialog";
import EditDealDialog from "@/components/common/EditDealDialog";
import { Button } from "@/components/ui/button";
import {
  getDealList,
  createDeal,
  updateDeal,
  deleteDeal,
  getDealsFiltered,
} from "@/services/deal";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "@/hooks/use-toast";

export default function RatePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [dealToDelete, setDealToDelete] = useState<number | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const statusFromURL = searchParams.get("status");
  const pageFromURL = parseInt(searchParams.get("page") || "1", 10);
  const limitFromURL = parseInt(searchParams.get("limit") || "10", 10);
  const startDateFromURL = searchParams.get("startDate");
  const endDateFromURL = searchParams.get("endDate");

  const [statusFilter, setStatusFilter] = useState<string | null>(statusFromURL);

  const formatLocalYMD = (date: Date | null | undefined): string | undefined => {
    if (!date) return undefined;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const parseYMDToLocalDate = (ymd: string | null): Date | null => {
    if (!ymd) return null;
    const [y, m, d] = ymd.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const [startDate, setStartDate] = useState<Date | null>(
    parseYMDToLocalDate(startDateFromURL)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    parseYMDToLocalDate(endDateFromURL)
  );

  const [page, setPage] = useState(pageFromURL);
  const limit = limitFromURL;
  const [totalPages, setTotalPages] = useState(1);

  const STATUSES = ["Ongoing", "New", "Finished"];

  const formatDateForAPI = (date: Date | null) => formatLocalYMD(date);

  const fetchData = async (pageNum = 1) => {
    setLoading(true);
    try {
      let res;
      if (statusFilter || startDate || endDate) {
        res = await getDealsFiltered(
          statusFilter || undefined,
          formatDateForAPI(startDate),
          formatDateForAPI(endDate),
          pageNum,
          limit
        );
      } else {
        res = await getDealList(pageNum, limit);
      }

      setDeals(res.items || []);
      setTotalPages(res.totalPages || 1);
      setPage(res.page || 1);
    } catch (err) {
      console.error("❌ Lỗi fetch deals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (statusFilter) params.status = statusFilter;

    const startStr = formatDateForAPI(startDate);
    const endStr = formatDateForAPI(endDate);
    if (startStr) params.startDate = startStr;
    if (endStr) params.endDate = endStr;

    setSearchParams(params);
    fetchData(page);

  }, [statusFilter, startDate, endDate, page]);

const handleAdd = async (data: Partial<Deal>) => {
    await createDeal(data);
    setPage(1);
    await fetchData(1);
    setShowAddForm(false);
    toast({
      title: "Success",
      description: "Deal has been added successfully.",
    });
};

const handleEdit = async (data: Partial<Deal>) => {
  if (!editingDeal) return;
    await updateDeal(editingDeal.deal_id, data);
    await fetchData(page);
    setShowEditForm(false);
    setEditingDeal(null);
    toast({
      title: "Success",
      description: "Deal has been updated successfully.",
    });
};

  const handleDelete = async (deal_id: number) => {
    try {
      await deleteDeal(deal_id);
      if (deals.length === 1 && page > 1) {
        const newPage = page - 1;
        setPage(newPage);
        await fetchData(newPage);
      } else {
        await fetchData(page);
      }
    } catch (err) {
      console.error("Error when deleting deal:", err);
    }
  };

  const toggleStatusFilter = (label: string) => {
    const newFilter = statusFilter === label ? null : label;
    setStatusFilter(newFilter);
    setPage(1);
  };

  const renderStatusButton = (label: string) => {
    const isActive = statusFilter === label;
    let activeClasses = "";
    if (label === "Ongoing") activeClasses = "bg-blue-100 text-blue-600 border-blue-300";
    else if (label === "Finished") activeClasses = "bg-red-100 text-red-500 border-red-300";
    else if (label === "New") activeClasses = "bg-green-100 text-green-600 border-green-300";

    return (
      <Button
        key={label}
        variant="outline"
        onClick={() => toggleStatusFilter(label)}
        className={`rounded-full px-6 py-2 ${isActive ? activeClasses : "text-gray-600 border-gray-300"}`}
      >
        {label}
      </Button>
    );
  };

  return (
      <div className="space-y-4 bg-adminLayout-grey-40 w-full h-full">
        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-x-24 gap-y-2 items-center p-[16px]">
          {/* Status buttons */}
          <div className="flex flex-wrap gap-2">{STATUSES.map(renderStatusButton)}</div>

          {/* Date range */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="flex items-center w-full">
              <label className="text-sm whitespace-nowrap">Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setPage(1);
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className="w-full border rounded px-3 py-2"
                isClearable
              />
            </div>

            <div className="flex items-center w-full">
              <label className="text-sm whitespace-nowrap">End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  setPage(1);
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className="w-full border rounded px-3 py-2"
                isClearable
              />
            </div>
          </div>

          {/* Add button */}
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white h-[42px] px-4"
          >
            Add deal
          </Button>
        </div>

        {loading ? (
          <p className="px-4">Loading...</p>
        ) : deals.length === 0 ? (
          <p className="px-4">No deals available.</p>
        ) : (
          <DealTable
            items={deals}
            onEdit={(deal) => {
              setEditingDeal(deal);
              setShowEditForm(true);
            }}
            onDelete={(id) => setDealToDelete(id)}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

      {/* Dialogs */}
      <AddDealDialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAdd}
      />

      <EditDealDialog
        open={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setEditingDeal(null);
        }}
        onSubmit={handleEdit}
        deal={editingDeal}
      />

      <ConfirmDeleteDialog
        open={dealToDelete !== null}
        onConfirm={async () => {
          if (dealToDelete !== null) {
            await handleDelete(dealToDelete);
            setDealToDelete(null);
          }
        }}
        onCancel={() => setDealToDelete(null)}
        title="Delete Deal"
        description="Are you sure you want to delete this deal? This action cannot be undone."
      />
    </div>
  );
}
