import React, { useState, useEffect } from 'react'
import {
  User,
  FileText,
  CheckSquare,
  MessageCircle,
  Upload,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  Award,
  BookOpen
} from 'lucide-react'
import BlogAdmin from './BlogAdmin'
import ReviewsAdmin from './ReviewsAdmin'

// Mock data for demonstration
const mockProfile = {
  full_name: 'John Smith',
  email: 'john.smith@email.com',
  current_school: 'UNCG',
  target_schools: 'Cornell, NYU, USC',
  current_gpa: '3.7'
}

const mockApplications = [
  {
    id: '1',
    school_name: 'Cornell University',
    application_deadline: '2025-03-15',
    status: 'in_progress'
  },
  {
    id: '2',
    school_name: 'New York University',
    application_deadline: '2025-02-01',
    status: 'submitted'
  },
  {
    id: '3',
    school_name: 'USC',
    application_deadline: '2025-01-15',
    status: 'accepted'
  }
]

const mockDocuments = [
  {
    id: '1',
    title: 'Personal Statement',
    type: 'essay',
    status: 'review'
  },
  {
    id: '2',
    title: 'Transcript',
    type: 'transcript',
    status: 'approved'
  },
  {
    id: '3',
    title: 'Letter of Recommendation',
    type: 'recommendation',
    status: 'needs_revision'
  }
]

const mockTasks = [
  {
    id: '1',
    title: 'Complete Cornell supplemental essays',
    description: 'Write responses to Cornell-specific prompts',
    due_date: '2025-02-15',
    completed: false,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Request transcript from registrar',
    description: 'Official transcript needed for applications',
    due_date: '2025-02-01',
    completed: false,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Schedule meeting with advisor',
    description: 'Discuss transfer timeline and strategy',
    due_date: '2025-01-30',
    completed: true,
    priority: 'low'
  }
]

const Dashboard: React.FC = () => {
  const [profile] = useState(mockProfile)
  const [applications] = useState(mockApplications)
  const [documents] = useState(mockDocuments)
  const [tasks] = useState(mockTasks)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const signOut = () => {
    window.location.href = '/'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100'
      case 'submitted': return 'text-blue-600 bg-blue-100'
      case 'in_progress': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'waitlisted': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img 
                src="/logotransferringup.png" 
                alt="Transferring Up Logo" 
                className="h-10 w-10 rounded-xl"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Transfer Dashboard</h1>
                <p className="text-gray-600">Welcome back, {profile?.full_name}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'applications', label: 'Applications', icon: Target },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare },
              { id: 'messages', label: 'Messages', icon: MessageCircle },
              { id: 'blog', label: 'Blog', icon: BookOpen },
              { id: 'reviews', label: 'Reviews', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <CheckSquare className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => !t.completed).length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Acceptances</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === 'accepted').length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Your Profile
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{profile.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current School</label>
                  <p className="text-gray-900">{profile.current_school}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current GPA</label>
                  <p className="text-gray-900">{profile.current_gpa}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Schools</label>
                  <p className="text-gray-900">{profile.target_schools}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Your Applications
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{app.school_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Deadline:</span>
                        <span className="ml-2 text-gray-900">{new Date(app.application_deadline).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="ml-2 text-gray-900">{app.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Your Documents
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Type:</span>
                      <span className="ml-2 text-gray-900 capitalize">{doc.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-purple-600" />
                Your Tasks
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className={`border border-gray-200 rounded-lg p-6 ${task.completed ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          readOnly
                          className="mt-1 h-4 w-4 text-red-600 rounded"
                        />
                        <div>
                          <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-gray-600 mt-1">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    {task.due_date && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Due:</span>
                        <span className="ml-2 text-gray-900">{new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                Messages
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600 mb-6">Your conversations with consultants will appear here</p>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Your Consultants:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Ajay Sharma (Cornell):</span>
                        <a href="mailto:as4489@cornell.edu" className="text-red-600 hover:underline">
                          as4489@cornell.edu
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Bryan Liu (Notre Dame):</span>
                        <a href="mailto:bryankliu@gmail.com" className="text-red-600 hover:underline">
                          bryankliu@gmail.com
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Bryan's Phone:</span>
                        <a href="tel:+18572455772" className="text-red-600 hover:underline">
                          (857) 245-5772
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Phone/Text:</span>
                        <a href="tel:+19802489218" className="text-red-600 hover:underline">
                          (980) 248-9218
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blog' && <BlogAdmin />}
        {activeTab === 'reviews' && <ReviewsAdmin />}

        {/* Overview Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Applications
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.school_name}</h3>
                        <p className="text-sm text-gray-600">Deadline: {new Date(app.application_deadline).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2 text-purple-600" />
                  Upcoming Tasks
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {tasks.filter(t => !t.completed).slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        {task.due_date && (
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard