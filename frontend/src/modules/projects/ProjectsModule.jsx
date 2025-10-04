import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { projectAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FaPlus, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const ProjectsModule = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamMembers: '',
    technologies: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
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
      const submitData = {
        ...formData,
        teamMembers: formData.teamMembers.split(',').map((m) => m.trim()),
        technologies: formData.technologies.split(',').map((t) => t.trim()),
      };
      await projectAPI.submit(submitData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        teamMembers: '',
        technologies: '',
      });
      fetchProjects();
      alert('Project submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit project');
    }
  };

  const handleStatusUpdate = async (projectId, status, feedback = '') => {
    try {
      await projectAPI.updateStatus(projectId, { status, feedback });
      fetchProjects();
    } catch (err) {
      setError('Failed to update project status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheck className="text-green-500" />;
      case 'rejected':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded ${colors[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <ModuleLayout title="Project Ideas">
        <div className="text-center py-8">Loading projects...</div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title="Project Ideas">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isAdmin() ? 'Review Project Submissions' : 'My Project Ideas'}
            </h2>
            <p className="text-gray-600">
              {isAdmin()
                ? 'Approve or reject student project submissions'
                : 'Submit your project ideas for approval'}
            </p>
          </div>
          {!isAdmin() && (
            <Button onClick={() => setShowForm(true)}>
              <FaPlus className="mr-2" />
              Submit Project
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
              <CardTitle>Submit Project Idea</CardTitle>
              <CardDescription>
                Share your project idea with details for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="E-commerce Platform"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Detailed description of your project..."
                  />
                </div>
                <div>
                  <Label htmlFor="teamMembers">Team Members *</Label>
                  <Input
                    id="teamMembers"
                    name="teamMembers"
                    value={formData.teamMembers}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe, Jane Smith (comma-separated)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter team member names separated by commas
                  </p>
                </div>
                <div>
                  <Label htmlFor="technologies">Technologies *</Label>
                  <Input
                    id="technologies"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    required
                    placeholder="React, Node.js, MongoDB (comma-separated)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter technologies separated by commas
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Submit Project</Button>
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

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No projects submitted yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Card key={project._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    <div className="ml-4">{getStatusBadge(project.status)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">
                        Team Members:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {project.teamMembers.map((member, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">
                        Technologies:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.feedback && (
                      <div className="pt-2 border-t">
                        <span className="text-sm font-semibold text-gray-600">
                          Admin Feedback:
                        </span>
                        <p className="mt-1 text-sm text-gray-700">
                          {project.feedback}
                        </p>
                      </div>
                    )}
                    <div className="pt-2 border-t text-xs text-gray-500">
                      Submitted by: {project.submittedBy?.name || 'Unknown'}
                      <br />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>

                    {/* Admin Actions */}
                    {isAdmin() && project.status === 'pending' && (
                      <div className="pt-3 border-t flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            const feedback = prompt(
                              'Enter approval feedback (optional):'
                            );
                            handleStatusUpdate(
                              project._id,
                              'approved',
                              feedback || ''
                            );
                          }}
                        >
                          <FaCheck className="mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const feedback = prompt(
                              'Enter rejection reason (optional):'
                            );
                            handleStatusUpdate(
                              project._id,
                              'rejected',
                              feedback || ''
                            );
                          }}
                        >
                          <FaTimes className="mr-2" />
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

export default ProjectsModule;
