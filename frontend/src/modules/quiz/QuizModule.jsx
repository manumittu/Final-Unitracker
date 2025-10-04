import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { quizAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FaPlus, FaEdit, FaTrash, FaPlay, FaChartBar } from 'react-icons/fa';

const QuizModule = () => {
  const { isAdmin, user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct: 0,
  });
  const [attemptingQuiz, setAttemptingQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [error, setError] = useState('');

  const canCreateQuiz = isAdmin() || user?.role === 'professor';

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getAll();
      setQuizzes(response.data);
    } catch (err) {
      setError('Failed to fetch quizzes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      setError('Please fill in all question fields');
      return;
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, currentQuestion],
    });
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correct: 0,
    });
    setError('');
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.questions.length === 0) {
      setError('Please add at least one question');
      return;
    }
    try {
      if (editingId) {
        await quizAPI.update(editingId, formData);
      } else {
        await quizAPI.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', questions: [] });
      setError('');
      fetchQuizzes();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save quiz');
    }
  };

  const handleEdit = (quiz) => {
    setFormData({
      name: quiz.name,
      questions: quiz.questions,
    });
    setEditingId(quiz._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.delete(id);
        fetchQuizzes();
      } catch (err) {
        setError('Failed to delete quiz');
      }
    }
  };

  const startQuiz = (quiz) => {
    setAttemptingQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizResult(null);
  };

  const selectAnswer = (questionIndex, optionIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < attemptingQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await quizAPI.submitAnswer(attemptingQuiz._id, { answers: userAnswers });
      setQuizResult(response.data);
    } catch (err) {
      setError('Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <ModuleLayout title="Quiz Management">
        <div className="text-center py-8">Loading quizzes...</div>
      </ModuleLayout>
    );
  }

  // Quiz attempt view
  if (attemptingQuiz && !quizResult) {
    const currentQ = attemptingQuiz.questions[currentQuestionIndex];
    return (
      <ModuleLayout title={`Quiz: ${attemptingQuiz.name}`}>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>
              Question {currentQuestionIndex + 1} of {attemptingQuiz.questions.length}
            </CardTitle>
            <CardDescription>{currentQ.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'bg-blue-100 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => selectAnswer(currentQuestionIndex, index)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={userAnswers[currentQuestionIndex] === index}
                      onChange={() => {}}
                      className="mr-3"
                    />
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Previous
              </Button>
              <div className="space-x-2">
                {currentQuestionIndex < attemptingQuiz.questions.length - 1 ? (
                  <Button onClick={nextQuestion}>Next</Button>
                ) : (
                  <Button onClick={submitQuiz}>Submit Quiz</Button>
                )}
              </div>
            </div>
            <Button
              onClick={() => setAttemptingQuiz(null)}
              variant="ghost"
              className="mt-4 w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </ModuleLayout>
    );
  }

  // Quiz result view
  if (quizResult) {
    return (
      <ModuleLayout title="Quiz Result">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold text-blue-600 my-8">
              {quizResult.score} / {quizResult.total}
            </div>
            <div className="text-xl text-gray-600 mb-8">
              Score: {Math.round((quizResult.score / quizResult.total) * 100)}%
            </div>
            <Button onClick={() => {
              setAttemptingQuiz(null);
              setQuizResult(null);
            }}>
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>
      </ModuleLayout>
    );
  }

  // Quiz form view
  if (showForm) {
    return (
      <ModuleLayout title={editingId ? 'Edit Quiz' : 'Create Quiz'}>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
              )}

              <div>
                <Label htmlFor="name">Quiz Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter quiz name"
                  required
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Add Question</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Input
                      id="question"
                      name="question"
                      value={currentQuestion.question}
                      onChange={handleQuestionChange}
                      placeholder="Enter question"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <input
                          type="radio"
                          name="correct"
                          checked={currentQuestion.correct === index}
                          onChange={() => setCurrentQuestion({ ...currentQuestion, correct: index })}
                          className="w-5 h-5"
                        />
                        <Label className="text-sm">Correct</Label>
                      </div>
                    ))}
                  </div>

                  <Button type="button" onClick={addQuestion} variant="outline">
                    Add Question
                  </Button>
                </div>
              </div>

              {formData.questions.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Questions ({formData.questions.length})
                  </h3>
                  <div className="space-y-3">
                    {formData.questions.map((q, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{index + 1}. {q.question}</p>
                              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                {q.options.map((opt, i) => (
                                  <li key={i} className={i === q.correct ? 'text-green-600 font-medium' : ''}>
                                    {i === q.correct && '✓ '}{opt}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(index)}
                            >
                              <FaTrash className="text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', questions: [] });
                    setCurrentQuestion({ question: '', options: ['', '', '', ''], correct: 0 });
                    setError('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update Quiz' : 'Create Quiz'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </ModuleLayout>
    );
  }

  // Quiz list view
  return (
    <ModuleLayout title="Quiz Management">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {canCreateQuiz ? 'Manage Quizzes' : 'Available Quizzes'}
            </h2>
            <p className="text-gray-600">
              {canCreateQuiz
                ? 'Create and manage quizzes for students'
                : 'Attempt quizzes and view your results'}
            </p>
          </div>
          {canCreateQuiz && (
            <Button onClick={() => setShowForm(true)}>
              <FaPlus className="mr-2" />
              Create Quiz
            </Button>
          )}
        </div>

        {quizzes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No quizzes available yet.</p>
              {canCreateQuiz && (
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  <FaPlus className="mr-2" />
                  Create First Quiz
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle>{quiz.name}</CardTitle>
                  <CardDescription>
                    {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <Button onClick={() => startQuiz(quiz)} className="w-full">
                      <FaPlay className="mr-2" />
                      Attempt Quiz
                    </Button>
                    {canCreateQuiz && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(quiz)}
                          className="w-full"
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(quiz._id)}
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
    </ModuleLayout>
  );
};

export default QuizModule;
