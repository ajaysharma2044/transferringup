import { useState } from 'react';
import { MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { MetaPixelEvents } from '../lib/metaPixel';
import { submitToHubSpot } from '../lib/hubspot';
import { submitFormWithNotification } from '../lib/formSubmission';

const QuestionForm = () => {
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      submitFormWithNotification({
        name,
        email,
        question,
        source: 'Contact Page Question Form',
      }).catch((err) => console.log('Form submission error:', err));

      submitToHubSpot({
        firstName,
        lastName,
        email,
        question,
      }).catch((err) => console.log('HubSpot submission error:', err));

      MetaPixelEvents.Contact();
      MetaPixelEvents.Lead();

      setIsSubmitted(true);

      setQuestion('');
      setName('');
      setEmail('');

    } catch (err) {
      console.error('Error submitting question:', err);
      setError('There was an error submitting your question. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return question.trim() && name.trim() && email.trim();
  };

  if (isSubmitted) {
    return (
      <div className="bg-forest-50 border border-forest-100 rounded-xl p-6 md:p-8 text-center">
        <CheckCircle className="h-12 w-12 text-forest-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-forest-700 mb-3">
          ✅ Question Submitted!
        </h3>
        <p className="text-forest-600 mb-4">
          Thanks for your question! We'll get back to you within a few hours.
        </p>
        <div className="bg-forest-50 rounded-lg p-4 mb-4">
          <p className="text-forest-600 text-sm">
            <strong>Expect a response:</strong> Usually within 2-4 hours during business hours
          </p>
        </div>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-forest-500 hover:text-forest-600 transition-colors underline text-sm"
        >
          ← Ask another question
        </button>
      </div>
    );
  }

  return (
    <div className="bg-navy-50 border border-navy-100 rounded-xl p-6 md:p-8">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="h-6 w-6 text-navy-500" />
          <h3 className="text-xl md:text-2xl font-bold text-[#1C1C1E]">
            Quick Question?
          </h3>
        </div>
        <p className="text-[#3D3D4E] text-sm md:text-base">
          Have a specific question about transferring? Ask us anything and we'll respond quickly.
        </p>
      </div>

      {error && (
        <div className="bg-crimson-50 border border-crimson-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-crimson-500" />
            <span className="text-crimson-700 font-semibold">Error</span>
          </div>
          <p className="text-crimson-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent text-sm"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
              Your Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent text-sm"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
            Your Question *
          </label>
          <textarea
            required
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent text-sm"
            placeholder="What would you like to know about transferring? Ask about GPA requirements, specific schools, timelines, or anything else..."
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className="w-full bg-navy-500 text-white px-6 py-4 rounded-lg hover:bg-navy-600 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Sending Question...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Send Question</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#3D3D4E]">
          We typically respond within 2-4 hours during business hours
        </p>
      </form>
    </div>
  );
};

export default QuestionForm;