import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { feedbackAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FaPlus, FaStar, FaDownload } from 'react-icons/fa';

const FeedbackModule = () => {
  const { isAdmin } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    facultyName: '',
    subject: '',
    rating: '5',
    comments: '',
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

  const handleDownloadFeedback = () => {
    let content = `Faculty Feedback\n\n`;
    content += `Faculty Name: ${formData.facultyName}\n`;
    content += `Subject: ${formData.subject}\n`;
    content += `Rating: ${formData.rating}/5\n`;
    content += `Comments: ${formData.comments}\n`;
    
    const filename = `feedback_${formData.facultyName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    downloadAsTextFile(content, filename);
  };

  useEffect(() => {
    if (isAdmin()) {
      fetchFeedbacks();
    }
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAll();
      setFeedbacks(response.data);
    } catch (err) {
      setError('Failed to fetch feedback');
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
      await feedbackAPI.submit(formData);
      setShowForm(false);
      setFormData({
        facultyName: '',
        subject: '',
        rating: '5',
        comments: '',
      });
      alert('Feedback submitted successfully!');
      if (isAdmin()) {
        fetchFeedbacks();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <ModuleLayout title="Faculty Feedback">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isAdmin() ? 'View All Feedback' : 'Submit Faculty Feedback'}
            </h2>
            <p className="text-gray-600">
              {isAdmin()
                ? 'Review feedback submitted by students'
                : 'Share your feedback about faculty members'}
            </p>
          </div>
          {!isAdmin() && (
            <Button onClick={() => setShowForm(true)}>
              <FaPlus className="mr-2" />
              Submit Feedback
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Form (for students) */}
        {showForm && !isAdmin() && (
          <Card>
            <CardHeader>
              <CardTitle>Submit Faculty Feedback</CardTitle>
              <CardDescription>
                Your feedback helps us improve the quality of education
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facultyName">Faculty Name *</Label>
                    <Input
                      id="facultyName"
                      name="facultyName"
                      value={formData.facultyName}
                      onChange={handleInputChange}
                      required
                      placeholder="Dr. Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="rating">Rating (1-5) *</Label>
                  <div className="flex items-center gap-4">
                    <input
                      id="rating"
                      name="rating"
                      type="range"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold">{formData.rating}</span>
                  </div>
                  <div className="mt-2">{renderStars(parseInt(formData.rating))}</div>
                </div>
                <div>
                  <Label htmlFor="comments">Comments</Label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Your feedback..."
                  />
                </div>
                <div className="flex gap-2">
                  {formData.facultyName && formData.subject && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDownloadFeedback}
                    >
                      <FaDownload className="mr-2" />
                      Download
                    </Button>
                  )}
                  <Button type="submit">Submit Feedback</Button>
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

        {/* View Feedbacks (for admins) */}
        {isAdmin() && (
          <>
            {loading ? (
              <div className="text-center py-8">Loading feedback...</div>
            ) : feedbacks.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No feedback submitted yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedbacks.map((feedback) => (
                  <Card key={feedback._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{feedback.facultyName}</CardTitle>
                      <CardDescription>{feedback.subject}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-semibold text-gray-600">
                            Rating:
                          </span>
                          <div className="mt-1">{renderStars(feedback.rating)}</div>
                        </div>
                        {feedback.comments && (
                          <div>
                            <span className="text-sm font-semibold text-gray-600">
                              Comments:
                            </span>
                            <p className="mt-1 text-sm text-gray-700">
                              {feedback.comments}
                            </p>
                          </div>
                        )}
                        <div className="pt-2 border-t text-xs text-gray-500">
                          Submitted by: {feedback.submittedBy?.name || 'Anonymous'}
                          <br />
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Success message for non-admin users */}
        {!isAdmin() && !showForm && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600 mb-4">
                Click the "Submit Feedback" button to share your feedback about faculty members.
              </p>
              <p className="text-sm text-gray-500">
                Your feedback is anonymous and helps improve the quality of education.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ModuleLayout>
  );
};

export default FeedbackModule;
