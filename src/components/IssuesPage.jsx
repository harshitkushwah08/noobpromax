import React, { useState } from 'react';
import { Search, Filter, Eye, Calendar, MapPin, User, Phone, AlertCircle, Clock, RotateCcw, CheckCircle2 } from 'lucide-react';
import AssignDepartmentModal from './AssignDepartmentModal';
import IssueProgressModal from './IssueProgressModal';

const IssuesPage = ({ issues, departments, onAssignDepartment, onUpdateIssueStatus, language, translations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showReopenConfirm, setShowReopenConfirm] = useState(false);
  const [issueToReopen, setIssueToReopen] = useState(null);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.complaintNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-red-600 bg-red-100';
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      high: translations.high,
      medium: translations.medium,
      low: translations.low
    };
    return labels[priority] || priority;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: translations.pending,
      assigned: translations.assigned,
      'in-progress': translations.inProgress,
      completed: translations.completed
    };
    return labels[status] || status;
  };

  const handleAssignDepartment = (issueId, departmentIds) => {
    onAssignDepartment(issueId, departmentIds);
    setShowAssignModal(false);
    setSelectedIssue(null);
  };

  const handleReopenIssue = (issue) => {
    setIssueToReopen(issue);
    setShowReopenConfirm(true);
  };

  const confirmReopenIssue = () => {
    if (issueToReopen) {
      onUpdateIssueStatus(issueToReopen.id, 'pending');
      setShowReopenConfirm(false);
      setIssueToReopen(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {translations.issueManagement}
        </h2>
        <p className="text-gray-600">{translations.issueManagementDesc}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={translations.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{translations.allStatus}</option>
            <option value="pending">{translations.pending}</option>
            <option value="assigned">{translations.assigned}</option>
            <option value="in-progress">{translations.inProgress}</option>
            <option value="completed">{translations.completed}</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
           <option value="all">{translations.allPriority}</option>
           <option value="high">{translations.high}</option>
           <option value="medium">{translations.medium}</option>
           <option value="low">{translations.low}</option>
          </select>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Issue Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {issue.complaintNumber}
                </h3>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                    {getPriorityLabel(issue.priority)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                    {getStatusLabel(issue.status)}
                  </span>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-2">{issue.title}</h4>
              <p className="text-gray-600 text-sm line-clamp-2">{issue.description}</p>
            </div>

            {/* Issue Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User size={16} />
                <span>{issue.userName}</span>
                <Phone size={16} className="ml-4" />
                <span>{issue.userPhone}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span className="line-clamp-1">{issue.location.address}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>{translations.created}: {new Date(issue.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</span>
              </div>
              
              {issue.completedAt && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle2 size={16} />
                  <span>{language === 'hi' ? 'पूर्ण:' : 'Completed:'} {new Date(issue.completedAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</span>
                </div>
              )}

              {/* Assigned Departments */}
              {issue.assignedDepartments.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {translations.assignedDepartments}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {issue.assignedDepartments.map((deptId) => {
                      const dept = departments.find(d => d.id === deptId);
                      return dept ? (
                        <span key={deptId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {dept.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedIssue(issue);
                    setShowProgressModal(true);
                  }}
                  className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Clock size={16} />
                  <span>{language === 'hi' ? 'प्रगति' : 'Progress'}</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedIssue(issue);
                    setShowAssignModal(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {translations.assignDepartment}
                </button>
                
                {issue.status === 'assigned' || issue.status === 'in-progress' ? (
                  <button
                    onClick={() => onUpdateIssueStatus(issue.id, 'completed')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {translations.markComplete}
                  </button>
                ) : issue.status === 'completed' ? (
                  <button
                    onClick={() => handleReopenIssue(issue)}
                    className="flex items-center space-x-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <RotateCcw size={16} />
                    {translations.reopen}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{translations.noIssuesFound}</h3>
          <p className="text-gray-500">{translations.noIssuesFoundDesc}</p>
        </div>
      )}

      {/* Assign Department Modal */}
      {showAssignModal && selectedIssue && (
        <AssignDepartmentModal
          issue={selectedIssue}
          departments={departments}
          onAssign={handleAssignDepartment}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedIssue(null);
          }}
          language={language}
          translations={translations}
        />
      )}

      {/* Progress Modal */}
      {showProgressModal && selectedIssue && (
        <IssueProgressModal
          issue={selectedIssue}
          onClose={() => {
            setShowProgressModal(false);
            setSelectedIssue(null);
          }}
          language={language}
          translations={translations}
        />
      )}

      {/* Reopen Confirmation Modal */}
      {showReopenConfirm && issueToReopen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
            <div className="flex items-center space-x-3 mb-4">
              <RotateCcw className="h-8 w-8 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-800">
                {language === 'hi' ? 'शिकायत पुनः खोलें' : 'Reopen Issue'}
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>{language === 'hi' ? 'शिकायत:' : 'Issue:'}</strong> {issueToReopen.complaintNumber}
              </p>
              <p className="text-sm text-gray-800 font-medium mb-4">{issueToReopen.title}</p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  {language === 'hi' 
                    ? 'क्या आप वाकई इस पूर्ण हुई शिकायत को पुनः खोलना चाहते हैं? यह शिकायत को लंबित स्थिति में वापस कर देगा।'
                    : 'Are you sure you want to reopen this completed issue? This will move the issue back to pending status.'
                  }
                </p>
              </div>
            </div>
    </div>
  );
};

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowReopenConfirm(false);
                  setIssueToReopen(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={confirmReopenIssue}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                {language === 'hi' ? 'पुनः खोलें' : 'Reopen'}
              </button>
            </div>
          </div>
        </div>
      )}
export default IssuesPage;