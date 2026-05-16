import { useState } from 'react';
import { Star, Send, CheckCircle, AlertCircle, Camera, X, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SubmitReview = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [hover, setHover] = useState(0);
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [headshotPreview, setHeadshotPreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school_from: '',
    school_to: '',
    schools_accepted: '',
    rating: 0,
    review_text: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5MB.');
      return;
    }

    setHeadshotFile(file);
    setHeadshotPreview(URL.createObjectURL(file));
  };

  const removeHeadshot = () => {
    setHeadshotFile(null);
    setHeadshotPreview('');
  };

  const uploadHeadshot = async (): Promise<string> => {
    if (!headshotFile || !supabase) return '';

    const ext = headshotFile.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('review-headshots')
      .upload(fileName, headshotFile);

    if (uploadError) return '';

    const { data } = supabase.storage
      .from('review-headshots')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (!formData.review_text.trim()) {
      setError('Please write about your experience.');
      return;
    }
    if (!formData.name.trim()) {
      setError('Please enter your first name.');
      return;
    }

    setSubmitting(true);

    if (!supabase) {
      setError('Unable to submit. Please try again later.');
      setSubmitting(false);
      return;
    }

    const headshot_url = await uploadHeadshot();

    const { error: insertError } = await supabase.from('reviews').insert({
      name: formData.name.trim(),
      email: formData.email.trim(),
      school_from: formData.school_from.trim(),
      school_to: formData.school_to.trim(),
      schools_accepted: formData.schools_accepted.trim(),
      rating: formData.rating,
      review_text: formData.review_text.trim(),
      headshot_url,
    });

    if (insertError) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5EDD9] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1C2E] mb-3">Thank you!</h2>
          <p className="text-[#3D3D4E] text-lg leading-relaxed">
            Your review has been submitted successfully. It will appear on our site once our team reviews it.
          </p>
          <a
            href="/"
            className="inline-block mt-8 bg-[#0F1C2E] hover:bg-[#1a2d42] text-[#F5EDD9] px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EDD9]">
      {/* Header */}
      <div className="bg-[#0F1C2E] py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src="/tupng.png" alt="Transferring Up" className="h-10 w-10 object-contain scale-150" />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-[#F5EDD9]">Transferring</span>{' '}
              <span className="text-[#8B1A1A]">Up</span>
            </span>
          </a>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F1C2E] mb-3">
            Share Your Transfer Story
          </h1>
          <p className="text-lg text-[#3D3D4E] max-w-lg mx-auto">
            We'd love to hear about your experience working with TransferringUp. Your review helps future transfer students find us.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 space-y-8">
          {/* Name & Email */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#0F1C2E] border-b border-[#0F1C2E]/10 pb-3">About You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#0F1C2E] font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your first name"
                  className="w-full px-4 py-3.5 bg-[#F5EDD9]/40 border border-[#0F1C2E]/10 rounded-xl text-[#0F1C2E] placeholder-[#3D3D4E]/50 focus:border-[#8B1A1A]/40 focus:ring-2 focus:ring-[#8B1A1A]/10 outline-none transition-all duration-200 text-base"
                />
              </div>
              <div>
                <label className="block text-[#0F1C2E] font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3.5 bg-[#F5EDD9]/40 border border-[#0F1C2E]/10 rounded-xl text-[#0F1C2E] placeholder-[#3D3D4E]/50 focus:border-[#8B1A1A]/40 focus:ring-2 focus:ring-[#8B1A1A]/10 outline-none transition-all duration-200 text-base"
                />
                <p className="text-xs text-[#3D3D4E]/70 mt-1.5">Never shared publicly</p>
              </div>
            </div>

            {/* Headshot Upload */}
            <div>
              <label className="block text-[#0F1C2E] font-medium mb-2">
                Photo <span className="text-[#3D3D4E] font-normal text-sm">(optional)</span>
              </label>
              <p className="text-sm text-[#3D3D4E] mb-3">A headshot or selfie to display with your review</p>

              {headshotPreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={headshotPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#0F1C2E]/10"
                    />
                    <button
                      type="button"
                      onClick={removeHeadshot}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-sm text-[#3D3D4E]">Looking good!</span>
                </div>
              ) : (
                <label className="flex items-center gap-3 px-5 py-4 bg-[#F5EDD9]/40 border-2 border-dashed border-[#0F1C2E]/15 rounded-xl cursor-pointer hover:border-[#8B1A1A]/30 hover:bg-[#F5EDD9]/60 transition-all duration-200">
                  <Camera className="h-6 w-6 text-[#3D3D4E]" />
                  <span className="text-[#3D3D4E] text-base">Upload a photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Schools */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#0F1C2E] border-b border-[#0F1C2E]/10 pb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#8B1A1A]" />
              Your Transfer Journey
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#0F1C2E] font-medium mb-2">Transferred From</label>
                <input
                  type="text"
                  name="school_from"
                  value={formData.school_from}
                  onChange={handleChange}
                  placeholder="e.g. Santa Monica College"
                  className="w-full px-4 py-3.5 bg-[#F5EDD9]/40 border border-[#0F1C2E]/10 rounded-xl text-[#0F1C2E] placeholder-[#3D3D4E]/50 focus:border-[#8B1A1A]/40 focus:ring-2 focus:ring-[#8B1A1A]/10 outline-none transition-all duration-200 text-base"
                />
              </div>
              <div>
                <label className="block text-[#0F1C2E] font-medium mb-2">Attending Now</label>
                <input
                  type="text"
                  name="school_to"
                  value={formData.school_to}
                  onChange={handleChange}
                  placeholder="e.g. Cornell University"
                  className="w-full px-4 py-3.5 bg-[#F5EDD9]/40 border border-[#0F1C2E]/10 rounded-xl text-[#0F1C2E] placeholder-[#3D3D4E]/50 focus:border-[#8B1A1A]/40 focus:ring-2 focus:ring-[#8B1A1A]/10 outline-none transition-all duration-200 text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#0F1C2E] font-medium mb-2">All Schools You Were Accepted To</label>
              <input
                type="text"
                name="schools_accepted"
                value={formData.schools_accepted}
                onChange={handleChange}
                placeholder="e.g. Cornell, NYU, USC, UCLA"
                className="w-full px-4 py-3.5 bg-[#F5EDD9]/40 border border-[#0F1C2E]/10 rounded-xl text-[#0F1C2E] placeholder-[#3D3D4E]/50 focus:border-[#8B1A1A]/40 focus:ring-2 focus:ring-[#8B1A1A]/10 outline-none transition-all duration-200 text-base"
              />
              <p className="text-xs text-[#3D3D4E]/70 mt-1.5">Separate with commas</p>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0F1C2E] border-b border-[#0F1C2E]/10 pb-3">Your Rating *</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="cursor-pointer hover:scale-125 transition-transform duration-200"
                >
                  <Star
                    className={`h-9 w-9 ${
                      star <= (hover || formData.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'
                    } transition-colors duration-150`}
                  />
                </button>
              ))}
            </div>
            {formData.rating > 0 && (
              <p className="text-sm text-[#3D3D4E]">
                {formData.rating === 5 && 'Amazing!'}
                {formData.rating === 4 && 'Great!'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 1 && 'Poor'}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#0F1C2E] border-b border-[#0F1C2E]/10 pb-3">Your Review *</h3>
            <p className="text-sm text-[#3D3D4E]">
              Here are some things you might want to talk about:
            </p>
            <ul className="text-sm text-[#3D3D4E] space-y-1.5 ml-4 list-disc">
              <li>How did TransferringUp help with your transfer process?</li>
              <li>What stood out about working with the team?</li>
              <li>How did you feel when you got your acceptance?</li>
              <li>Would you recommend us to other transfer students?</li>
            </ul>
            <textarea
              name="review_text"
              required
              rows={6}
              value={formData.review_text}
              onChange={handleChange}
              placeholder="Tell us about your experience..."
              className="w-full px-4 py-3.5 bg-[#F5EDD9]/40 border border-[#0F1C2E]/10 rounded-xl text-[#0F1C2E] placeholder-[#3D3D4E]/50 focus:border-[#8B1A1A]/40 focus:ring-2 focus:ring-[#8B1A1A]/10 outline-none transition-all duration-200 resize-none text-base leading-relaxed"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#8B1A1A] hover:bg-[#7A1717] text-[#F5EDD9] py-4 px-8 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#8B1A1A]/15"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Submit My Review
              </>
            )}
          </button>

          <p className="text-center text-sm text-[#3D3D4E]/70">
            Your review will be published after our team approves it.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SubmitReview;
