import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import LandingPage from '@/pages/LandingPage';

import AdminLayout from '@/layouts/AdminLayout';
import UserLayout from '@/layouts/UserLayout';

import Dashboard from '@/pages/admin/Dashboard';
import Rooms from '@/pages/admin/Rooms';
import BookingPage from '@/pages/admin/Booking';
import User from '@/pages/admin/User';
import Rate from '@/pages/admin/Rate';
import FrontDesk from '@/pages/admin/FrontDesk';

import BasicInfo from '@/pages/user/BasicInfo';
import ProfileLayout from '@/components/layout/ProfileLayout';
import HotelRoomFilter from '@/pages/user/HotelRoomFilter';
import RoomDetailPage from '@/pages/user/RoomDetailPage';
import BookingCheckout from '@/pages/user/BookingCheckout';
import FeedbackForm from '@/pages/user/ProfileFeedback';
import AccountSecuritySettings from '@/pages/user/ChangeEmailModal';
import PaymentConfirmed from '@/pages/user/paymentConfirmed';
import PaymentInfo from '@/components/common/PaymentInfo';
import DealManagementPage from '@/pages/admin/Deal';
import BookingHistory from '@/pages/user/BookingHistory';
import FavoriteRoom from '@/pages/user/FavoriteRoom';
import GanttChart from '@/pages/GanttChart';
import CheckAvailable from '@/components/manualBooking/CheckAvailable';
import ForgotPassword from '@/pages/ForgotPassword';
import VerifyCode from '@/pages/VerifyCode';
import ResetPassword from '@/pages/ResetPassword';
import Success from '@/pages/Success';

const MainRouter = () => {
  return (
    <Routes>
      {/* Public routes with UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms/:id" element={<RoomDetailPage />} />
        <Route path="/rooms" element={<HotelRoomFilter />}></Route>
      </Route>

      {/* Public routes without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/success" element={<Success />} />

      {/* Protected user routes */}
      <Route
        element={
          <ProtectedRoute roles={['user']}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/user" element={<ProfileLayout />}>
          <Route path="profile" element={<BasicInfo />} />
          <Route path="feedback" element={<FeedbackForm />} />
          <Route path="Setting" element={<AccountSecuritySettings />} />
          <Route path="payment" element={<PaymentInfo />} />
          <Route path="favouriteRooms" element={<FavoriteRoom />} />
          <Route path="bookingHistories" element={<BookingHistory />} />
        </Route>
        <Route path="/booking-checkout" element={<BookingCheckout />} />
        <Route path="/payment-confirmed/:booking_id" element={<PaymentConfirmed />} />
      </Route>

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="front-desk/check-available" element={<CheckAvailable />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="bookings" element={<BookingPage />} />
        <Route path="guests" element={<User />} />
        <Route path="front-desk" element={<GanttChart />}></Route>
        <Route path="rate" element={<Rate />} />
        <Route path="deals" element={<DealManagementPage />} />

        <Route path="rate" element={<Rate />} />
      </Route>

      {/* Catch-all */}
      <Route path="/" element={<Home />}></Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route path="/home" element={<LandingPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRouter;
