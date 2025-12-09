import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import {
  getDashboardStatus,
  getDashboardDeals,
  getDashboardFeedback,
  getDashboardTop5mostBookedRooms,
  getDashboardHotelFeedback,
} from '@/services/admin';
import { DashboardStatus, DashboardDeal, DashboardFeedback, DashboardChart } from '@/types/admin';
import { OverviewType, OverviewTitle, RoomType } from '@/constants/enums';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<DashboardStatus | null>(null);
  const [deals, setDeals] = useState<DashboardDeal[]>([]);
  const [feedback, setFeedback] = useState<DashboardFeedback[]>([]);
  const [hotelFeedback, setHotelFeedback] = useState<DashboardFeedback[]>([]);
  const [chart, setChart] = useState<DashboardChart[]>([]);
  const [month, setMonth] = useState(String(currentMonth));
  const [year, setYear] = useState(String(currentYear));

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: dayjs().month(i).format('MMMM'),
    value: (i + 1).toString(),
  }));
  const years = Array.from({ length: 6 }, (_, i) => (currentYear + i).toString());

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [statusData, dealsData, feedbackData, hotelFb] = await Promise.all([
          getDashboardStatus(),
          getDashboardDeals(),
          getDashboardFeedback(),
          getDashboardHotelFeedback(),
        ]);

        setStatus(statusData);
        setDeals(dealsData);
        setFeedback(feedbackData);
        setHotelFeedback(hotelFb);
      } catch (err) {
        console.error('Static dashboard data fetch failed:', err);
      }
    };

    fetchStaticData();
  }, []);

  useEffect(() => {
    const fetchTopRooms = async () => {
      try {
        setLoading(true);
        const topRooms = await getDashboardTop5mostBookedRooms(month, Number(year));

        const formattedChart = topRooms.map((room) => ({
          name: room.room_name,
          value: Number(room.total_bookings),
        }));

        setChart(formattedChart);
      } catch (err) {
        console.error('Top rooms fetch failed:', err);
        setChart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRooms();
  }, [month, year]);

  const overviewData = status
    ? [
        {
          title: OverviewTitle.TODAY,
          label: OverviewType.CHECK_IN,
          value: status.check_in_today ?? 0,
        },
        {
          title: OverviewTitle.TODAY,
          label: OverviewType.CHECK_OUT,
          value: status.check_out_today ?? 0,
        },
        {
          title: OverviewTitle.TOTAL,
          label: OverviewType.AVAILABLE_ROOM,
          value: status.available_room_count ?? 0,
        },
        {
          title: OverviewTitle.TOTAL,
          label: OverviewType.OCCUPIED_ROOM,
          value: status.occupied_room_count ?? 0,
        },
      ]
    : [];

  const roomBoxData = deals.map((item) => ({
    deals: `${item.total_deals} deal${item.total_deals > 1 ? 's' : ''}`,
    type: item.room_type_name as RoomType,
    current: Number(item.used_rooms),
    total: Number(item.total_rooms),
    price: Number(item.price),
  }));

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-3 bg-white">
        <div />
        <p className="text-sm text-adminLayout-grey-600">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
        <Button className="text-sm text-white bg-adminLayout-primary-500">Create Booking</Button>
      </div>

      <div className="bg-adminLayout-dashboard-50">
        {/* Overview */}
        <div className="p-6 m-5 space-y-5 bg-white rounded-lg">
          <h1 className="text-xl text-adminLayout-dashboard-100">Overview</h1>
          <div className="flex justify-between">
            {overviewData.map((item, index) => (
              <div key={index}>
                <p className="text-adminLayout-dashboard-400">{item.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-adminLayout-dashboard-600">{item.label}</span>
                  <span className="text-2xl font-semibold text-adminLayout-primary-600">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Deals */}
        <div className="p-6 m-5 space-y-5 bg-white rounded-lg">
          <h1 className="text-xl text-adminLayout-dashboard-100">Rooms</h1>
          <div className="flex justify-between">
            {roomBoxData?.map((room, index) => (
              <div key={index}>
                <div className="rounded-lg border p-4 w-[320px]">
                  <div className="w-12 text-xs text-center rounded bg-adminLayout-dashboard-300 text-adminLayout-dashboard-200">
                    {room.deals}
                  </div>
                  <div className="text-base text-adminLayout-dashboard-600">{room.type}</div>
                  <div className="text-xl font-semibold text-adminLayout-grey-600">
                    {room.current}{' '}occupied/{room.total} {' '}total
                  </div>
                  <div>
                    <span className="text-2xl font-semibold text-adminLayout-primary-600">
                      ${room.price}
                    </span>{' '}
                    / day
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts + Feedback */}
        <div className="grid grid-cols-5 gap-4 m-5">
          {/* Chart */}
          <div className="col-span-3 p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-adminLayout-dashboard-100">Top 5 Most Booked Rooms</h2>
              <div className="flex gap-3">
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="justify-center gap-3 pt-3 border-2 w-28 border-adminLayout-grey-300 items_center">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="justify-center gap-3 pt-3 border-2 w-28 border-adminLayout-grey-300 items_center">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="h-[250px] flex items-center justify-center text-gray-500 animate-pulse">
                Loading chart...
              </div>
            ) : chart.length === 0 ? (
              <p className="mt-6 text-center text-gray-500">
                No data for {months[+month - 1]?.label} {year}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            <p className="pt-4 italic text-center text-gray-500">
              The chart shows the top 5 most booked rooms.
            </p>
          </div>

          {/* Feedbacks */}
          <div className="col-span-2 space-y-4">
            {/* Room Feedback */}
            <div className="bg-white p-6 rounded-lg h-[325px] overflow-y-auto scrollbar-thin">
              <h3 className="pb-2 text-xl text-adminLayout-dashboard-100">Rooms feedback</h3>
              {feedback.map((fb, index) => (
                <div key={index} className="py-3 text-sm border-b">
                  <div className="flex justify-between font-medium">
                    <span>{fb.customer_name}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4"
                          fill={i < fb.rating ? 'currentColor' : 'none'}
                          stroke="currentColor"
                        />
                      ))}
                    </div>
                    <span className="text-gray-500">{fb.room_name}</span>
                  </div>
                  <p className="mt-1 text-gray-500">{fb.comment}</p>
                </div>
              ))}
            </div>

            {/* Hotel Feedback */}
            <div className="bg-white p-6 rounded-lg h-[225px] overflow-y-auto scrollbar-thin">
              <h3 className="pb-2 text-xl text-adminLayout-dashboard-100">Hotel feedback</h3>
              {hotelFeedback.map((fb, index) => (
                <div key={index} className="py-3 text-sm border-b">
                  <div className="flex justify-between font-medium">
                    <div className="flex items-center gap-2">
                      <span>{fb.customer_name ?? 'Unknown'}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4"
                            fill={i < fb.rating ? 'currentColor' : 'none'}
                            stroke="currentColor"
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-500">
                      {new Date(fb.submitted_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-500">{fb.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
