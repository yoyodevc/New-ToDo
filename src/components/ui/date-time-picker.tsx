import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isSameDay } from 'date-fns';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  onUrgentChange?: (isUrgent: boolean) => void;
  urgent?: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function DateTimePicker({ value, onChange, onUrgentChange, urgent = false }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const initialDate = value ? new Date(value) : null;

  const [navDate, setNavDate] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [hasTime, setHasTime] = useState(false);
  const [hour, setHour] = useState(initialDate ? (initialDate.getHours() % 12 || 12).toString() : '12');
  const [minute, setMinute] = useState(initialDate ? initialDate.getMinutes().toString().padStart(2, '0') : '00');
  const [ampm, setAmpm] = useState(initialDate ? (initialDate.getHours() >= 12 ? 'PM' : 'AM') : 'PM');
  const [isUrgent, setIsUrgent] = useState(urgent);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      setSelectedDate(d);
      setNavDate(d);
      setHour((d.getHours() % 12 || 12).toString());
      setMinute(d.getMinutes().toString().padStart(2, '0'));
      setAmpm(d.getHours() >= 12 ? 'PM' : 'AM');
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  useEffect(() => {
    setIsUrgent(urgent);
  }, [urgent]);

  const emit = (date: Date | null, time: boolean, h = hour, m = minute, ap = ampm) => {
    if (!date) { onChange(''); return; }
    const d = new Date(date);
    if (time) {
      let hrs = parseInt(h);
      if (ap === 'PM' && hrs < 12) hrs += 12;
      if (ap === 'AM' && hrs === 12) hrs = 0;
      d.setHours(hrs, parseInt(m), 0, 0);
    } else {
      d.setHours(0, 0, 0, 0);
    }
    onChange(d.toISOString());
  };

  const selectDay = (day: Date) => {
    setSelectedDate(day);
    emit(day, hasTime);
  };

  const applyShortcut = (type: 'today' | 'tomorrow' | 'nextWeek') => {
    const t = new Date();
    if (type === 'tomorrow') t.setDate(t.getDate() + 1);
    if (type === 'nextWeek') t.setDate(t.getDate() + 7);
    setSelectedDate(t);
    setNavDate(t);
  };

  const toggleTime = () => {
    const next = !hasTime;
    setHasTime(next);
    const base = selectedDate || new Date();
    setSelectedDate(base);
    emit(base, next);
  };

  const handleTime = (h: string, m: string, ap: string) => {
    setHour(h); setMinute(m); setAmpm(ap);
    if (selectedDate) emit(selectedDate, true, h, m, ap);
  };

  const handleUrgentToggle = () => {
    const next = !isUrgent;
    setIsUrgent(next);
    onUrgentChange?.(next);
  };

  const year = navDate.getFullYear();
  const month = navDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: lastDate }, (_, i) => new Date(year, month, i + 1)),
  ];

  const displayText = selectedDate
    ? hasTime
      ? `${format(selectedDate, 'MMM d, yyyy')} at ${hour}:${minute} ${ampm}`
      : format(selectedDate, 'MMM d, yyyy')
    : 'No due date';

  return (
    <div className="flex flex-col gap-2">
      {/* Trigger */}
      <div
        onClick={() => { setIsOpen(!isOpen); }}
        className="flex items-center justify-between px-3 py-2 rounded-[10px] cursor-pointer transition-colors"
        style={{ background: 'rgb(var(--surface-2))', border: '1.5px solid transparent' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgb(var(--border-soft))')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'transparent')}
      >
        <div className="flex items-center gap-2 text-[13.5px]" style={{ lineHeight: 0 }}>
          <Calendar size={14} style={{ color: 'rgb(var(--accent))' }} />
          <span style={{ color: selectedDate ? 'rgb(var(--text))' : 'rgb(var(--text-3))' }}>{displayText}</span>
          {isUrgent && (
            <AlertTriangle size={14} style={{ color: 'rgb(var(--text-2))', marginBottom: 0 }} />
          )}
        </div>
        {selectedDate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDate(null);
              onChange('');
              setIsUrgent(false);
              onUrgentChange?.(false);
              setIsOpen(false);
            }}
            className="p-1 rounded-full transition-colors hover:bg-[rgb(var(--surface-3))]"
            style={{ color: 'rgb(var(--text-3))' }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Panel */}
      {isOpen && (
        <div
          className="rounded-2xl flex flex-col gap-3 overflow-hidden"
          style={{
            background: 'rgb(var(--surface))',
            border: '1px solid rgb(var(--border-soft))',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            padding: '14px',
          }}
        >
          {/* ── Header ── */}
          <div className="flex flex-col gap-1 mb-1">
            {/* Month row */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setNavDate(new Date(year, month - 1, 1))}
                className="p-1.5 rounded-lg transition-colors hover:bg-[rgb(var(--surface-2))]"
                style={{ color: 'rgb(var(--text-2))' }}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[13.5px] font-semibold" style={{ color: 'rgb(var(--text))' }}>
                {MONTHS[month]}
              </span>
              <button
                type="button"
                onClick={() => setNavDate(new Date(year, month + 1, 1))}
                className="p-1.5 rounded-lg transition-colors hover:bg-[rgb(var(--surface-2))]"
                style={{ color: 'rgb(var(--text-2))' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Year row */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setNavDate(new Date(year - 1, month, 1))}
                className="p-1.5 rounded-lg transition-colors hover:bg-[rgb(var(--surface-2))]"
                style={{ color: 'rgb(var(--text-2))' }}
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[12px] font-medium" style={{ color: 'rgb(var(--text-3))' }}>
                {year}
              </span>
              <button
                type="button"
                onClick={() => setNavDate(new Date(year + 1, month, 1))}
                className="p-1.5 rounded-lg transition-colors hover:bg-[rgb(var(--surface-2))]"
                style={{ color: 'rgb(var(--text-2))' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* ── Calendar Grid ── */}
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="text-[10px] font-semibold mb-1" style={{ color: 'rgb(var(--text-3))' }}>
                {d}
              </span>
            ))}
            {days.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} />;
              const sel = selectedDate ? isSameDay(day, selectedDate) : false;
              const tod = isToday(day);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={cn(
                    'h-7 w-7 mx-auto rounded-full text-[12px] font-medium flex items-center justify-center transition-colors',
                    sel
                      ? 'bg-[rgb(var(--accent))] text-white'
                      : tod
                        ? 'font-bold hover:bg-[rgb(var(--surface-2))]'
                        : 'hover:bg-[rgb(var(--surface-2))]'
                  )}
                  style={{
                    color: sel ? '#fff' : tod ? 'rgb(var(--accent))' : 'rgb(var(--text))',
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {/* ── Shortcuts ── */}
          <div className="flex justify-between">
            {(['Today', 'Tomorrow', 'Next Week'] as const).map((label, i) => {
              const types = ['today', 'tomorrow', 'nextWeek'] as const;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => applyShortcut(types[i])}
                  className="text-[11.5px] font-medium transition-colors hover:underline"
                  style={{ color: 'rgb(var(--accent))' }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div style={{ height: 1, background: 'rgb(var(--border-soft))' }} />

          {/* ── Time Toggle ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5" style={{ color: 'rgb(var(--text-2))' }}>
              <Clock size={13} />
              <span className="text-[13px] font-medium">Add Time</span>
            </div>
            <button
              type="button"
              onClick={toggleTime}
              className={cn('w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none')}
              style={{ background: hasTime ? 'rgb(var(--accent))' : 'rgb(var(--border))' }}
            >
              <div
                className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: hasTime ? 'translateX(16px)' : 'translateX(0)' }}
              />
            </button>
          </div>

          {hasTime && (
            <div className="space-y-2.5">
              {/* Presets */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Morning', time: { h: '9', m: '00', ap: 'AM' } },
                  { label: 'Afternoon', time: { h: '1', m: '00', ap: 'PM' } },
                  { label: 'Evening', time: { h: '6', m: '00', ap: 'PM' } },
                  { label: 'Night', time: { h: '9', m: '00', ap: 'PM' } },
                ].map((preset) => {
                  const active = hour === preset.time.h && minute === preset.time.m && ampm === preset.time.ap;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleTime(preset.time.h, preset.time.m, preset.time.ap)}
                      className={cn(
                        "py-1 px-1.5 rounded-lg text-[10.5px] font-medium transition-all text-center",
                        active
                          ? "bg-[rgb(var(--accent))] text-white"
                          : "bg-[rgb(var(--surface-2))] hover:bg-[rgb(var(--surface-3))] text-[rgb(var(--text-2))]"
                      )}
                    >
                      <div className="font-semibold">{preset.label}</div>
                      <div className="opacity-80 text-[9px] mt-0.5">{preset.time.h}:{preset.time.m} {preset.time.ap}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom inputs */}
              <div className="flex items-center justify-center gap-2 rounded-xl py-2 px-3" style={{ background: 'rgb(var(--surface-2))' }}>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={hour}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val) {
                        let num = parseInt(val);
                        if (num > 12) num = 12;
                        if (num < 1) num = 1;
                        val = num.toString();
                      }
                      handleTime(val || '12', minute, ampm);
                    }}
                    onBlur={() => {
                      if (!hour) handleTime('12', minute, ampm);
                    }}
                    className="w-8 text-center bg-[rgb(var(--surface-3))] rounded px-1.5 py-1 text-[13px] font-semibold outline-none focus:ring-1 focus:ring-[rgb(var(--accent))]"
                    style={{ color: 'rgb(var(--text))' }}
                  />
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        let h = parseInt(hour) || 12;
                        h = h === 12 ? 1 : h + 1;
                        handleTime(h.toString(), minute, ampm);
                      }}
                      className="text-[9px] hover:bg-[rgb(var(--surface-3))] px-1 rounded leading-none"
                    >▲</button>
                    <button
                      type="button"
                      onClick={() => {
                        let h = parseInt(hour) || 12;
                        h = h === 1 ? 12 : h - 1;
                        handleTime(h.toString(), minute, ampm);
                      }}
                      className="text-[9px] hover:bg-[rgb(var(--surface-3))] px-1 rounded leading-none"
                    >▼</button>
                  </div>
                </div>

                <span className="text-[13px] font-bold opacity-40">:</span>

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={minute}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val) {
                        let num = parseInt(val);
                        if (num > 59) num = 59;
                        val = num.toString().padStart(2, '0');
                      }
                      handleTime(hour, val || '00', ampm);
                    }}
                    onBlur={() => {
                      if (!minute) handleTime(hour, '00', ampm);
                    }}
                    className="w-8 text-center bg-[rgb(var(--surface-3))] rounded px-1.5 py-1 text-[13px] font-semibold outline-none focus:ring-1 focus:ring-[rgb(var(--accent))]"
                    style={{ color: 'rgb(var(--text))' }}
                  />
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        let m = parseInt(minute) || 0;
                        m = m >= 55 ? 0 : m + 5;
                        handleTime(hour, m.toString().padStart(2, '0'), ampm);
                      }}
                      className="text-[9px] hover:bg-[rgb(var(--surface-3))] px-1 rounded leading-none"
                    >▲</button>
                    <button
                      type="button"
                      onClick={() => {
                        let m = parseInt(minute) || 0;
                        m = m <= 0 ? 55 : m - 5;
                        handleTime(hour, m.toString().padStart(2, '0'), ampm);
                      }}
                      className="text-[9px] hover:bg-[rgb(var(--surface-3))] px-1 rounded leading-none"
                    >▼</button>
                  </div>
                </div>

                <div
                  className="flex rounded-lg border overflow-hidden ml-2"
                  style={{ borderColor: 'rgb(var(--border-soft))' }}
                >
                  {['AM', 'PM'].map((ap) => (
                    <button
                      key={ap}
                      type="button"
                      onClick={() => handleTime(hour, minute, ap)}
                      className="px-2.5 py-1 text-[11px] font-bold transition-colors"
                      style={{
                        background: ampm === ap ? 'rgb(var(--surface-3))' : 'transparent',
                        color: ampm === ap ? 'rgb(var(--text))' : 'rgb(var(--text-3))',
                      }}
                    >
                      {ap}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ height: 1, background: 'rgb(var(--border-soft))' }} />

          {/* ── Urgent Toggle ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5" style={{ color: 'rgb(var(--text-2))' }}>
              <AlertTriangle size={13} />
              <span className="text-[13px] font-medium">Urgent</span>
            </div>
            <button
              type="button"
              onClick={handleUrgentToggle}
              className={cn('w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none')}
              style={{ background: isUrgent ? 'rgb(var(--accent))' : 'rgb(var(--border))' }}
            >
              <div
                className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: isUrgent ? 'translateX(16px)' : 'translateX(0)' }}
              />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}