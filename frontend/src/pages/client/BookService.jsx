import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { Calendar, Clock, Wrench, CheckCircle, Sparkles, Shield, Zap, Settings } from 'lucide-react';

const BookService = () => {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    service_id: '',
    scheduled_date: '',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, servicesRes] = await Promise.all([
          api.get('/vehicles'),
          api.get('/services'),
        ]);
        setVehicles(vehiclesRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/appointments', formData);
      setSuccess(true);
      setFormData({ vehicle_id: '', service_id: '', scheduled_date: '', notes: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200 animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h2>
        <p className="text-gray-500 mb-4">Please add a vehicle first before booking a service.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book a Service</h1>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span>Service booked successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Vehicle
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, vehicle_id: vehicle.id })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.vehicle_id === vehicle.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Wrench className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vehicle.car_name}</p>
                      <p className="text-sm text-gray-500">{vehicle.plate_number}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Select Service
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service, index) => {
                const icons = [Wrench, Shield, Zap, Settings];
                const colors = ['blue', 'emerald', 'amber', 'purple', 'rose', 'cyan'];
                const ServiceIcon = icons[index % icons.length];
                const color = colors[index % colors.length];
                const colorClasses = {
                  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-400', ring: 'ring-blue-500', selectedBg: 'bg-blue-50' },
                  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', hover: 'hover:border-emerald-400', ring: 'ring-emerald-500', selectedBg: 'bg-emerald-50' },
                  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', hover: 'hover:border-amber-400', ring: 'ring-amber-500', selectedBg: 'bg-amber-50' },
                  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:border-purple-400', ring: 'ring-purple-500', selectedBg: 'bg-purple-50' },
                  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', hover: 'hover:border-rose-400', ring: 'ring-rose-500', selectedBg: 'bg-rose-50' },
                  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', hover: 'hover:border-cyan-400', ring: 'ring-cyan-500', selectedBg: 'bg-cyan-50' },
                }[color];

                const isSelected = formData.service_id === service.id;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, service_id: service.id })}
                    className={`group relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ease-out ${
                      isSelected
                        ? `${colorClasses.border} ${colorClasses.selectedBg} shadow-lg ring-2 ${colorClasses.ring} ring-offset-2`
                        : `border-gray-200 bg-white hover:shadow-md ${colorClasses.hover}`
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className={`w-6 h-6 rounded-full ${colorClasses.bg} flex items-center justify-center`}>
                          <CheckCircle className={`w-4 h-4 ${colorClasses.text}`} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colorClasses.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <ServiceIcon className={`w-6 h-6 ${colorClasses.text}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-gray-900 mb-1 truncate ${isSelected ? colorClasses.text : ''}`}>
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {service.description}
                        </p>

                        {/* Price and Duration */}
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${colorClasses.bg} ${colorClasses.text}`}>
                            ${service.price}
                          </span>
                          {service.duration_minutes && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3.5 h-3.5" />
                              {service.duration_minutes} min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              rows="3"
              placeholder="Any specific requirements or issues..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !formData.vehicle_id || !formData.service_id}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Appointment'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookService;
