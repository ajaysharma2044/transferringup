import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, ExternalLink, User, Pencil, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ReviewItem {
  id: string;
  name: string;
  email: string;
  school_from: string;
  school_to: string;
  schools_accepted: string;
  rating: number;
  review_text: string;
  headshot_url: string;
  is_approved: boolean;
  created_at: string;
}

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Partial<ReviewItem>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const approveReview = async (id: string) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id);

    if (!error) {
      setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: true } : r));
    }
  };

  const rejectReview = async (id: string) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: false })
      .eq('id', id);

    if (!error) {
      setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: false } : r));
    }
  };

  const deleteReview = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Are you sure you want to delete this review permanently?')) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (!error) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const startEditing = (review: ReviewItem) => {
    setEditingId(review.id);
    setEditFields({
      name: review.name,
      review_text: review.review_text,
      school_from: review.school_from,
      school_to: review.school_to,
      schools_accepted: review.schools_accepted,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFields({});
  };

  const saveEdit = async (id: string) => {
    if (!supabase) return;
    setSaving(true);

    const { error } = await supabase
      .from('reviews')
      .update({
        name: editFields.name,
        review_text: editFields.review_text,
        school_from: editFields.school_from,
        school_to: editFields.school_to,
        schools_accepted: editFields.schools_accepted,
      })
      .eq('id', id);

    if (!error) {
      setReviews(reviews.map(r => r.id === id ? { ...r, ...editFields } : r));
      setEditingId(null);
      setEditFields({});
    }
    setSaving(false);
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return !r.is_approved;
    if (filter === 'approved') return r.is_approved;
    return true;
  });

  const pendingCount = reviews.filter(r => !r.is_approved).length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Review Management</h2>
            <p className="text-gray-600 text-sm mt-1">
              {pendingCount} pending {pendingCount === 1 ? 'review' : 'reviews'} awaiting approval
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/submit-review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Review Form Link
            </a>
          </div>
        </div>

        {/* Shareable link */}
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Send this link to clients:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 font-mono">
              {window.location.origin}/submit-review
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/submit-review`)}
              className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-5">
          {(['pending', 'approved', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">No {filter === 'all' ? '' : filter} reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {review.headshot_url ? (
                    <img
                      src={review.headshot_url}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {editingId === review.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                          <input
                            type="text"
                            value={editFields.name || ''}
                            onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-400"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">School From</label>
                            <input
                              type="text"
                              value={editFields.school_from || ''}
                              onChange={(e) => setEditFields({ ...editFields, school_from: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">School To</label>
                            <input
                              type="text"
                              value={editFields.school_to || ''}
                              onChange={(e) => setEditFields({ ...editFields, school_to: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-400"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Schools Accepted</label>
                          <input
                            type="text"
                            value={editFields.schools_accepted || ''}
                            onChange={(e) => setEditFields({ ...editFields, schools_accepted: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Review Text</label>
                          <textarea
                            value={editFields.review_text || ''}
                            onChange={(e) => setEditFields({ ...editFields, review_text: e.target.value })}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-400 resize-y"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => saveEdit(review.id)}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                          >
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{review.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            review.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {review.is_approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{review.email}</p>

                        <div className="flex gap-0.5 mt-2">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`h-4 w-4 ${s <= review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>

                        {(review.school_from || review.school_to) && (
                          <p className="text-sm text-gray-600 mt-2">
                            {review.school_from && review.school_to
                              ? `${review.school_from} → ${review.school_to}`
                              : review.school_to || review.school_from}
                          </p>
                        )}
                        {review.schools_accepted && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Accepted:</span> {review.schools_accepted}
                          </p>
                        )}

                        <p className="text-gray-700 mt-3 leading-relaxed">"{review.review_text}"</p>

                        <p className="text-xs text-gray-400 mt-3">
                          {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {editingId !== review.id && (
                    <button
                      onClick={() => startEditing(review)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  )}
                  {!review.is_approved && editingId !== review.id && (
                    <button
                      onClick={() => approveReview(review.id)}
                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      title="Approve"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  {review.is_approved && editingId !== review.id && (
                    <button
                      onClick={() => rejectReview(review.id)}
                      className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                      title="Unapprove"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  {editingId !== review.id && (
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsAdmin;
