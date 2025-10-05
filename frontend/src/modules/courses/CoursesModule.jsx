import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { coursesAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FaPlus, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CoursesModule = () => {
  const { isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: '',
    department: '',
    description: '',
    instructor: '',
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

  const handleDownloadCourse = () => {
    let content = `Course Details\n\n`;
    content += `Code: ${formData.code}\n`;
    content += `Name: ${formData.name}\n`;
    content += `Credits: ${formData.credits}\n`;
    content += `Department: ${formData.department}\n`;
    content += `Instructor: ${formData.instructor}\n`;
    content += `Description: ${formData.description}\n`;
    
    const filename = `course_${formData.code.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    downloadAsTextFile(content, filename);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getAll();
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
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
      if (editingId) {
        await coursesAPI.update(editingId, formData);
      } else {
        await coursesAPI.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        code: '',
        name: '',
        credits: '',
        department: '',
        description: '',
        instructor: '',
      });
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setFormData({
      code: course.code,
      name: course.name,
      credits: course.credits.toString(),
      department: course.department,
      description: course.description || '',
      instructor: course.instructor || '',
    });
    setEditingId(course._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await coursesAPI.delete(id);
        fetchCourses();
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <ModuleLayout title="Course Management">
        <div className="text-center py-8">Loading courses...</div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title="Course Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isAdmin() ? 'Manage Courses' : 'View Courses'}
            </h2>
            <p className="text-gray-600">
              {isAdmin()
                ? 'Create, edit, or delete courses'
                : 'Browse available courses'}
            </p>
          </div>
          {isAdmin() && (
            <Button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({
                  code: '',
                  name: '',
                  credits: '',
                  department: '',
                  description: '',
                  instructor: '',
                });
              }}
            >
              <FaPlus className="mr-2" />
              Add Course
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Course Statistics Visualization */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Statistics Cards */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{courses.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {courses.reduce((sum, course) => sum + parseInt(course.credits || 0), 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {new Set(courses.map(c => c.department)).size}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {(courses.reduce((sum, course) => sum + parseInt(course.credits || 0), 0) / courses.length).toFixed(1)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Visualization Charts */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart - Credits by Department */}
            <Card>
              <CardHeader>
                <CardTitle>Credits Distribution by Department</CardTitle>
                <CardDescription>Total credits offered per department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        courses.reduce((acc, course) => {
                          const dept = course.department;
                          acc[dept] = (acc[dept] || 0) + parseInt(course.credits || 0);
                          return acc;
                        }, {})
                      ).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Courses per Department */}
            <Card>
              <CardHeader>
                <CardTitle>Courses per Department</CardTitle>
                <CardDescription>Number of courses offered by each department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(
                      courses.reduce((acc, course) => {
                        const dept = course.department;
                        acc[dept] = (acc[dept] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([name, value]) => ({ name, value }))}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Number of Courses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && isAdmin() && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Course' : 'Add New Course'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Course Code *</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      placeholder="CS101"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Course Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Introduction to Programming"
                    />
                  </div>
                  <div>
                    <Label htmlFor="credits">Credits *</Label>
                    <Input
                      id="credits"
                      name="credits"
                      type="number"
                      value={formData.credits}
                      onChange={handleInputChange}
                      required
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      placeholder="Computer Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      placeholder="Dr. Smith"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Course description..."
                  />
                </div>
                <div className="flex gap-2">
                  {formData.code && formData.name && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDownloadCourse}
                    >
                      <FaDownload className="mr-2" />
                      Download
                    </Button>
                  )}
                  <Button type="submit">
                    {editingId ? 'Update Course' : 'Add Course'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Courses List */}
        {courses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No courses available yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Card key={course._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{course.code}</CardTitle>
                      <CardDescription>{course.name}</CardDescription>
                    </div>
                    {isAdmin() && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(course)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(course._id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold">Credits:</span>
                      <span>{course.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Department:</span>
                      <span>{course.department}</span>
                    </div>
                    {course.instructor && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Instructor:</span>
                        <span>{course.instructor}</span>
                      </div>
                    )}
                    {course.description && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-gray-600">{course.description}</p>
                      </div>
                    )}
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

export default CoursesModule;
