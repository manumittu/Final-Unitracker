import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { canteenAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FaPlus, FaEdit, FaTrash, FaShoppingCart, FaDownload, FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CanteenModule = () => {
  const { user, isAdmin } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showVisualizations, setShowVisualizations] = useState(false);

  const [menuFormData, setMenuFormData] = useState({
    itemName: '',
    category: '',
    price: 0,
    availability: true,
    prepTime: '',
    imageUrl: '',
  });

  const [bookingFormData, setBookingFormData] = useState({
    studentId: '',
    name: '',
    canteenLocation: 'Main Canteen',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    foodItem: '',
    quantity: 1,
    paymentMode: 'Cash',
    specialInstructions: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuResponse, bookingsResponse] = await Promise.all([
        canteenAPI.getMenu(),
        canteenAPI.getBookings(),
      ]);
      setMenuItems(menuResponse.data);
      setBookings(bookingsResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuFormData({
      ...menuFormData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    });
  };

  const handleBookingInputChange = (e) => {
    setBookingFormData({ ...bookingFormData, [e.target.name]: e.target.value });
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMenuItem) {
        await canteenAPI.updateMenuItem(editingMenuItem, menuFormData);
      } else {
        await canteenAPI.createMenuItem(menuFormData);
      }
      setShowMenuForm(false);
      setEditingMenuItem(null);
      setMenuFormData({
        itemName: '',
        category: '',
        price: 0,
        availability: true,
        prepTime: '',
        imageUrl: '',
      });
      setError('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save menu item');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await canteenAPI.createBooking(bookingFormData);
      setShowBookingForm(false);
      setSelectedItem(null);
      setBookingFormData({
        studentId: '',
        name: '',
        canteenLocation: 'Main Canteen',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '',
        foodItem: '',
        quantity: 1,
        paymentMode: 'Cash',
        specialInstructions: '',
      });
      setError('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await canteenAPI.deleteMenuItem(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete menu item');
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await canteenAPI.deleteBooking(id);
        fetchData();
      } catch (err) {
        setError('Failed to cancel booking');
      }
    }
  };

  const handleEditMenuItem = (item) => {
    setEditingMenuItem(item._id);
    setMenuFormData({
      itemName: item.itemName,
      category: item.category,
      price: item.price,
      availability: item.availability,
      prepTime: item.prepTime,
      imageUrl: item.imageUrl,
    });
    setShowMenuForm(true);
  };

  const handleOrderItem = (item) => {
    setSelectedItem(item);
    setBookingFormData({
      ...bookingFormData,
      foodItem: item.itemName,
    });
    setShowBookingForm(true);
  };

  // Download order details as text file
  const downloadOrderDetails = () => {
    let content = '';
    
    if (isAdmin()) {
      content = 'All Canteen Orders Report\n';
      content += '='.repeat(50) + '\n\n';
    } else {
      content = 'My Canteen Orders\n';
      content += '='.repeat(50) + '\n\n';
    }
    
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    content += `Total Orders: ${bookings.length}\n\n`;
    
    bookings.forEach((booking, index) => {
      content += `Order ${index + 1}:\n`;
      content += `-`.repeat(30) + '\n';
      content += `Food Item: ${booking.foodItem}\n`;
      content += `Quantity: ${booking.quantity}\n`;
      content += `Canteen Location: ${booking.canteenLocation || 'Main Canteen'}\n`;
      content += `Date: ${new Date(booking.date).toLocaleDateString()}\n`;
      content += `Time Slot: ${booking.timeSlot}\n`;
      
      if (isAdmin() && booking.userId) {
        content += `Ordered By: ${booking.userId.name || booking.name}\n`;
        content += `Email: ${booking.userId.email}\n`;
      } else {
        content += `Name: ${booking.name}\n`;
      }
      
      content += `Payment Mode: ${booking.paymentMode}\n`;
      
      if (booking.specialInstructions) {
        content += `Special Instructions: ${booking.specialInstructions}\n`;
      }
      
      content += '\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `canteen_orders_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Prepare visualization data
  const getVisualizationData = () => {
    // Orders by canteen location
    const locationCounts = {};
    bookings.forEach(booking => {
      const location = booking.canteenLocation || 'Main Canteen';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    
    const locationData = Object.keys(locationCounts).map(location => ({
      name: location,
      value: locationCounts[location]
    }));

    // Orders by food item
    const foodCounts = {};
    bookings.forEach(booking => {
      foodCounts[booking.foodItem] = (foodCounts[booking.foodItem] || 0) + booking.quantity;
    });
    
    const foodData = Object.keys(foodCounts)
      .sort((a, b) => foodCounts[b] - foodCounts[a])
      .slice(0, 10) // Top 10 items
      .map(food => ({
        name: food,
        quantity: foodCounts[food]
      }));

    // Orders by payment mode
    const paymentCounts = {};
    bookings.forEach(booking => {
      paymentCounts[booking.paymentMode] = (paymentCounts[booking.paymentMode] || 0) + 1;
    });
    
    const paymentData = Object.keys(paymentCounts).map(mode => ({
      name: mode,
      value: paymentCounts[mode]
    }));

    // Orders by time slot
    const timeSlotCounts = {};
    bookings.forEach(booking => {
      timeSlotCounts[booking.timeSlot] = (timeSlotCounts[booking.timeSlot] || 0) + 1;
    });
    
    const timeSlotData = Object.keys(timeSlotCounts).map(slot => ({
      name: slot,
      value: timeSlotCounts[slot]
    }));

    return { locationData, foodData, paymentData, timeSlotData };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#D88484'];

  if (loading) {
    return (
      <ModuleLayout title="Canteen Management">
        <div className="text-center py-8">Loading...</div>
      </ModuleLayout>
    );
  }

  // Menu form view
  if (showMenuForm && isAdmin()) {
    return (
      <ModuleLayout title={editingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMenuSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  name="itemName"
                  value={menuFormData.itemName}
                  onChange={handleMenuInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={menuFormData.category}
                  onChange={handleMenuInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select Category</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Juices">Juices</option>
                  <option value="Shakes">Shakes</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Bread Items">Bread Items</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={menuFormData.price}
                  onChange={handleMenuInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prepTime">Preparation Time</Label>
                <Input
                  id="prepTime"
                  name="prepTime"
                  value={menuFormData.prepTime}
                  onChange={handleMenuInputChange}
                  placeholder="e.g., 15 mins"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={menuFormData.imageUrl}
                  onChange={handleMenuInputChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="availability"
                  name="availability"
                  checked={menuFormData.availability}
                  onChange={handleMenuInputChange}
                  className="w-4 h-4"
                />
                <Label htmlFor="availability">Available</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingMenuItem ? 'Update' : 'Add'} Menu Item
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowMenuForm(false);
                    setEditingMenuItem(null);
                    setMenuFormData({
                      itemName: '',
                      category: '',
                      price: 0,
                      availability: true,
                      prepTime: '',
                      imageUrl: '',
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </ModuleLayout>
    );
  }

  // Booking form view
  if (showBookingForm) {
    return (
      <ModuleLayout title="Order Food">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Place Your Order</CardTitle>
            {selectedItem && (
              <CardDescription>
                Ordering: {selectedItem.itemName} - ₹{selectedItem.price}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="studentId">Student/Staff ID</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={bookingFormData.studentId}
                  onChange={handleBookingInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={bookingFormData.name}
                  onChange={handleBookingInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="canteenLocation">Canteen Location *</Label>
                <select
                  id="canteenLocation"
                  name="canteenLocation"
                  value={bookingFormData.canteenLocation}
                  onChange={handleBookingInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="Main Canteen">Main Canteen</option>
                  <option value="Engineering Block Canteen">Engineering Block Canteen</option>
                  <option value="Library Canteen">Library Canteen</option>
                  <option value="Hostel Canteen">Hostel Canteen</option>
                  <option value="Sports Complex Canteen">Sports Complex Canteen</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={bookingFormData.date}
                  onChange={handleBookingInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">Time Slot</Label>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={bookingFormData.timeSlot}
                  onChange={handleBookingInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select Time Slot</option>
                  <option value="Breakfast (8:00 AM - 10:00 AM)">Breakfast (8:00 AM - 10:00 AM)</option>
                  <option value="Lunch (12:00 PM - 2:00 PM)">Lunch (12:00 PM - 2:00 PM)</option>
                  <option value="Snacks (4:00 PM - 6:00 PM)">Snacks (4:00 PM - 6:00 PM)</option>
                  <option value="Dinner (7:00 PM - 9:00 PM)">Dinner (7:00 PM - 9:00 PM)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foodItem">Food Item</Label>
                <Input
                  id="foodItem"
                  name="foodItem"
                  value={bookingFormData.foodItem}
                  onChange={handleBookingInputChange}
                  required
                  readOnly={!!selectedItem}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={bookingFormData.quantity}
                  onChange={handleBookingInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode</Label>
                <select
                  id="paymentMode"
                  name="paymentMode"
                  value={bookingFormData.paymentMode}
                  onChange={handleBookingInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={bookingFormData.specialInstructions}
                  onChange={handleBookingInputChange}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Any special requirements..."
                />
              </div>

              {selectedItem && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="font-semibold">
                    Total: ₹{(selectedItem.price * bookingFormData.quantity).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit">Place Order</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedItem(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </ModuleLayout>
    );
  }

  // Visualizations view
  if (showVisualizations) {
    const vizData = getVisualizationData();
    
    return (
      <ModuleLayout title="Order Analytics">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Order Statistics & Visualizations</h2>
            <Button
              variant="outline"
              onClick={() => setShowVisualizations(false)}
            >
              Back to Orders
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Items Ordered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.reduce((sum, b) => sum + b.quantity, 0)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Canteens</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {new Set(bookings.map(b => b.canteenLocation || 'Main Canteen')).size}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Orders by Canteen Location */}
              {vizData.locationData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Orders by Canteen Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={vizData.locationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {vizData.locationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Top Food Items */}
              {vizData.foodData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top 10 Food Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={vizData.foodData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="quantity" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Orders by Payment Mode */}
              {vizData.paymentData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Orders by Payment Mode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={vizData.paymentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#82ca9d"
                          dataKey="value"
                        >
                          {vizData.paymentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Orders by Time Slot */}
              {vizData.timeSlotData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Orders by Time Slot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={vizData.timeSlotData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No orders available to visualize.
              </CardContent>
            </Card>
          )}
        </div>
      </ModuleLayout>
    );
  }

  // Main view
  return (
    <ModuleLayout title="Canteen Management">
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        {/* Admin Controls */}
        {isAdmin() && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Menu Management</h2>
            <Button onClick={() => setShowMenuForm(true)}>
              <FaPlus className="mr-2" /> Add Menu Item
            </Button>
          </div>
        )}

        {/* Menu Items */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Available Menu Items</h3>
          {menuItems.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No menu items available yet.
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Group items by category */}
              {(() => {
                // Create a map of categories
                const categoryMap = {};
                menuItems.forEach(item => {
                  const category = item.category || 'Uncategorized';
                  if (!categoryMap[category]) {
                    categoryMap[category] = [];
                  }
                  categoryMap[category].push(item);
                });

                // Define category order for better organization
                const categoryOrder = ['Snacks', 'Juices', 'Shakes', 'Non-Veg', 'Bread Items', 'Main Course', 'Beverages', 'Desserts', 'Uncategorized'];
                const sortedCategories = Object.keys(categoryMap).sort((a, b) => {
                  const indexA = categoryOrder.indexOf(a);
                  const indexB = categoryOrder.indexOf(b);
                  if (indexA === -1 && indexB === -1) return a.localeCompare(b);
                  if (indexA === -1) return 1;
                  if (indexB === -1) return -1;
                  return indexA - indexB;
                });

                return sortedCategories.map(category => (
                  <div key={category} className="mb-8">
                    <h4 className="text-lg font-semibold mb-3 text-blue-600">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryMap[category].map((item) => (
                <Card key={item._id} className={!item.availability ? 'opacity-60' : ''}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{item.itemName}</span>
                      <span className="text-green-600 font-bold">₹{item.price}</span>
                    </CardTitle>
                    {item.category && (
                      <CardDescription>{item.category}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {item.prepTime && (
                      <p className="text-sm text-gray-600">
                        <strong>Prep Time:</strong> {item.prepTime}
                      </p>
                    )}
                    <p className={`text-sm ${item.availability ? 'text-green-600' : 'text-red-600'}`}>
                      {item.availability ? '✓ Available' : '✗ Not Available'}
                    </p>

                    <div className="flex gap-2 mt-4">
                      {item.availability && !isAdmin() && (
                        <Button
                          size="sm"
                          onClick={() => handleOrderItem(item)}
                          className="flex-1"
                        >
                          <FaShoppingCart className="mr-2" /> Order
                        </Button>
                      )}
                      {isAdmin() && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditMenuItem(item)}
                          >
                            <FaEdit className="mr-2" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteMenuItem(item._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTrash className="mr-2" /> Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
                    </div>
                  </div>
                ));
              })()}
            </>
          )}
        </div>

        {/* Bookings */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {isAdmin() ? 'All Orders' : 'My Orders'}
            </h3>
            <div className="flex gap-2">
              {bookings.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowVisualizations(true)}
                  >
                    <FaChartPie className="mr-2" /> View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadOrderDetails}
                  >
                    <FaDownload className="mr-2" /> Download Orders
                  </Button>
                </>
              )}
            </div>
          </div>
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No orders yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking._id}>
                  <CardContent className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>Food Item:</strong> {booking.foodItem}</p>
                        <p><strong>Quantity:</strong> {booking.quantity}</p>
                        <p><strong>Canteen:</strong> {booking.canteenLocation || 'Main Canteen'}</p>
                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                        <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
                      </div>
                      <div>
                        {isAdmin() && booking.userId && (
                          <>
                            <p><strong>Ordered By:</strong> {booking.userId.name || booking.name}</p>
                            <p><strong>Email:</strong> {booking.userId.email}</p>
                          </>
                        )}
                        {!isAdmin() && <p><strong>Name:</strong> {booking.name}</p>}
                        <p><strong>Payment:</strong> {booking.paymentMode}</p>
                        {booking.specialInstructions && (
                          <p><strong>Instructions:</strong> {booking.specialInstructions}</p>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="mt-2 text-red-600"
                        >
                          Cancel Order
                        </Button>
                      </div>
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

export default CanteenModule;
