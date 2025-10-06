import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { authAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const AccessRequestsModule = () => {
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    if (isAdmin()) {
      fetchRequests();
    }
  }, [filterStatus]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getAccessRequests(filterStatus);
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch access requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await authAPI.updateAccessRequest(userId, 'approved');
      fetchRequests();
      alert('User access approved successfully!');
    } catch (err) {
      setError('Failed to approve user');
      console.error(err);
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm('Are you sure you want to reject this user access request?')) {
      try {
        await authAPI.updateAccessRequest(userId, 'rejected');
        fetchRequests();
        alert('User access rejected');
      } catch (err) {
        setError('Failed to reject user');
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const colors = {
      student: 'bg-blue-100 text-blue-700',
      professor: 'bg-purple-100 text-purple-700',
      admin: 'bg-red-100 text-red-700',
      canteen: 'bg-orange-100 text-orange-700',
      bus: 'bg-teal-100 text-teal-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (!isAdmin()) {
    return (
      <ModuleLayout title="Access Requests">
        <Card>
          <CardContent className="p-8">
            <p className="text-center text-gray-600">
              Access denied. This module is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title="Access Requests">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filterStatus === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({requests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filterStatus === 'approved'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved ({requests.filter(r => r.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filterStatus === 'rejected'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Rejected ({requests.filter(r => r.status === 'rejected').length})
          </button>
          <button
            onClick={() => setFilterStatus('')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filterStatus === ''
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All ({requests.length})
          </button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-8">
              <p className="text-center text-gray-600">Loading access requests...</p>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <p className="text-center text-gray-600">
                No {filterStatus} access requests found.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <Card key={request._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{request.name}</CardTitle>
                      <CardDescription>{request.email}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getRoleBadge(request.role)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Requested:</span>
                        <p className="font-medium">
                          {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {request.status !== 'pending' && (
                        <div>
                          <span className="text-gray-500">Updated:</span>
                          <p className="font-medium">
                            {new Date(request.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={() => handleApprove(request._id)}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(request._id)}
                          variant="destructive"
                          className="flex-1"
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

export default AccessRequestsModule;
