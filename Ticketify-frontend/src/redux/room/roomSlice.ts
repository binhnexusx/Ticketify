import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRoomDetailFromLocalStorage } from '@/utils/storage';
import { RoomData } from '@/types/room';

type RoomDetailState = {
  room: RoomData | null;
  guest: Number;
  checkInDate: string | null;
  checkOutDate: string| null;
};

const initialState: RoomDetailState = getRoomDetailFromLocalStorage() || {
  room: null,
  guest: 1,
  checkInDate: '',
  checkOutDate: '',
};

const roomSlice = createSlice({
  name: 'roomDetail',
  initialState,
  reducers: {
    setRoomDetail(state, action: PayloadAction<RoomDetailState>) {
      return action.payload;
    },
    clearRoomDetail() {
      return {
        room: null,
        guest: 1,
        checkInDate: '',
        checkOutDate: '',
      };
    },
  },
});

export const { setRoomDetail, clearRoomDetail } = roomSlice.actions;

export default roomSlice.reducer;
