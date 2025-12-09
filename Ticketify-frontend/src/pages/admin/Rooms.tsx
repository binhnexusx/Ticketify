import React, { useState, useEffect, useRef } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import AddRoomForm, { FormValues } from '@/components/common/AddRoomForm';
import Pagination from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Room } from '@/types/room';
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog';
import {
  getAllRooms,
  createRoom,
  updateRoom,
  getAllDeals,
  assignDealToRoom,
  removeDealFromRoom,
} from '@/services/roomService';

const statusClasses: Record<Room['status'], string> = {
  available: 'bg-adminLayout-primary-50 text-adminLayout-primary-400',
  occupied: 'bg-adminLayout-success-50 text-adminLayout-success-400',
  maintenance: 'bg-adminLayout-warning-50 text-adminLayout-warning-400',
};

const itemsPerPage = 8;

const formatUSD = (value: number | string) => {
  const num = Number(value);
  if (isNaN(num)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
    .format(num)
    .replace(/\.00$/, '');
};

export default function Rooms() {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dealToRemove, setDealToRemove] = useState<{ roomId: number; dealName: string } | null>(
    null
  );

  const openConfirmDialog = (roomId: number, dealName: string) => {
    setDealToRemove({ roomId, dealName });
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dealToRemove) return;
    try {
      await removeDealFromRoom(dealToRemove.roomId);
      toast({
        title: 'Success',
        description: 'Deal removed successfully!',
      });
      await fetchRooms(currentPage, filter);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to remove deal!',
        variant: 'destructive',
      });
    }
    setConfirmDialogOpen(false);
  };
  const { toast } = useToast();
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    available: 0,
    occupied: 0,
    maintenance: 0,
    all: 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        let allRooms: Room[] = [];
        let page = 1;
        let totalPages = 1;
        do {
          const params: any = { page, limit: 100 };
          const res = await getAllRooms(params);
          allRooms = allRooms.concat(res.data || []);
          totalPages = res.totalPages || 1;
          page++;
        } while (page <= totalPages);

        const counts: Record<string, number> = {
          available: 0,
          occupied: 0,
          maintenance: 0,
          all: allRooms.length,
        };

        allRooms.forEach((room: Room) => {
          if (room.status) {
            const key = room.status.toLowerCase();
            if (counts[key] !== undefined) counts[key]++;
          }
        });

        setStatusCounts(counts);
      } catch (error) {
        setStatusCounts({ available: 0, occupied: 0, maintenance: 0, all: 0 });
        toast({
          title: 'Error',
          description: 'Failed to fetch room status counts!',
          variant: 'destructive',
        });
      }
    };
    fetchStatusCounts();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [selectedDealMap, setSelectedDealMap] = useState<Record<number, any | null>>({});
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await getAllDeals();
        setDeals(res.data.items || []);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch deals!',
          variant: 'destructive',
        });
      }
    };
    fetchDeals();
  }, []);

  const [rooms, setRooms] = useState<{ data: Room[]; total: number; totalPages: number }>({
    data: [],
    total: 0,
    totalPages: 1,
  });

  const [filter, setFilter] = useState<'All' | Room['status']>('All');
  const [showForm, setShowForm] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchRooms = async (page = 1, filterStatus: 'All' | Room['status'] = 'All') => {
    try {
      if (filterStatus !== 'All') {
        const { getRoomsByStatus } = await import('@/services/roomService');
        const res = await getRoomsByStatus(filterStatus.toLowerCase(), {
          page,
          perPage: itemsPerPage,
        });
        setRooms({
          data: res.data,
          total: res.total,
          totalPages: res.totalPages,
        });
      } else {
        const params: any = { page, limit: itemsPerPage };
        const res = await getAllRooms(params);
        setRooms({
          data: res.data,
          total: res.total,
          totalPages: res.totalPages,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms!',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    fetchRooms(currentPage, filter);
  }, [currentPage, filter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const ref = menuOpen ? menuRefs.current[menuOpen] : null;
      if (ref && !ref.contains(event.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const totalPages = rooms.totalPages;
  const pageRooms = rooms.data;

  const handleAddRoom = async (newRoom: FormValues) => {
    try {
      await createRoom({
        ...newRoom,
        amenities: Array.isArray(newRoom.amenities) ? newRoom.amenities : [],
        image_urls: newRoom.image_urls || [],
      });
      setShowForm(false);
      toast({
        title: 'Success',
        description: 'Room added successfully!',
      });
      await fetchRooms(currentPage, filter);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add room!',
        variant: 'destructive',
      });
    }
  };

  const handleEditRoom = async (updated: FormValues) => {
    if (!editRoom?.room_id) return;
    try {
      await updateRoom(editRoom.room_id, {
        ...updated,
        amenities: Array.isArray(updated.amenities) ? updated.amenities : [],
        image_urls: updated.image_urls || [],
      });
      setEditRoom(null);
      toast({
        title: 'Success',
        description: 'Room updated successfully!',
      });
      fetchRooms(currentPage, filter);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update room!',
        variant: 'destructive',
      });
    }
  };

  const mapRoomToFormValues = (room: Room): FormValues => ({
    name: room.name,
    status: room.status,
    description: room.description ?? '',
    room_type_id: String(room.room_type_id),
    room_level_id: String(room.room_level_id),
    floor_id: room.floor_id !== undefined && room.floor_id !== null ? String(room.floor_id) : '',
    images: null,
    amenities: Array.isArray(room.amenities)
      ? room.amenities.map((a: any) => (typeof a === 'string' ? a : a.name)).filter(Boolean)
      : typeof room.amenities === 'string' && room.amenities
        ? (room.amenities as string)
            .split(',')
            .map((a: string) => a.trim())
            .filter(Boolean)
        : [],
    image_urls: room.image_urls ?? [],
  });

  return (
    <div className="p-4 bg-white">
      <AddRoomForm open={showForm} onClose={() => setShowForm(false)} onSave={handleAddRoom} />

      {editRoom && (
        <AddRoomForm
          open={true}
          onClose={() => setEditRoom(null)}
          onSave={handleEditRoom}
          initialValues={mapRoomToFormValues(editRoom)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="space-x-2">
          {['All', 'Available', 'Occupied'].map((value) => {
            let count = value === 'All' ? statusCounts.all : statusCounts[value.toLowerCase()] || 0;
            return (
              <Button
                key={value}
                variant="outline"
                className={`group rounded-full px-6 py-2 ${
                  filter === value
                    ? 'bg-adminLayout-primary-50 text-adminLayout-primary-600 border-adminLayout-primary-500 font-semibold'
                    : 'bg-white text-adminLayout-grey-500 border border-adminLayout-grey-300 hover:text-adminLayout-primary-600 hover:border-adminLayout-primary-500'
                }`}
                onClick={() => setFilter(value as any)}
              >
                {value}{' '}
                <span
                  className={`ml-1 text-xs ${
                    filter === value
                      ? 'text-adminLayout-primary-600'
                      : 'text-adminLayout-grey-600 group-hover:text-adminLayout-primary-600'
                  }`}
                >
                  ({count})
                </span>
              </Button>
            );
          })}
        </div>
        <Button
          className="px-6 py-2 text-white rounded-md bg-adminLayout-primary-500 hover:bg-adminLayout-primary-600"
          onClick={() => setShowForm(true)}
        >
          Add Room
        </Button>
      </div>

      {rooms.data.length === 0 ? (
        <div className="py-8 text-center text-adminLayout-grey-40">No rooms found.</div>
      ) : (
        <div className="overflow-hidden border rounded-xl border-adminLayout-grey-200">
          <table className="w-full text-sm text-left bg-white">
            <thead className="border bg-adminLayout-grey-10 text-adminLayout-grey-20">
              <tr>
                <th className="p-3 font-medium">Room Name</th>
                <th className="p-3 font-medium">Room Type</th>
                <th className="p-3 font-medium">Room Level</th>
                <th className="p-3 font-medium">Room Floor</th>
                <th className="p-3 font-medium">Room Amenities</th>
                <th className="p-3 font-medium">Original Price</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Deals</th>
                <th className="p-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-adminLayout-grey-30">
              {pageRooms.map((room) => (
                <tr key={room.room_id} className="border-b hover:bg-adminLayout-grey-50">
                  <td className="p-3 font-medium">{room.name}</td>
                  <td className="p-3">{room.room_type_name}</td>
                  <td className="p-3">{room.room_level_name ?? '-'}</td>
                  <td className="p-3">{`Floor ${room.floor_id ?? '-'}`}</td>
                  <td className="p-3">
                    {Array.isArray(room.amenities) && room.amenities.length > 0
                      ? room.amenities
                          .map((a: any) => (typeof a === 'string' ? a : a.name))
                          .join(', ')
                      : '-'}
                  </td>
                  <td className="p-3">{formatUSD(room.total_price)}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${statusClasses[room.status]}`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <select
                        className="w-full px-1 py-2 bg-white border rounded"
                        value={room.deal?.deal_id || ''}
                        onChange={async (e) => {
                          const selectedId = Number(e.target.value);
                          const selectedDeal = deals.find((d) => d.deal_id === selectedId) || null;
                          setSelectedDealMap((prev) => ({
                            ...prev,
                            [room.room_id]: selectedDeal,
                          }));

                          try {
                            await assignDealToRoom(room.room_id, selectedId);
                            toast({
                              title: 'Success',
                              description: `Deal "${selectedDeal?.deal_name || ''}" assigned successfully!`,
                            });
                            fetchRooms(currentPage, filter);
                          } catch {
                            toast({
                              title: 'Error',
                              description: 'Failed to assign deal!',
                              variant: 'destructive',
                            });
                          }
                        }}
                      >
                        {!room.deal && <option value="">Assign Deal</option>}
                        {deals.map((deal) => (
                          <option key={deal.deal_id} value={deal.deal_id}>
                            {deal.deal_name}
                            {` (${Number((deal.discount_rate * 100).toFixed(2))}% Off)`}
                          </option>
                        ))}
                      </select>

                      {room.deal && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            openConfirmDialog(room.room_id, room.deal?.deal_name || '')
                          }
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>

                    {room.deal && (
                      <div className="mt-1 ml-3 text-xs font-semibold text-blue-600">
                        {room.deal.start_date && room.deal.end_date
                          ? `${formatDate(room.deal.start_date)} - ${formatDate(
                              room.deal.end_date
                            )}`
                          : ''}
                      </div>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="inline-flex gap-0.5 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => setEditRoom(room)}>
                        <Pencil className="w-3 h-3 text-black" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
        title="Remove Deal Confirmation"
        description={`Are you sure you want to remove the deal "${dealToRemove?.dealName}" from this room? This action cannot be undone.`}
      />

      <Toaster />
    </div>
  );
}
