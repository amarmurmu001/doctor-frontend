import React, { useState, useEffect, useCallback, useRef } from 'react';

const TimeRangePicker = ({ onSlotsChange, initialSlots = [] }) => {
  const [editedSlots, setEditedSlots] = useState({});
  const prevInitialSlotsRef = useRef();
  const isInitializingRef = useRef(false);
  const onSlotsChangeRef = useRef(onSlotsChange);

  // Update the ref when onSlotsChange changes
  onSlotsChangeRef.current = onSlotsChange;

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
    console.log('🔍 TimeRangePicker: Initializing with initialSlots', initialSlots);

    // Check if initialSlots have actually changed by comparing JSON
    const prevSlots = prevInitialSlotsRef.current;
    const currentSlotsString = JSON.stringify(initialSlots || []);
    const prevSlotsString = JSON.stringify(prevSlots || []);

    if (currentSlotsString === prevSlotsString) {
      console.log('🔍 TimeRangePicker: initialSlots unchanged, skipping re-initialization');
      return;
    }

    console.log('🔍 TimeRangePicker: initialSlots changed, proceeding with initialization');
    prevInitialSlotsRef.current = initialSlots;
    isInitializingRef.current = true;

    if (initialSlots && initialSlots.length > 0) {
      const initialEditedSlots = {};
      initialSlots.forEach(slot => {
        const dateKey = slot.date ? new Date(slot.date).toISOString().split('T')[0] : null;
        if (dateKey && slot.times && slot.times.length > 0) {
          initialEditedSlots[dateKey] = [...slot.times];
        }
      });
      console.log('🔍 TimeRangePicker: Setting initial editedSlots', initialEditedSlots);
      setEditedSlots(initialEditedSlots);
    } else if (!initialSlots || initialSlots.length === 0) {
      console.log('🔍 TimeRangePicker: No initialSlots provided or empty, clearing state');
      setEditedSlots({});
    }

    // Reset initializing flag after state update
    setTimeout(() => {
      isInitializingRef.current = false;
    }, 0);
  }, [initialSlots]);

  // Notify parent component of changes
  useEffect(() => {
    // Skip notification during initialization to prevent infinite loop
    if (isInitializingRef.current) {
      console.log('🔍 TimeRangePicker: Skipping notification during initialization');
      return;
    }

    const slots = Object.entries(editedSlots)
      .filter(([, times]) => times.length > 0)
      .map(([dateKey, times]) => ({
        date: new Date(dateKey),
        times: times
      }));

    console.log('🔍 TimeRangePicker: Converting to slots format', slots);

    if (onSlotsChangeRef.current) {
      console.log('🔍 TimeRangePicker: Calling onSlotsChange callback');
      onSlotsChangeRef.current(slots);
    }
  }, [editedSlots]); // Removed onSlotsChange from dependencies to prevent infinite loop



  const addTimeSlot = useCallback((dateKey) => {
    setEditedSlots(prev => {
      const currentTimes = prev[dateKey] || [];
      if (currentTimes.length >= 2) {
        alert('Maximum 2 time slots allowed per day');
        return prev;
      }
      const newTime = currentTimes.length === 0 ? "09:00 AM" : "10:00 AM";
      return {
        ...prev,
        [dateKey]: [...currentTimes, newTime]
      };
    });
  }, []);

  const removeTimeSlot = useCallback((dateKey) => {
    setEditedSlots(prev => {
      const newSlots = { ...prev };
      delete newSlots[dateKey];
      return newSlots;
    });
  }, []);

  const updateTimeSlot = useCallback((dateKey, index, newTime) => {
    console.log('🔍 TimeRangePicker: Updating time slot', { dateKey, index, newTime });
    setEditedSlots(prev => {
      const currentTimes = prev[dateKey] || [];
      const newTimes = [...currentTimes];
      newTimes[index] = newTime;
      return {
        ...prev,
        [dateKey]: newTimes
      };
    });
  }, []);

  const getSlotsForDate = (dateString) => {
    return editedSlots[dateString] || [];
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Available Time Ranges
        </label>
        <p className="text-xs text-gray-600 mb-4">
          Set your consultation time slots for the next 7 days. Each day can have up to 2 time slots.
        </p>
      </div>

      {/* Weekly Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const displayTimes = getSlotsForDate(day.dateString);
          const hasSlots = displayTimes.length > 0;

          return (
            <div
              key={day.dateString}
              className={`border rounded-lg p-3 md:w-35 ${
                day.isToday ? 'border-[#7551B2] bg-purple-50' : 'border-gray-200 '
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
                {hasSlots ? (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(day.dateString)}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => addTimeSlot(day.dateString)}
                    className="text-[#7551B2] hover:text-[#6441a0] text-xs px-2 py-1 rounded border border-[#7551B2] hover:bg-purple-50"
                  >
                    Add Slot
                  </button>
                )}
              </div>

              {hasSlots && (
                <div className="space-y-2 md:w-30">
                  {displayTimes.map((time, index) => (
                    <div key={index}>
                      <label className="block text-xs text-gray-600 mb-1">
                        Time Slot {index + 1}
                      </label>
                      <div className="flex items-center  gap-1">
                        <select
                          value={time}
                          onChange={(e) => {
                            console.log('🔍 Time slot changed:', { date: day.dateString, index, value: e.target.value });
                            updateTimeSlot(day.dateString, index, e.target.value);
                          }}
                          className="flex-1 text-xs border border-gray-200 rounded px-1 py-1 focus:border-[#7551B2] focus:outline-none"
                        >
                          {timeOptions.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {displayTimes.length > 1 && (
                          <button
                            onClick={() => {
                              setEditedSlots(prev => {
                                const currentTimes = prev[day.dateString] || [];
                                const newTimes = currentTimes.filter((_, i) => i !== index);
                                return {
                                  ...prev,
                                  [day.dateString]: newTimes
                                };
                              });
                            }}
                            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {displayTimes.length < 2 && (
                    <button
                      onClick={() => addTimeSlot(day.dateString)}
                      className="w-full py-1 px-2 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors"
                    >
                      + Add Another Slot
                    </button>
                  )}

                  <div className="text-center text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded">
                    {displayTimes.join(' • ')}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(editedSlots).length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">
            {Object.keys(editedSlots).length} day{Object.keys(editedSlots).length > 1 ? 's' : ''} configured with time slots
          </p>
          <div className="mt-2 text-xs text-green-600">
            {Object.entries(editedSlots).map(([dateKey, times]) => (
              <div key={dateKey}>
                {new Date(dateKey).toLocaleDateString('en-US', { weekday: 'short' })}: {times.join(' • ')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangePicker;
