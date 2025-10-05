import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { lostFoundAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FaPlus, FaMapMarkerAlt, FaCalendar, FaPhone, FaDownload } from 'react-icons/fa';

const LostFoundModule = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, lost, found
  const [formData, setFormData] = useState({
    type: 'lost',
    itemName: '',
    description: '',
    location: '',
    date: '',
    contactInfo: '',
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

  const handleDownloadItem = () => {
    let content = `Lost & Found Report\n\n`;
    content += `Type: ${formData.type.toUpperCase()}\n`;
    content += `Item Name: ${formData.itemName}\n`;
    content += `Description: ${formData.description}\n`;
    content += `Location: ${formData.location}\n`;
    content += `Date: ${formData.date}\n`;
    content += `Contact Info: ${formData.contactInfo}\n`;
    
    const filename = `lost_found_${formData.type}_${formData.itemName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    downloadAsTextFile(content, filename);
  };

  const handleDownloadSubmittedItem = (item) => {
    let content = `Lost & Found Report\n\n`;
    content += `Type: ${item.type.toUpperCase()}\n`;
    content += `Item Name: ${item.itemName}\n`;
    content += `Description: ${item.description}\n`;
    content += `Location: ${item.location}\n`;
    content += `Date: ${new Date(item.date).toLocaleDateString()}\n`;
    content += `Contact Info: ${item.contactInfo}\n`;
    content += `Posted By: ${item.postedBy?.name || 'Anonymous'}\n`;
    
    const filename = `lost_found_${item.type}_${item.itemName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    downloadAsTextFile(content, filename);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await lostFoundAPI.getAll();
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await lostFoundAPI.create(formData);
      setShowForm(false);
      setFormData({
        type: 'lost',
        itemName: '',
        description: '',
        location: '',
        date: '',
        contactInfo: '',
      });
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit item');
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  if (loading) {
    return (
      <ModuleLayout title="Lost & Found">
        <div className="text-center py-8">Loading items...</div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title="Lost & Found">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Lost & Found</h2>
            <p className="text-gray-600">Report lost items or claim found items</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <FaPlus className="mr-2" />
            Report Item
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Report Lost/Found Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="lost">Lost Item</option>
                    <option value="found">Found Item</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itemName">Item Name *</Label>
                    <Input
                      id="itemName"
                      name="itemName"
                      value={formData.itemName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Blue backpack"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Library 2nd floor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactInfo">Contact Info *</Label>
                    <Input
                      id="contactInfo"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      required
                      placeholder="Email or phone"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Detailed description of the item..."
                  />
                </div>
                <div className="flex gap-2">
                  {formData.itemName && formData.description && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDownloadItem}
                    >
                      <FaDownload className="mr-2" />
                      Download
                    </Button>
                  )}
                  <Button type="submit">Submit</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Items
          </Button>
          <Button
            variant={filter === 'lost' ? 'default' : 'outline'}
            onClick={() => setFilter('lost')}
          >
            Lost Items
          </Button>
          <Button
            variant={filter === 'found' ? 'default' : 'outline'}
            onClick={() => setFilter('found')}
          >
            Found Items
          </Button>
        </div>

        {/* Items List */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No items reported yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item._id}
                className={`hover:shadow-lg transition-shadow ${
                  item.type === 'lost'
                    ? 'border-l-4 border-l-red-500'
                    : 'border-l-4 border-l-green-500'
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.itemName}</CardTitle>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.type === 'lost'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendar />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone />
                      <span>{item.contactInfo}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                      Posted by: {item.postedBy?.name || 'Anonymous'}
                    </div>
                    <div className="mt-3 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadSubmittedItem(item)}
                        className="w-full"
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

export default LostFoundModule;
