import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { timetableAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FaEdit, FaTrash, FaSave, FaPlus } from 'react-icons/fa';

const TimetableModule = () => {
  const { isAdmin } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [customizingTimeSlots, setCustomizingTimeSlots] = useState(false);
  const [timeSlots, setTimeSlots] = useState(['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00']);
  const [newTimeSlot, setNewTimeSlot] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = timeSlots;

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await timetableAPI.get();
      setTimetable(response.data);
      if (response.data) {
        setEditData(response.data);
        // Load custom time slots if available
        if (response.data.timeSlots && response.data.timeSlots.length > 0) {
          setTimeSlots(response.data.timeSlots);
        }
      } else {
        // Initialize empty timetable
        const emptySchedule = {};
        days.forEach(day => {
          emptySchedule[day] = {};
          periods.forEach(period => {
            emptySchedule[day][period] = { subject: '', teacher: '', room: '' };
          });
        });
        setEditData({ schedule: emptySchedule });
      }
    } catch (err) {
      setError('Failed to fetch timetable');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCellChange = (day, period, field, value) => {
    setEditData({
      ...editData,
      schedule: {
        ...editData.schedule,
        [day]: {
          ...editData.schedule[day],
          [period]: {
            ...editData.schedule[day][period],
            [field]: value,
          },
        },
      },
    });
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...editData,
        timeSlots: timeSlots // Save custom time slots
      };
      await timetableAPI.save(dataToSave);
      setTimetable(dataToSave);
      setEditMode(false);
      setCustomizingTimeSlots(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save timetable');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete the timetable?')) {
      try {
        await timetableAPI.delete();
        setTimetable(null);
        const emptySchedule = {};
        days.forEach(day => {
          emptySchedule[day] = {};
          periods.forEach(period => {
            emptySchedule[day][period] = { subject: '', teacher: '', room: '' };
          });
        });
        setEditData({ schedule: emptySchedule });
        setEditMode(false);
      } catch (err) {
        setError('Failed to delete timetable');
      }
    }
  };

  const addTimeSlot = () => {
    if (newTimeSlot && !timeSlots.includes(newTimeSlot)) {
      const newSlots = [...timeSlots, newTimeSlot];
      setTimeSlots(newSlots);
      
      // Update schedule with new time slot for all days
      const updatedSchedule = { ...editData.schedule };
      days.forEach(day => {
        if (!updatedSchedule[day]) updatedSchedule[day] = {};
        updatedSchedule[day][newTimeSlot] = { subject: '', teacher: '', room: '' };
      });
      setEditData({ ...editData, schedule: updatedSchedule });
      setNewTimeSlot('');
    }
  };

  const removeTimeSlot = (slot) => {
    if (timeSlots.length > 1) {
      const newSlots = timeSlots.filter(s => s !== slot);
      setTimeSlots(newSlots);
      
      // Remove time slot from schedule
      const updatedSchedule = { ...editData.schedule };
      days.forEach(day => {
        if (updatedSchedule[day]) {
          delete updatedSchedule[day][slot];
        }
      });
      setEditData({ ...editData, schedule: updatedSchedule });
    } else {
      alert('You must have at least one time slot');
    }
  };

  if (loading) {
    return (
      <ModuleLayout title="Timetable Management">
        <div className="text-center py-8">Loading timetable...</div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title="Timetable Management">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {isAdmin() ? 'Manage Timetable' : 'Class Timetable'}
            </h2>
            <p className="text-gray-600">
              {isAdmin()
                ? 'Create and edit the class timetable'
                : 'View your class schedule'}
            </p>
          </div>
          {isAdmin() && (
            <div className="space-x-2">
              {!editMode ? (
                <>
                  <Button onClick={() => setEditMode(true)}>
                    <FaEdit className="mr-2" />
                    {timetable ? 'Edit' : 'Create'} Timetable
                  </Button>
                  {timetable && (
                    <Button variant="destructive" onClick={handleDelete}>
                      <FaTrash className="mr-2" />
                      Delete
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button onClick={() => setCustomizingTimeSlots(!customizingTimeSlots)}>
                    {customizingTimeSlots ? 'Done with Time Slots' : 'Customize Time Slots'}
                  </Button>
                  <Button onClick={handleSave}>
                    <FaSave className="mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setEditMode(false);
                    setCustomizingTimeSlots(false);
                    if (timetable) {
                      setEditData(timetable);
                      if (timetable.timeSlots && timetable.timeSlots.length > 0) {
                        setTimeSlots(timetable.timeSlots);
                      }
                    }
                  }}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {!timetable && !editMode ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No timetable available yet.</p>
              {isAdmin() && (
                <Button onClick={() => setEditMode(true)} className="mt-4">
                  <FaPlus className="mr-2" />
                  Create Timetable
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {customizingTimeSlots && isAdmin() && editMode && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Customize Time Slots</CardTitle>
                  <CardDescription>Add or remove time periods for your timetable</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., 9:00-10:00 or Morning Session"
                        value={newTimeSlot}
                        onChange={(e) => setNewTimeSlot(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTimeSlot()}
                      />
                      <Button onClick={addTimeSlot}>
                        <FaPlus className="mr-2" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Current Time Slots:</Label>
                      <div className="flex flex-wrap gap-2">
                        {timeSlots.map((slot, index) => (
                          <div key={index} className="flex items-center bg-blue-100 px-3 py-1 rounded">
                            <span className="mr-2">{slot}</span>
                            <button
                              onClick={() => removeTimeSlot(slot)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Day / Period
                      </th>
                      {periods.map((period) => (
                        <th key={period} className="border border-gray-300 p-3 text-center font-semibold">
                          {period}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => (
                      <tr key={day}>
                        <td className="border border-gray-300 p-3 font-semibold bg-gray-50">
                          {day}
                        </td>
                        {periods.map((period) => {
                          const cell = editData.schedule?.[day]?.[period] || { subject: '', teacher: '', room: '' };
                          return (
                            <td key={period} className="border border-gray-300 p-3">
                              {editMode && isAdmin() ? (
                                <div className="space-y-2">
                                  <Input
                                    placeholder="Subject"
                                    value={cell.subject}
                                    onChange={(e) =>
                                      handleCellChange(day, period, 'subject', e.target.value)
                                    }
                                    className="text-sm"
                                  />
                                  <Input
                                    placeholder="Teacher"
                                    value={cell.teacher}
                                    onChange={(e) =>
                                      handleCellChange(day, period, 'teacher', e.target.value)
                                    }
                                    className="text-sm"
                                  />
                                  <Input
                                    placeholder="Room"
                                    value={cell.room}
                                    onChange={(e) =>
                                      handleCellChange(day, period, 'room', e.target.value)
                                    }
                                    className="text-sm"
                                  />
                                </div>
                              ) : (
                                <div className="text-sm">
                                  {cell.subject && (
                                    <>
                                      <div className="font-semibold text-blue-600">{cell.subject}</div>
                                      {cell.teacher && <div className="text-gray-600">{cell.teacher}</div>}
                                      {cell.room && <div className="text-gray-500 text-xs">Room: {cell.room}</div>}
                                    </>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          </>
        )}
      </div>
    </ModuleLayout>
  );
};

export default TimetableModule;
