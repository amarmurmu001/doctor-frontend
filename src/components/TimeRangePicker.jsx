import React, { useState, useEffect } from 'react';

const TimeRangePicker = ({ onSlotsChange, initialSlots = [] }) => {
  const [timeRanges, setTimeRanges] = useState([]);

  // Generate next 7 days
  const getNextWeek = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date,
        dateString: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0
      });
    }
    return days;
  };

  const weekDays = getNextWeek();

  // Common time options for start/end times
  const timeOptions = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  // Initialize from existing slots if any
  useEffect(() => {
    if (initialSlots && initialSlots.length > 0) {
      // Convert existing slots to time ranges
      const ranges = initialSlots.map(slot => {
        if (slot.times && slot.times.length >= 2) {
          return {
            date: slot.date,
            startTime: slot.times[0],
            endTime: slot.times[1]
          };
        } else if (slot.times && slot.times.length === 1) {
          return {
            date: slot.date,
            startTime: slot.times[0],
            endTime: '5:00 PM' // Default end time
          };
        }
        return null;
      }).filter(Boolean);

      setTimeRanges(ranges);
    }
  }, [initialSlots]);

  // Convert time ranges to slots format for parent component
  useEffect(() => {
    const slots = timeRanges.map(range => ({
      date: range.date,
      times: [range.startTime, range.endTime]
    }));

    if (onSlotsChange) {
      onSlotsChange(slots);
    }
  }, [timeRanges, onSlotsChange]);

  const addTimeRange = (dateString) => {
    // Check if range already exists for this date
    const existingRange = timeRanges.find(range => range.date === dateString);
    if (existingRange) {
      alert('Time range already exists for this day');
      return;
    }

    const newRange = {
      date: dateString,
      startTime: '9:00 AM',
      endTime: '5:00 PM'
    };

    setTimeRanges(prev => [...prev, newRange]);
  };

  const updateTimeRange = (dateString, field, value) => {
    setTimeRanges(prev =>
      prev.map(range =>
        range.date === dateString
          ? { ...range, [field]: value }
          : range
      )
    );
  };

  const removeTimeRange = (dateString) => {
    setTimeRanges(prev => prev.filter(range => range.date !== dateString));
  };

  const getTimeRangeForDate = (dateString) => {
    return timeRanges.find(range => range.date === dateString);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Available Time Ranges
        </label>
        <p className="text-xs text-gray-600 mb-4">
          Set your consultation time ranges for the next 7 days. Each day can have one time range.
        </p>
      </div>

      {/* Weekly Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const timeRange = getTimeRangeForDate(day.dateString);
          const hasRange = !!timeRange;

          return (
            <div
              key={day.dateString}
              className={`border rounded-lg p-3 ${
                day.isToday ? 'border-[#7551B2] bg-purple-50' : 'border-gray-200'
              }`}
            >
              <div className="flex flex-col items-center mb-3">
                <div className={`font-medium text-sm text-center ${day.isToday ? 'text-[#7551B2]' : 'text-gray-900'}`}>
                  {day.dayShort}
                </div>
                <div className="text-xs text-gray-500">
                  {day.month} {day.dayNumber}
                </div>
              </div>

              <div className="flex justify-center mb-2">
                {hasRange ? (
                  <button
                    type="button"
                    onClick={() => removeTimeRange(day.dateString)}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => addTimeRange(day.dateString)}
                    className="text-[#7551B2] hover:text-[#6441a0] text-xs px-2 py-1 rounded border border-[#7551B2] hover:bg-purple-50"
                  >
                    Add Range
                  </button>
                )}
              </div>

              {hasRange && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                    <select
                      value={timeRange.startTime}
                      onChange={(e) => updateTimeRange(day.dateString, 'startTime', e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded px-1 py-1 focus:border-[#7551B2] focus:outline-none"
                    >
                      {timeOptions.map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Time</label>
                    <select
                      value={timeRange.endTime}
                      onChange={(e) => updateTimeRange(day.dateString, 'endTime', e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded px-1 py-1 focus:border-[#7551B2] focus:outline-none"
                    >
                      {timeOptions.map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-center text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded">
                    {timeRange.startTime} to {timeRange.endTime}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {timeRanges.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">
            {timeRanges.length} day{timeRanges.length > 1 ? 's' : ''} configured with time ranges
          </p>
          <div className="mt-2 text-xs text-green-600">
            {timeRanges.map(range => (
              <div key={range.date}>
                {new Date(range.date).toLocaleDateString('en-US', { weekday: 'short' })}: {range.startTime} to {range.endTime}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangePicker;
