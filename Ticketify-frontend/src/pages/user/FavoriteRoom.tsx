import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Favorite } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';
import { getFavoriteRoom, deleteFavoriteRoom } from '@/services/profile';
import AdminPagination from '@/components/ui/admin-pagination';
import { API_URL } from '@/lib/axios';
export default function FavoriteRoom() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRoom, setTotalRoom] = useState(0);
  const [favoriteRoom, setFavoriteRoom] = useState<Favorite[]>([]);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  const perPage = 4;
  const { toast } = useToast();
  useEffect(() => {
    const fetchFavoriteRoom = async () => {
      try {
        setLoading(true);
        const res = await getFavoriteRoom(currentPage, perPage);
        setFavoriteRoom(res.favorite_room);
        setTotalRoom(res.total_room);
        setTotalPages(res.pagination.totalPages);
      } catch (err) {
        console.error('Failed to fetch favorite rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteRoom();
  }, [currentPage, perPage]);

  const handleDelete = async (room_id: string) => {
    if (deletingRoomId === room_id) return;
    setDeletingRoomId(room_id);
    try {
      const res = await deleteFavoriteRoom(room_id);
      toast({
        title: 'Deleted',
        description: res.message,
      });
      setFavoriteRoom((prev) => prev.filter((r) => r.room_id !== room_id));
      setTotalRoom((prev) => Math.max(0, prev - 1));
      if (favoriteRoom.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error('Failed to delete', error);
      toast({
        title: 'Error',
        description: 'Failed to delete room from favorites.',
        variant: 'destructive',
      });
    } finally {
      setDeletingRoomId(null);
    }
  };
  return (
    <div className="p-4 rounded-lg bg-white min-h-[505px]">
      <div className="p-6 space-y-2 text-black">
        <div className="text-2xl font-bold">Favorite Rooms</div>
        <div className="text-sm font-normal">{totalRoom} rooms in your favorites list</div>
      </div>
      <div className="grid grid-cols-2 gap-3 pl-3 md:grid-cols-2 lg:grid-cols-2">
        {loading ? (
          <div className="text-center text-gray-400 col-span-full">
            <span className="animate-pulse">Loading data...</span>
          </div>
        ) : (
          favoriteRoom?.map((room, index) => (
            <Card
              key={index}
              variant="vertical"
              imageUrl={room.image_url ? `${API_URL}${room.image_url}` : '/placeholder.jpg'}
              name={room.room_name}
              roomType={room.room_type}
              roomLevel={room.room_level}
              description={room.room_description}
              className="w-64"
              isLiked={true}
              roomId={room.room_id}
              onRemove={async () => handleDelete(room.room_id)}
            />
          ))
        )}
      </div>
      {favoriteRoom.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
