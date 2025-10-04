import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { gradeAppealAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FaPlus } from 'react-icons/fa';

const GradeAppealModule = () => {
  const { isAdmin } = useAuth();
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    currentGrade: '',
    expectedGrade: '',
    reason: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppeals();
  }, []);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const response = await gradeAppealAPI.getAll();
      setAppeals(response.data);
    } catch (err) {
      setError('Failed to fetch appeals');
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
      await gradeAppealAPI.submit(formData);
      setShowForm(false);
      setFormData({
        courseName: '',
        currentGrade: '',
        expectedGrade: '',
        reason: '',
      });
      fetchAppeals();
      alert('Grade appeal submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit appeal');
    }
  };

  const handleStatusUpdate = async (appealId, status, adminResponse = '') => {
    try {
      await gradeAppealAPI.updateStatus(appealId, { status, adminResponse });
      fetchAppeals();
    } catch (err) {
      setError('Failed to update appeal status');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      under_review: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded ${colors[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <ModuleLayout title="Grade Appeals">
        <div className="text-center py-8">Loading appeals...</div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title="Grade Appeals">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isAdmin() ? 'Review Grade Appeals' : 'My Grade Appeals'}
            </h2>
            <p className="text-gray-600">
              {isAdmin()
                ? 'Review and respond to student grade appeals'
                : 'Submit grade appeal requests'}
            </p>
          </div>
          {!isAdmin() && (
            <Button onClick={() => setShowForm(true)}>
              <FaPlus className="mr-2" />
              Submit Appeal
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Form */}
        {showForm && !isAdmin() && (
          <Card>
            <CardHeader>
              <CardTitle>Submit Grade Appeal</CardTitle>
              <CardDescription>
                Request a review of your grade with detailed reasoning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="courseName">Course Name *</Label>
                    <Input
                      id="courseName"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleInputChange}
                      required
                      placeholder="Data Structures"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentGrade">Current Grade *</Label>
                    <Input
                      id="currentGrade"
                      name="currentGrade"
                      value={formData.currentGrade}
                      onChange={handleInputChange}
                      required
                      placeholder="B"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedGrade">Expected Grade *</Label>
                    <Input
                      id="expectedGrade"
                      name="expectedGrade"
                      value={formData.expectedGrade}
                      onChange={handleInputChange}
                      required
                      placeholder="A"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason for Appeal *</Label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Explain why you believe your grade should be reconsidered..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Submit Appeal</Button>
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

        {/* Appeals List */}
        {appeals.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No grade appeals submitted yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {appeals.map((appeal) => (
              <Card key={appeal._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{appeal.courseName}</CardTitle>
                      <CardDescription>
                        {appeal.currentGrade} → {appeal.expectedGrade}
                      </CardDescription>
                    </div>
                    <div className="ml-4">{getStatusBadge(appeal.status)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">
                        Reason:
                      </span>
                      <p className="mt-1 text-sm text-gray-700">{appeal.reason}</p>
                    </div>
                    {appeal.adminResponse && (
                      <div className="pt-2 border-t">
                        <span className="text-sm font-semibold text-gray-600">
                          Admin Response:
                        </span>
                        <p className="mt-1 text-sm text-gray-700">
                          {appeal.adminResponse}
                        </p>
                      </div>
                    )}
                    <div className="pt-2 border-t text-xs text-gray-500">
                      Submitted by: {appeal.submittedBy?.name || 'Unknown'}
                      <br />
                      {new Date(appeal.createdAt).toLocaleDateString()}
                    </div>

                    {/* Admin Actions */}
                    {isAdmin() && appeal.status === 'pending' && (
                      <div className="pt-3 border-t space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            handleStatusUpdate(appeal._id, 'under_review')
                          }
                        >
                          Mark as Under Review
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              const response = prompt(
                                'Enter response to student:'
                              );
                              if (response) {
                                handleStatusUpdate(
                                  appeal._id,
                                  'approved',
                                  response
                                );
                              }
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => {
                              const response = prompt(
                                'Enter reason for rejection:'
                              );
                              if (response) {
                                handleStatusUpdate(
                                  appeal._id,
                                  'rejected',
                                  response
                                );
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                    {isAdmin() && appeal.status === 'under_review' && (
                      <div className="pt-3 border-t flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const response = prompt('Enter response to student:');
                            if (response) {
                              handleStatusUpdate(
                                appeal._id,
                                'approved',
                                response
                              );
                            }
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => {
                            const response = prompt('Enter reason for rejection:');
                            if (response) {
                              handleStatusUpdate(
                                appeal._id,
                                'rejected',
                                response
                              );
                            }
                          }}
                        >
                          Reject
                        </Button>
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

export default GradeAppealModule;
