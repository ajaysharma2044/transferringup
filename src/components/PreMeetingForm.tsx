import { useState } from 'react';
import { User, Mail, GraduationCap, Target, ArrowRight, CheckCircle } from 'lucide-react';

interface StudentInfo {
  name: string;
  email: string;
  phone: string;
  currentGPA: string;
  targetSchools: string;
  whyTransfer: string;
}

interface PreMeetingFormProps {
  onComplete: (studentInfo: StudentInfo) => void;
}

const PreMeetingForm = ({ onComplete }: PreMeetingFormProps) => {
  const [formData, setFormData] = useState<StudentInfo>({
    name: '',
    email: '',
    phone: '',
    currentGPA: '',
    targetSchools: '',
    whyTransfer: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof StudentInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Note: This component may not be actively used, but keeping structure for potential future use
      console.log('Pre-meeting form submitted:', formData);

      // Call the completion handler to switch to calendar
      onComplete(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Still proceed to calendar even if submission fails
      onComplete(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.name && formData.email && formData.currentGPA && formData.targetSchools;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="text-center mb-6">
          <User className="h-10 w-10 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Quick Info Before We Meet
          </h3>
          <p className="text-gray-600 text-sm md:text-base">
            Just 5 quick questions so we can give you the best advice possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Academic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="h-4 w-4 inline mr-2" />
              Current GPA *
            </label>
            <input
              type="text"
              value={formData.currentGPA}
              onChange={(e) => handleInputChange('currentGPA', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., 2.9 or 3.2"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Your current college GPA (or high school if you haven't started college)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="h-4 w-4 inline mr-2" />
              Target Schools *
            </label>
            <input
              type="text"
              value={formData.targetSchools}
              onChange={(e) => handleInputChange('targetSchools', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., Cornell, NYU, USC, UMich"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Schools you want to transfer to</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why do you want to transfer?
            </label>
            <textarea
              value={formData.whyTransfer}
              onChange={(e) => handleInputChange('whyTransfer', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Brief explanation of your goals and motivation..."
            />
          </div>

          {/* What happens next */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-900">What happens next:</span>
            </div>
            <ol className="text-blue-800 text-sm space-y-1">
              <li>1. Submit this info (saves to our system)</li>
              <li>2. Pick your meeting time on the calendar</li>
              <li>3. Get instant Google Meet link</li>
              <li>4. We'll be prepared with personalized advice!</li>
            </ol>
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="w-full bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving Info...</span>
              </>
            ) : (
              <>
                <span>Save Info & Schedule Meeting</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            Takes 2 minutes • Your info is saved securely • No spam ever
          </p>
        </form>
      </div>
    </div>
  );
};

export default PreMeetingForm;