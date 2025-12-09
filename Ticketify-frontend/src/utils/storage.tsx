// src/utils/storage.ts

export const getToken = (): string | null => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const getUser = (): any | null => {
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

export const setAuthStorage = (token: string, user: any, refreshToken:string, remember: boolean = false) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("token", token);
  storage.setItem("user", JSON.stringify(user));
  storage.setItem("refreshToken",refreshToken)
};

export const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

// 
export const persistRoomDetailToLocalStorage = (
  room: any,
  guest: number,
  checkInDate?: string,
  checkOutDate?: string,
  formData?: any
) => {
  try {
    const data = {
      room,
      guest,
      checkInDate: checkInDate || '',
      checkOutDate: checkOutDate || '',
      formData: formData || {},
    };
    localStorage.setItem('booking-room-detail', JSON.stringify(data));
  } catch (err) {
    console.error('❌ Error saving booking data:', err);
  }
};


export const getRoomDetailFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('booking-room-detail');
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('❌ Error parsing booking data from localStorage:', err);
    return null;
  }
};

export const clearRoomDetailFromLocalStorage = () => {
  console.log('✅ Đã xóa dữ liệu đặt phòng');
  localStorage.removeItem('booking-room-detail');
};
