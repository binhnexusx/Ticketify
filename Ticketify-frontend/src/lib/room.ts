import { getFavoriteRoom } from '@/services/profile';

export const isRoomLiked = async (roomId: string): Promise<boolean> => {
  try {
    const res = await getFavoriteRoom(1, 1000);
    return res.favorite_room.some(room => room.room_id === roomId);
  } catch (error) {
    console.error('Failed to check if room is liked:', error);
    return false;
  }
};
