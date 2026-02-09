import { useState } from 'react';
import { Calendar, Clock, Check, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Card, { CardBody, CardHeader } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

interface AppointmentBookingProps {
  appointmentType: string;
  onSuccess?: () => void;
}

export default function AppointmentBooking({ appointmentType, onSuccess }: AppointmentBookingProps) {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<'form' | 'timeslot' | 'confirmation'>('form');
  const [formData, setFormData] = useState({
    name: profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : '',
    email: user?.email || '',
    phone: ''
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedAppointmentId, setBookedAppointmentId] = useState('');

  const availableDates = getNextAvailableDates(14);
  const timeSlots = generateTimeSlots();

  function getNextAvailableDates(days: number) {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  }

  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 17 && minute === 30) break;
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setStep('timeslot');
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

      const existingAppointments = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', appointmentDateTime.toISOString())
        .eq('status', 'scheduled');

      if (existingAppointments.data && existingAppointments.data.length > 0) {
        setError('This time slot is already booked. Please select another time.');
        setLoading(false);
        return;
      }

      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert({
          customer_id: user?.id || null,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          appointment_type: appointmentType,
          appointment_date: appointmentDateTime.toISOString(),
          duration_minutes: 30,
          status: 'scheduled',
          notes
        } as any)
        .select()
        .single();

      if (insertError) throw insertError;

      const appointment = data as any;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/appointment-notification`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appointmentId: appointment?.id,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          appointmentDate: appointmentDateTime.toISOString(),
          appointmentType
        })
      });

      setBookedAppointmentId(appointment?.id);
      setStep('confirmation');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 'form' && (
        <Card variant="bordered">
          <CardHeader>
            <h3 className="text-xl font-bold text-slate-900">Your Information</h3>
            <p className="text-sm text-slate-600 mt-1">We'll use this to contact you about your appointment</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>

              <Button type="submit" fullWidth>
                Continue to Select Time
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      {step === 'timeslot' && (
        <div className="space-y-6">
          <Card variant="bordered">
            <CardHeader>
              <h3 className="text-xl font-bold text-slate-900">Select Date & Time</h3>
              <p className="text-sm text-slate-600 mt-1">Choose an available appointment slot</p>
            </CardHeader>
            <CardBody>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Select Date
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableDates.map((date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedTime('');
                        }}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          isSelected
                            ? 'border-[#2BB673] bg-[#2BB673]/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-semibold text-slate-900">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-[#2BB673] bg-[#2BB673] text-white'
                              : 'border-slate-200 hover:border-slate-300 text-slate-900'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us anything we should know..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                    rows={3}
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep('form')} fullWidth>
                  Back
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || loading}
                  fullWidth
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {step === 'confirmation' && (
        <Card variant="bordered" className="bg-green-50 border-green-200">
          <CardBody className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h3>
            <p className="text-slate-600 mb-4">
              Your appointment has been scheduled for{' '}
              <span className="font-semibold">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                {' at '}
                {selectedTime}
              </span>
            </p>
            <div className="bg-white rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-slate-600 mb-2">
                <strong>Confirmation sent to:</strong> {formData.email}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Appointment ID:</strong> {bookedAppointmentId.substring(0, 8)}
              </p>
            </div>
            <p className="text-sm text-slate-500">
              We've sent a confirmation email to {formData.email}.
              Our team will reach out to you shortly to confirm the details.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
