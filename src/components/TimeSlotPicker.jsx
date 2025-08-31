import React, { useState, useEffect } from 'react';

const TimeSlotPicker = ({ onSlotsChange, initialSlots = [] }) => {
  const [slots, setSlots] = useState(initialSlots);

  // Generate next 7 days (one week)
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

  // Common time slots
  const commonTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];

  useEffect(() => {
    if (onSlotsChange) {
      onSlotsChange(slots);
    }
  }, [slots, onSlotsChange]);

  const addSlotForDate = (dateString) => {
    const existingSlot = slots.find(slot => slot.date === dateString);

    if (existingSlot) {
      // Check if already has 2 slots
      if (existingSlot.times.length >= 2) {
        alert('Maximum 2 time slots allowed per day');
        return;
      }
      // Add a new time to existing slot
      const updatedSlots = slots.map(slot =>
        slot.date === dateString
          ? { ...slot, times: [...slot.times, '9:00 AM'] }
          : slot
      );
      setSlots(updatedSlots);
    } else {
      // Create new slot for this date
      const newSlot = {
        date: dateString,
        times: ['9:00 AM']
      };
      setSlots([...slots, newSlot]);
    }
  };

  const removeSlotForDate = (dateString) => {
    const updatedSlots = slots.filter(slot => slot.date !== dateString);
    setSlots(updatedSlots);
  };

  const updateTimeForSlot = (dateString, timeIndex, newTime) => {
    const updatedSlots = slots.map(slot => 
      slot.date === dateString 
        ? { 
            ...slot, 
            times: slot.times.map((time, index) => 
              index === timeIndex ? newTime : time
            ) 
          }
        : slot
    );
    setSlots(updatedSlots);
  };

  const addTimeToSlot = (dateString) => {
    const existingSlot = slots.find(slot => slot.date === dateString);

    if (existingSlot && existingSlot.times.length >= 2) {
      alert('Maximum 2 time slots allowed per day');
      return;
    }

    const updatedSlots = slots.map(slot =>
      slot.date === dateString
        ? { ...slot, times: [...slot.times, '9:00 AM'] }
        : slot
    );
    setSlots(updatedSlots);
  };

  const removeTimeFromSlot = (dateString, timeIndex) => {
    const updatedSlots = slots.map(slot => 
      slot.date === dateString 
        ? { 
            ...slot, 
            times: slot.times.filter((_, index) => index !== timeIndex) 
          }
        : slot
    ).filter(slot => slot.times.length > 0); // Remove slot if no times left
    
    setSlots(updatedSlots);
  };

  const getSlotForDate = (dateString) => {
    return slots.find(slot => slot.date === dateString);
  };

  const applyToAllDays = () => {
    if (slots.length === 0) return;
    
    // Use the first slot as template
    const template = slots[0];
    const newSlots = weekDays.map(day => ({
      date: day.dateString,
      times: [...template.times]
    }));
    
    setSlots(newSlots);
  };

  const clearAllSlots = () => {
    setSlots([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Available Time Slots
        </label>
        <p className="text-xs text-gray-600 mb-4">
          Set your available consultation times for the next 7 days. You can customize individual days or apply the same schedule to all days.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={applyToAllDays}
          disabled={slots.length === 0}
          className="px-4 py-2 bg-[#7551B2] text-white rounded-lg text-sm font-medium hover:bg-[#6441a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Apply First Day to All
        </button>
        <button
          type="button"
          onClick={clearAllSlots}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Weekly Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const slotForDay = getSlotForDate(day.dateString);
          const hasSlot = !!slotForDay;

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
                {hasSlot ? (
                  <button
                    type="button"
                    onClick={() => removeSlotForDate(day.dateString)}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => addSlotForDate(day.dateString)}
                    className="text-[#7551B2] hover:text-[#6441a0] text-xs px-2 py-1 rounded border border-[#7551B2] hover:bg-purple-50"
                  >
                    Add Slot
                  </button>
                )}
              </div>

              {hasSlot && (
                <div className="space-y-1">
                  {slotForDay.times.map((time, timeIndex) => (
                    <div key={timeIndex} className="flex gap-1">
                      <select
                        value={time}
                        onChange={(e) => updateTimeForSlot(day.dateString, timeIndex, e.target.value)}
                        className="flex-1 text-xs border border-gray-200 rounded px-1 py-1 focus:border-[#7551B2] focus:outline-none"
                      >
                        {commonTimes.map(commonTime => (
                          <option key={commonTime} value={commonTime}>
                            {commonTime}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeTimeFromSlot(day.dateString, timeIndex)}
                        className="text-red-500 hover:text-red-700 text-xs w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {slotForDay.times.length < 2 && (
                    <button
                      type="button"
                      onClick={() => addTimeToSlot(day.dateString)}
                      className="w-full text-[#7551B2] hover:text-[#6441a0] text-xs py-1 border border-dashed border-[#7551B2] rounded mt-1"
                    >
                      + Time ({2 - slotForDay.times.length} remaining)
                    </button>
                  )}
                  {slotForDay.times.length >= 2 && (
                    <p className="w-full py-1 px-2 text-center text-xs text-gray-400 bg-gray-50 rounded mt-1">
                      Maximum 2 slots reached
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {slots.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">
            {slots.length} days configured with a total of {slots.reduce((total, slot) => total + slot.times.length, 0)} time slots
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
