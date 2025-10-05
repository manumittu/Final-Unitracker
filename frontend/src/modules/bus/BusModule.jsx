import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { busAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FaPlus, FaEdit, FaTrash, FaBus, FaTicketAlt, FaDownload } from 'react-icons/fa';

const BusModule = () => {
  const { isAdmin } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeFormData, setRouteFormData] = useState({
    routeName: '',
    from: '',
    to: '',
    departureTime: '',
    availableSeats: '',
    fare: '',
  });
  const [bookingFormData, setBookingFormData] = useState({
    route: '',
    date: '',
    seatsBooked: 1,
  });
  const [error, setError] = useState('');

  const downloadAsTextFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRoute = () => {
    let content = `Bus Route Details\n\n`;
    content += `Route Name: ${routeFormData.routeName}\n`;
    content += `From: ${routeFormData.from}\n`;
    content += `To: ${routeFormData.to}\n`;
    content += `Departure Time: ${routeFormData.departureTime}\n`;
    content += `Available Seats: ${routeFormData.availableSeats}\n`;
    content += `Fare: ${routeFormData.fare}\n`;
    
    const filename = `bus_route_${routeFormData.routeName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    downloadAsTextFile(content, filename);
  };

  const handleDownloadBooking = () => {
    let content = `Bus Booking Details\n\n`;
    content += `Route: ${selectedRoute?.routeName || bookingFormData.route}\n`;
    content += `Date: ${bookingFormData.date}\n`;
    content += `Seats Booked: ${bookingFormData.seatsBooked}\n`;
    if (selectedRoute) {
      content += `From: ${selectedRoute.from}\n`;
      content += `To: ${selectedRoute.to}\n`;
      content += `Departure Time: ${selectedRoute.departureTime}\n`;
      content += `Fare per Seat: ${selectedRoute.fare}\n`;
      content += `Total Fare: ${selectedRoute.fare * bookingFormData.seatsBooked}\n`;
    }
    
    const filename = `bus_booking_${Date.now()}.txt`;
    downloadAsTextFile(content, filename);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [routesResponse, bookingsResponse] = await Promise.all([
        busAPI.getRoutes(),
        busAPI.getBookings(),
      ]);
      setRoutes(routesResponse.data);
      setBookings(bookingsResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteInputChange = (e) => {
    setRouteFormData({ ...routeFormData, [e.target.name]: e.target.value });
  };

  const handleBookingInputChange = (e) => {
    setBookingFormData({ ...bookingFormData, [e.target.name]: e.target.value });
  };

  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRouteId) {
        await busAPI.updateRoute(editingRouteId, routeFormData);
      } else {
        await busAPI.createRoute(routeFormData);
      }
      setShowRouteForm(false);
      setEditingRouteId(null);
      setRouteFormData({
        routeName: '',
        from: '',
        to: '',
        departureTime: '',
        availableSeats: '',
        fare: '',
      });
      setError('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save route');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await busAPI.createBooking(bookingFormData);
      setShowBookingForm(false);
      setSelectedRoute(null);
      setBookingFormData({
        route: '',
        date: '',
        seatsBooked: 1,
      });
      setError('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    }
  };

  const handleEditRoute = (route) => {
    setRouteFormData({
      routeName: route.routeName,
      from: route.from,
      to: route.to,
      departureTime: route.departureTime,
      availableSeats: route.availableSeats.toString(),
      fare: route.fare.toString(),
    });
    setEditingRouteId(route._id);
    setShowRouteForm(true);
  };

  const handleDeleteRoute = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await busAPI.deleteRoute(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete route');
      }
    }
  };

  const handleBookRoute = (route) => {
    setSelectedRoute(route);
    setBookingFormData({
      ...bookingFormData,
      route: route._id,
    });
    setShowBookingForm(true);
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await busAPI.cancelBooking(id);
        fetchData();
      } catch (err) {
        setError('Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return (
      <ModuleLayout title="Bus Reservation">
        <div className="text-center py-8">Loading...</div>
      </ModuleLayout>
    );
  }

  // Route form view
  if (showRouteForm) {
    return (
      <ModuleLayout title={editingRouteId ? 'Edit Route' : 'Add Route'}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{editingRouteId ? 'Edit Route' : 'Add New Route'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRouteSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
              )}

              <div>
                <Label htmlFor="routeName">Route Name</Label>
                <Input
                  id="routeName"
                  name="routeName"
                  value={routeFormData.routeName}
                  onChange={handleRouteInputChange}
                  placeholder="e.g., City Center Express"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    name="from"
                    value={routeFormData.from}
                    onChange={handleRouteInputChange}
                    placeholder="Starting point"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    name="to"
                    value={routeFormData.to}
                    onChange={handleRouteInputChange}
                    placeholder="Destination"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                  id="departureTime"
                  name="departureTime"
                  value={routeFormData.departureTime}
                  onChange={handleRouteInputChange}
                  placeholder="e.g., 8:00 AM"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="availableSeats">Available Seats</Label>
                  <Input
                    id="availableSeats"
                    name="availableSeats"
                    type="number"
                    value={routeFormData.availableSeats}
                    onChange={handleRouteInputChange}
                    placeholder="40"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fare">Fare (₹)</Label>
                  <Input
                    id="fare"
                    name="fare"
                    type="number"
                    value={routeFormData.fare}
                    onChange={handleRouteInputChange}
                    placeholder="50"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-3">
                <div>
                  {routeFormData.routeName && routeFormData.from && routeFormData.to && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDownloadRoute}
                    >
                      <FaDownload className="mr-2" />
                      Download Route
                    </Button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowRouteForm(false);
                      setEditingRouteId(null);
                      setRouteFormData({
                        routeName: '',
                        from: '',
                        to: '',
                        departureTime: '',
                        availableSeats: '',
                        fare: '',
                      });
                      setError('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRouteId ? 'Update Route' : 'Add Route'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </ModuleLayout>
    );
  }

  // Booking form view
  if (showBookingForm && selectedRoute) {
    return (
      <ModuleLayout title="Book Bus Ticket">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Book Ticket</CardTitle>
            <CardDescription>
              {selectedRoute.routeName}: {selectedRoute.from} → {selectedRoute.to}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
              )}

              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Departure Time</p>
                    <p className="font-semibold">{selectedRoute.departureTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fare</p>
                    <p className="font-semibold">₹{selectedRoute.fare}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available Seats</p>
                    <p className="font-semibold">{selectedRoute.availableSeats}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="date">Travel Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={bookingFormData.date}
                  onChange={handleBookingInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="seatsBooked">Number of Seats</Label>
                <Input
                  id="seatsBooked"
                  name="seatsBooked"
                  type="number"
                  value={bookingFormData.seatsBooked}
                  onChange={handleBookingInputChange}
                  min="1"
                  max={selectedRoute.availableSeats}
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{selectedRoute.fare * bookingFormData.seatsBooked}
                  </span>
                </div>
              </div>

              <div className="flex justify-between space-x-3">
                <div>
                  {bookingFormData.date && bookingFormData.seatsBooked && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDownloadBooking}
                    >
                      <FaDownload className="mr-2" />
                      Download Booking
                    </Button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowBookingForm(false);
                      setSelectedRoute(null);
                      setBookingFormData({
                        route: '',
                        date: '',
                        seatsBooked: 1,
                      });
                      setError('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </ModuleLayout>
    );
  }

  // Main view
  return (
    <ModuleLayout title="Bus Reservation">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
        )}

        {/* Available Routes */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Available Routes</h2>
              <p className="text-gray-600">Browse and book bus tickets</p>
            </div>
            {isAdmin() && (
              <Button onClick={() => setShowRouteForm(true)}>
                <FaPlus className="mr-2" />
                Add Route
              </Button>
            )}
          </div>

          {routes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No routes available yet.</p>
                {isAdmin() && (
                  <Button onClick={() => setShowRouteForm(true)} className="mt-4">
                    <FaPlus className="mr-2" />
                    Add First Route
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((route) => (
                <Card key={route._id} className="hover:shadow-lg transition">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaBus className="mr-2 text-blue-600" />
                      {route.routeName}
                    </CardTitle>
                    <CardDescription>
                      {route.from} → {route.to}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departure:</span>
                        <span className="font-semibold">{route.departureTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Seats:</span>
                        <span className="font-semibold">{route.availableSeats}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fare:</span>
                        <span className="font-semibold text-green-600">₹{route.fare}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => handleBookRoute(route)}
                        disabled={route.availableSeats === 0}
                        className="w-full"
                      >
                        <FaTicketAlt className="mr-2" />
                        Book Ticket
                      </Button>
                      {isAdmin() && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => handleEditRoute(route)}
                            className="w-full"
                          >
                            <FaEdit className="mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteRoute(route._id)}
                            className="w-full"
                          >
                            <FaTrash className="mr-2" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* My Bookings */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {isAdmin() ? 'All Bookings' : 'My Bookings'}
            </h2>
            <p className="text-gray-600">View and manage your bookings</p>
          </div>

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No bookings yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking._id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {booking.route?.routeName || 'N/A'}
                        </h3>
                        <p className="text-gray-600">
                          {booking.route?.from} → {booking.route?.to}
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Travel Date</p>
                            <p className="font-semibold">
                              {new Date(booking.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Seats</p>
                            <p className="font-semibold">{booking.seatsBooked}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status</p>
                            <p className={`font-semibold ${
                              booking.status === 'confirmed' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </p>
                          </div>
                          {isAdmin() && booking.user && (
                            <div>
                              <p className="text-gray-600">Booked By</p>
                              <p className="font-semibold">{booking.user.name}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default BusModule;
