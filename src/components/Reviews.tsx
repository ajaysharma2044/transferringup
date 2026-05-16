import { useState, useEffect } from 'react';
import { Star, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  name: string;
  school_from: string;
  school_to: string;
  schools_accepted: string;
  rating: number;
  review_text: string;
  headshot_url: string;
  created_at: string;
}

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'} transition-transform duration-200`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (hover || rating) ? 'text-gold-400 fill-current' : 'text-gray-300'
            } transition-colors duration-150`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const dateStr = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-400 group">
      <div className="flex items-start gap-4 mb-4">
        {review.headshot_url ? (
          <img
            src={review.headshot_url}
            alt={review.name}
            className="w-12 h-12 rounded-full object-cover border border-white/20 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <span className="text-white/60 font-semibold text-lg">{review.name.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold">{review.name}</h4>
            <span className="text-gray-500 text-xs flex-shrink-0">{dateStr}</span>
          </div>
          {(review.school_from || review.school_to) && (
            <p className="text-gray-400 text-sm mt-0.5">
              {review.school_from && review.school_to
                ? `${review.school_from} → ${review.school_to}`
                : review.school_to || review.school_from}
            </p>
          )}
        </div>
      </div>

      <StarRating rating={review.rating} />

      <p className="text-gray-300 text-sm leading-relaxed mt-3 italic">
        "{review.review_text}"
      </p>

      {review.schools_accepted && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Accepted to</p>
          <div className="flex flex-wrap gap-1.5">
            {review.schools_accepted.split(',').map((school, i) => (
              <span key={i} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                {school.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school_from: '',
    school_to: '',
    rating: 0,
    review_text: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('id, name, school_from, school_to, schools_accepted, rating, review_text, headshot_url, created_at')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (!formData.review_text.trim()) {
      setError('Please write a review.');
      return;
    }

    setSubmitting(true);

    if (!supabase) {
      setError('Unable to submit. Please try again later.');
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('reviews').insert({
      name: formData.name.trim(),
      email: formData.email.trim(),
      school_from: formData.school_from.trim(),
      school_to: formData.school_to.trim(),
      rating: formData.rating,
      review_text: formData.review_text.trim(),
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

  return (
    <section id="reviews" className="py-12 sm:py-16 md:py-24 bg-[#0D1B2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 scroll-fade-in">
          <div className="inline-flex items-center px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm font-medium mb-6 badge-shimmer">
            <MessageCircle className="h-4 w-4 mr-2" />
            Client Reviews
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            What Our Clients Say
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Real feedback from students and families who trusted us with their transfer journey.
          </p>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 grid-stagger">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No reviews yet. Be the first to share your experience.</p>
          </div>
        )}

        {/* Leave a Review CTA / Form */}
        <div className="mt-12 sm:mt-16 max-w-2xl mx-auto scroll-fade-in">
          {!showForm && !submitted ? (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1717] text-[#F5EDD9] px-8 py-3.5 rounded-xl font-semibold text-base btn-magnetic"
              >
                <Send className="h-4 w-4" />
                Leave a Review
              </button>
              <p className="text-gray-500 text-sm mt-3">
                Were you a TransferringUp client? Share your experience.
              </p>
            </div>
          ) : submitted ? (
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">Thank you for your review!</h3>
              <p className="text-gray-400">
                Your review has been submitted and will appear on the site once approved.
              </p>
            </div>
          ) : (
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8">
              <h3 className="text-white text-xl font-bold mb-6 text-center">Share Your Experience</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@email.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">School You Transferred From</label>
                    <input
                      type="text"
                      name="school_from"
                      value={formData.school_from}
                      onChange={handleChange}
                      placeholder="e.g. Community College"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">School You Transferred To</label>
                    <input
                      type="text"
                      name="school_to"
                      value={formData.school_to}
                      onChange={handleChange}
                      placeholder="e.g. Cornell University"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Rating *</label>
                  <StarRating rating={formData.rating} onRate={(r) => setFormData({ ...formData, rating: r })} interactive />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">Your Review *</label>
                  <textarea
                    name="review_text"
                    required
                    rows={4}
                    value={formData.review_text}
                    onChange={handleChange}
                    placeholder="Tell us about your experience working with TransferringUp..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-all duration-200 resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1717] text-[#F5EDD9] px-7 py-3 rounded-xl font-semibold text-sm btn-magnetic disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-gray-500 text-xs">
                  Your email is kept private. Reviews are displayed publicly after approval.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
