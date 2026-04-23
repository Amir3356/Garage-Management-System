import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import {
  Users,
  Car,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    revenue: 0,
  });
  const [users, setUsers] = useState(0);
  const [vehicles, setVehicles] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, vehiclesRes, appointmentsRes] = await Promise.all([
          api.get('/appointments/stats'),
          api.get('/users'),
          api.get('/vehicles'),
          api.get('/appointments'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data.length);
        setVehicles(vehiclesRes.data.length);
        setRecentAppointments(appointmentsRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Appointments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
              Pending
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending Appointments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Done
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          <p className="text-sm text-gray-500">Completed Services</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${Number(stats.revenue).toFixed(2)}</p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users}</p>
              <p className="text-sm text-gray-500">Registered Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Car className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{vehicles}</p>
              <p className="text-sm text-gray-500">Registered Vehicles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mechanic
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{appointment.user?.name}</p>
                    <p className="text-xs text-gray-500">{appointment.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{appointment.service?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {appointment.vehicle?.car_name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {appointment.mechanic?.name || (
                      <span className="text-yellow-600">Not assigned</span>
                    )}
                  </td>
                </tr>
              ))}
              {recentAppointments.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No appointments yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
