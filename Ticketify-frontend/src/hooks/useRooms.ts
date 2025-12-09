import { useEffect, useState } from 'react';
import { getAllRooms } from '@/services/roomService';
import { Room } from '@/types';

export const useRooms = (page = 1, perPage = 12) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data: roomList } = await getAllRooms({ page, perPage });
        console.log(roomList);
        setTimeout(() => {
          setRooms(roomList);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Error fetching rooms');
        console.error(err);
        setLoading(false);
      }
    };

    fetchRooms();
  }, [page, perPage]);

  return { rooms, loading, error };
};
