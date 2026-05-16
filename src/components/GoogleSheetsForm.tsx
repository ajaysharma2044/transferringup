import { useState } from 'react';
import { User, Mail, Phone, Video, CheckCircle, ArrowRight, Send, AlertCircle, GraduationCap, Award, Target, FileText, DollarSign } from 'lucide-react';
import { MetaPixelEvents } from '../lib/metaPixel';
import { submitToHubSpot } from '../lib/hubspot';
import { submitFormWithNotification } from '../lib/formSubmission';

interface FormData {
  name: string;
  email: string;
  phone: string;
  highSchoolGPA: string;
  collegeGPA: string;
  targetSchools: string;
  testScore: string;
  financialAid: string;
  message: string;
}

interface GoogleSheetsFormProps {
  onComplete?: (formData: FormData) => void;
}

const GoogleSheetsForm = ({ onComplete }: GoogleSheetsFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    highSchoolGPA: '',
    collegeGPA: '',
    targetSchools: '',
    testScore: '',
    financialAid: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setDebugInfo('Starting submission...');

    try {
      setDebugInfo('Submitting...');

      submitFormWithNotification({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        highSchoolGPA: formData.highSchoolGPA,
        collegeGPA: formData.collegeGPA,
        targetSchools: formData.targetSchools,
        testScore: formData.testScore,
        financialAid: formData.financialAid,
        message: formData.message,
        source: 'Website Form',
      }).catch((err) => console.log('Form submission error:', err));

      MetaPixelEvents.Lead();
      MetaPixelEvents.Contact();

      const [firstName, ...lastNameParts] = formData.name.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      submitToHubSpot({
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        highSchoolGPA: formData.highSchoolGPA,
        collegeGPA: formData.collegeGPA,
        targetSchools: formData.targetSchools,
        message: formData.message,
      }).catch((err) => console.log('HubSpot submission error:', err));

      setDebugInfo('Submitted successfully');

      if (onComplete) {
        onComplete(formData);
      } else {
        setIsSubmitted(true);
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        highSchoolGPA: '',
        collegeGPA: '',
        targetSchools: '',
        testScore: '',
        financialAid: '',
        message: ''
      });

    } catch (err) {
      console.error('Error submitting form:', err);
      setError('There was an error submitting your request. Please try again or contact us directly.');
      setDebugInfo(prev => prev + '\n❌ Error: ' + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.name && formData.email;
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg max-w-3xl mx-auto border border-gray-200">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            ✅ Information Submitted Successfully!
          </h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Thank you for telling us about your situation! We'll be in touch within 24 hours to schedule your consultation.
          </p>
          
          <div className="bg-green-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h4 className="font-semibold text-green-900 mb-3 sm:mb-4 text-sm sm:text-base">✅ What just happened:</h4>
            <div className="space-y-2 sm:space-y-3 text-green-800 text-xs sm:text-sm text-left">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <p><strong>Your information saved:</strong> Securely stored in our system for consultation preparation</p>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <p><strong>Team Notified:</strong> Ajay received instant email notification</p>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <p><strong>Consultation Scheduling:</strong> We'll reach out within 24 hours to coordinate your meeting</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h4 className="font-semibold text-blue-900 mb-2 sm:mb-3 text-sm sm:text-base">📧 Response Timeline:</h4>
            <div className="text-blue-800 text-xs sm:text-sm space-y-1 sm:space-y-2">
              <p>• <strong>Within 4 hours:</strong> Initial acknowledgment email</p>
              <p>• <strong>Within 24 hours:</strong> Consultation scheduling coordination</p>
              <p>• <strong>Urgent matters:</strong> Text Ajay at (980) 248-9218</p>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Need immediate assistance?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <a
                href="mailto:as4489@cornell.edu"
                className="bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-red-700 transition-colors text-center font-medium text-sm"
              >
                📧 Email Ajay
              </a>
              <a
                href="tel:+19802489218"
                className="bg-green-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-medium text-sm"
              >
                📱 Call/Text Ajay
              </a>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors underline text-sm"
            >
              ← Submit another request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg max-w-4xl mx-auto border border-gray-200">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <Video className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            📝 Tell Us About Your Situation
          </h3>
        </div>
        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
          Help us prepare for your consultation by sharing your academic background, goals, and challenges. This ensures we can give you the most personalized advice possible.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="font-semibold text-blue-900 text-sm sm:text-base">Why we collect this information:</span>
          </div>
          <ul className="text-blue-800 text-xs sm:text-sm text-left space-y-1">
            <li>• Prepare personalized school recommendations</li>
            <li>• Understand your unique transfer story</li>
            <li>• Focus on your specific challenges and goals</li>
            <li>• Make the most of our 60-minute consultation</li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            <span className="text-red-800 font-semibold text-sm sm:text-base">Submission Error</span>
          </div>
          <p className="text-red-700 text-xs sm:text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Academic Information - Both GPAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
              High School GPA
            </label>
            <input
              type="text"
              name="highSchoolGPA"
              value={formData.highSchoolGPA}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              placeholder="e.g., 2.9, 3.2"
            />
            <p className="text-xs text-gray-500 mt-1">Your final high school GPA</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
              College GPA
            </label>
            <input
              type="text"
              name="collegeGPA"
              value={formData.collegeGPA}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              placeholder="e.g., 3.5, 3.8"
            />
            <p className="text-xs text-gray-500 mt-1">Your current college GPA (if applicable)</p>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
              Target Schools
            </label>
            <input
              type="text"
              name="targetSchools"
              value={formData.targetSchools}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Cornell, NYU, USC, UMich, etc."
            />
            <p className="text-xs text-gray-500 mt-1">Schools you want to transfer to</p>
          </div>
        </div>

        {/* Test Score & Financial Aid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
              Test Score (SAT/ACT)
            </label>
            <input
              type="text"
              name="testScore"
              value={formData.testScore}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              placeholder="e.g., SAT 1400, ACT 32"
            />
            <p className="text-xs text-gray-500 mt-1">Include test type and score</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
              Applying for Financial Aid?
            </label>
            <select
              name="financialAid"
              value={formData.financialAid}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">Select one</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Not Sure">Not Sure</option>
            </select>
          </div>
        </div>

        {/* Additional Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tell us about your situation
          </label>
          <textarea
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
            placeholder="What challenges are you facing? What are your goals? Any specific questions?"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className="w-full bg-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base sm:text-lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
              <span>Saving Your Information...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Submit Information</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </>
          )}
        </button>

        {/* Help Text */}
        <div className="text-center text-xs sm:text-sm text-gray-500">
          <p>Questions? Email <a href="mailto:as4489@cornell.edu" className="text-red-600 hover:underline">as4489@cornell.edu</a> or text <a href="tel:+19802489218" className="text-red-600 hover:underline">(980) 248-9218</a></p>
        </div>
      </form>
    </div>
  );
};

export default GoogleSheetsForm;