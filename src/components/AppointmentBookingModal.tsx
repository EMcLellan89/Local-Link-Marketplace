import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  X, Calendar, Clock, ChevronLeft, ChevronRight, Check,
  User, Mail, Phone, Loader2, MapPin, AlertCircle
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  image_url?: string | null;
  booking_duration_minutes?: number;
  merchant: {
    id: string;
    business_name: string;
    city?: string;
    state?: string;
    phone?: string;
    booking_lead_time_hours?: number;
    booking_advance_days?: number;
  };
}

interface BookingSettings {
  slot_duration_minutes: number;
  buffer_minutes: number;
  max_per_slot: number;
  monday_open?: string; monday_close?: string;
  tuesday_open?: string; tuesday_close?: string;
  wednesday_open?: string; wednesday_close?: string;
  thursday_open?: string; thursday_close?: string;
  friday_open?: string; friday_close?: string;
  saturday_open?: string; saturday_close?: string;
  sunday_open?: string; sunday_close?: string;
}

interface Props {
  deal: Deal;
  onClose: () => void;
}

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function generateSlots(open: string, close: string, duration: number, buffer: number): string[] {
  const slots: string[] = [];
  let current = toMinutes(open);
  const end = toMinutes(close);
  while (current + duration <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    current += duration + buffer;
  }
  return slots;
}

export default function AppointmentBookingModal({ deal, onClose }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState<'calendar' | 'time' | 'info' | 'confirm' | 'success'>('calendar');

  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const leadHours = deal.merchant.booking_lead_time_hours ?? 2;
  const advanceDays = deal.merchant.booking_advance_days ?? 30;
  const duration = deal.booking_duration_minutes ?? settings?.slot_duration_minutes ?? 60;

  useEffect(() => {
    loadSettings();
    prefillUserInfo();
  }, []);

  useEffect(() => {
    if (selectedDate) loadBookedSlots(selectedDate);
  }, [selectedDate]);

  async function loadSettings() {
    const { data } = await supabase
      .from('merchant_booking_settings')
      .select('*')
      .eq('merchant_id', deal.merchant.id)
      .maybeSingle();
    setSettings(data ?? {
      slot_duration_minutes: 60,
      buffer_minutes: 15,
      max_per_slot: 1,
      monday_open: '09:00', monday_close: '17:00',
      tuesday_open: '09:00', tuesday_close: '17:00',
      wednesday_open: '09:00', wednesday_close: '17:00',
      thursday_open: '09:00', thursday_close: '17:00',
      friday_open: '09:00', friday_close: '17:00',
      saturday_open: '10:00', saturday_close: '15:00',
    });
  }

  async function prefillUserInfo() {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone')
      .eq('id', user.id)
      .maybeSingle();
    if (data) {
      setName(`${data.first_name ?? ''} ${data.last_name ?? ''}`.trim());
      setPhone(data.phone ?? '');
    }
    setEmail(user.email ?? '');
  }

  async function loadBookedSlots(date: Date) {
    const dateStr = date.toISOString().split('T')[0];
    const { data } = await supabase
      .from('deal_appointments')
      .select('appointment_time')
      .eq('merchant_id', deal.merchant.id)
      .eq('appointment_date', dateStr)
      .in('status', ['pending', 'confirmed']);
    setBookedSlots((data ?? []).map((r: any) => r.appointment_time.slice(0, 5)));
  }

  function isDayAvailable(date: Date): boolean {
    if (!settings) return false;
    const dayName = DAY_NAMES[date.getDay()];
    const openKey = `${dayName}_open` as keyof BookingSettings;
    const closeKey = `${dayName}_close` as keyof BookingSettings;
    return !!(settings[openKey] && settings[closeKey]);
  }

  function isDateSelectable(date: Date): boolean {
    const now = new Date();
    const minDate = new Date(now.getTime() + leadHours * 60 * 60 * 1000);
    const maxDate = new Date(now);
    maxDate.setDate(maxDate.getDate() + advanceDays);
    const d = new Date(date);
    d.setHours(23, 59, 59);
    return d >= minDate && date <= maxDate && isDayAvailable(date);
  }

  function getAvailableSlots(): string[] {
    if (!settings || !selectedDate) return [];
    const dayName = DAY_NAMES[selectedDate.getDay()];
    const open = (settings as any)[`${dayName}_open`];
    const close = (settings as any)[`${dayName}_close`];
    if (!open || !close) return [];
    const allSlots = generateSlots(open, close, duration, settings.buffer_minutes);
    const now = new Date();
    return allSlots.filter(slot => {
      if (bookedSlots.includes(slot)) return false;
      if (selectedDate.toDateString() === now.toDateString()) {
        const [h, m] = slot.split(':').map(Number);
        const slotTime = new Date(selectedDate);
        slotTime.setHours(h, m, 0, 0);
        return slotTime.getTime() > now.getTime() + leadHours * 3600000;
      }
      return true;
    });
  }

  function buildCalendar() {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const cells: (Date | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(calYear, calMonth, d));
    }
    return cells;
  }

  async function bookAppointment() {
    if (!selectedDate || !selectedTime || !name || !email) return;
    setSaving(true);
    setError('');

    try {
      let customerId: string | null = null;
      if (user) {
        const { data: cust } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        customerId = cust?.id ?? null;
      }

      const { error: err } = await supabase.from('deal_appointments').insert({
        deal_id: deal.id,
        merchant_id: deal.merchant.id,
        customer_id: customerId,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || null,
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime,
        duration_minutes: duration,
        notes: notes || null,
        status: 'pending',
      });

      if (err) throw err;
      setStep('success');
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const slots = getAvailableSlots();
  const cells = buildCalendar();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex items-start gap-3">
            {deal.image_url && (
              <img src={deal.image_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
            )}
            <div>
              <p className="text-xs font-medium text-[#2BB673] uppercase tracking-wide">{deal.merchant.business_name}</p>
              <h2 className="font-bold text-slate-900 text-lg leading-tight">{deal.title}</h2>
              {deal.merchant.city && (
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />{deal.merchant.city}{deal.merchant.state ? `, ${deal.merchant.state}` : ''}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        {step !== 'success' && (
          <div className="flex items-center gap-1 px-6 pt-4">
            {(['calendar', 'time', 'info', 'confirm'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s ? 'bg-[#2BB673] text-white' :
                  ['calendar','time','info','confirm'].indexOf(step) > i ? 'bg-emerald-100 text-[#2BB673]' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {['calendar','time','info','confirm'].indexOf(step) > i ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                {i < 3 && <div className={`h-0.5 w-8 transition-colors ${['calendar','time','info','confirm'].indexOf(step) > i ? 'bg-[#2BB673]' : 'bg-slate-200'}`} />}
              </div>
            ))}
            <span className="ml-2 text-xs text-slate-500 capitalize">{step === 'confirm' ? 'Review' : step === 'calendar' ? 'Pick Date' : step === 'time' ? 'Pick Time' : 'Your Info'}</span>
          </div>
        )}

        <div className="p-6">
          {/* ── STEP 1: Calendar ── */}
          {step === 'calendar' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-900">{MONTH_NAMES[calMonth]} {calYear}</span>
                <button
                  onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((date, i) => {
                  if (!date) return <div key={i} />;
                  const selectable = isDateSelectable(date);
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <button
                      key={i}
                      disabled={!selectable}
                      onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        isSelected ? 'bg-[#2BB673] text-white shadow-md' :
                        isToday && selectable ? 'border-2 border-[#2BB673] text-[#2BB673] hover:bg-emerald-50' :
                        selectable ? 'hover:bg-emerald-50 text-slate-700' :
                        'text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-slate-500 mt-4 text-center">
                Available up to {advanceDays} days in advance · {leadHours}h minimum notice required
              </p>

              <button
                disabled={!selectedDate}
                onClick={() => setStep('time')}
                className="w-full mt-4 bg-[#2BB673] text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-[#22995f] transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── STEP 2: Time Slots ── */}
          {step === 'time' && (
            <div>
              <button onClick={() => setStep('calendar')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" /> {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </button>

              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2BB673]" /> Available Times
                <span className="text-xs text-slate-400 font-normal">({duration} min)</span>
              </h3>

              {slots.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="font-medium">No available slots on this day</p>
                  <p className="text-sm mt-1">Try a different date</p>
                  <button onClick={() => setStep('calendar')} className="mt-4 text-[#2BB673] text-sm font-medium hover:underline">
                    Choose another date
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                  {slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        selectedTime === slot
                          ? 'bg-[#2BB673] text-white border-[#2BB673] shadow-md'
                          : 'border-slate-200 text-slate-700 hover:border-[#2BB673] hover:text-[#2BB673]'
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              )}

              <button
                disabled={!selectedTime}
                onClick={() => setStep('info')}
                className="w-full mt-5 bg-[#2BB673] text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-[#22995f] transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── STEP 3: Contact Info ── */}
          {step === 'info' && (
            <div>
              <button onClick={() => setStep('time')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#2BB673]" /> Your Details
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Phone (optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Special requests (optional)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Anything the merchant should know..."
                    rows={2}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673] resize-none"
                  />
                </div>
              </div>

              <button
                disabled={!name || !email}
                onClick={() => setStep('confirm')}
                className="w-full mt-5 bg-[#2BB673] text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-[#22995f] transition-colors"
              >
                Review Booking
              </button>
            </div>
          )}

          {/* ── STEP 4: Confirm ── */}
          {step === 'confirm' && (
            <div>
              <button onClick={() => setStep('info')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <h3 className="font-semibold text-slate-900 mb-4">Review Your Appointment</h3>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[#2BB673]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Date & Time</p>
                    <p className="font-semibold text-slate-900">
                      {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-[#2BB673] font-medium">{selectedTime ? formatTime(selectedTime) : ''} · {duration} min</p>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Business</p>
                    <p className="font-semibold text-slate-900">{deal.merchant.business_name}</p>
                    {deal.merchant.phone && <p className="text-sm text-slate-500">{deal.merchant.phone}</p>}
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Your Info</p>
                    <p className="font-semibold text-slate-900">{name}</p>
                    <p className="text-sm text-slate-500">{email}{phone ? ` · ${phone}` : ''}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 mb-4">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Payment Note:</strong> Payment for this service is handled directly by {deal.merchant.business_name}.
                  You will not be charged through this platform. The merchant will confirm your appointment shortly.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={bookAppointment}
                disabled={saving}
                className="w-full bg-[#2BB673] text-white py-3 rounded-xl font-semibold hover:bg-[#22995f] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : 'Confirm Appointment'}
              </button>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[#2BB673]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Appointment Requested!</h3>
              <p className="text-slate-500 text-sm mb-6">
                <strong>{deal.merchant.business_name}</strong> will confirm your appointment at<br />
                <strong className="text-slate-700">
                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime ? formatTime(selectedTime) : ''}
                </strong>
              </p>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-left text-sm text-slate-600 mb-6 space-y-1">
                <p>A confirmation email will be sent to <strong>{email}</strong></p>
                {deal.merchant.phone && <p>Questions? Call <strong>{deal.merchant.phone}</strong></p>}
                <p className="text-xs text-slate-400 mt-2">Payment will be handled by the merchant at time of service.</p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-[#2BB673] text-white py-3 rounded-xl font-semibold hover:bg-[#22995f] transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
