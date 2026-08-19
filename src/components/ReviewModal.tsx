import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, product }) => {
  const { addReview, user } = useShop();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [sizePurchased, setSizePurchased] = useState('Size L (Oversized)');
  const [fitFeedback, setFitFeedback] = useState<'True to size' | 'Runs slightly large' | 'Runs small'>('True to size');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      productId: product.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      title: title.trim() || 'Exceptional Quality & Fabric Weight',
      comment: comment.trim(),
      sizePurchased: `${sizePurchased} • ${fitFeedback}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-black font-brand text-white uppercase tracking-wider">
              WRITE A VERIFIED REVIEW
            </h2>
            <p className="text-xs text-zinc-400 truncate max-w-[280px]">{product.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* Star Rating Picker */}
          <div>
            <label className="block text-zinc-400 uppercase mb-1.5">OVERALL RATING</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-zinc-600 hover:text-amber-400 transition"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-white font-bold ml-2">{rating} / 5 Stars</span>
            </div>
          </div>

          {/* Fit Feedback */}
          <div>
            <label className="block text-zinc-400 uppercase mb-1.5">HOW DOES IT FIT?</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Runs small', 'True to size', 'Runs slightly large'] as const).map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setFitFeedback(fit)}
                  className={`py-2 px-1 rounded-xl text-center text-[10px] transition ${
                    fitFeedback === fit
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {/* Size purchased */}
          <div>
            <label className="block text-zinc-400 uppercase mb-1.5">SIZE PURCHASED</label>
            <select
              value={sizePurchased}
              onChange={(e) => setSizePurchased(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white"
            >
              <option value="Size XS">Size XS</option>
              <option value="Size S">Size S</option>
              <option value="Size M">Size M</option>
              <option value="Size L">Size L</option>
              <option value="Size XL">Size XL</option>
              <option value="Size XXL">Size XXL</option>
              <option value="One Size">One Size</option>
            </select>
          </div>

          {/* Review Headline */}
          <div>
            <label className="block text-zinc-400 uppercase mb-1.5">REVIEW HEADLINE</label>
            <input
              type="text"
              placeholder="e.g. Incredible fabric weight & silhouette"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white placeholder-zinc-600"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-zinc-400 uppercase mb-1.5">DETAILED EXPERIENCE</label>
            <textarea
              rows={3}
              required
              placeholder="Tell other streetwear enthusiasts about the fit, collar durability, draping, and finish..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-600 font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-zinc-950 font-black font-mono text-xs rounded-2xl tracking-wider hover:bg-zinc-200 transition shadow-lg"
          >
            SUBMIT VERIFIED REVIEW
          </button>
        </form>
      </div>
    </div>
  );
};
