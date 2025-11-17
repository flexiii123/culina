import { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { Rating, User } from '../App';

type RatingSectionProps = {
  ratings: Rating[];
  currentUser: User | null;
  onSubmitRating: (rating: number, comment: string) => void;
  onLoginRequired: () => void;
};

export function RatingSection({
  ratings,
  currentUser,
  onSubmitRating,
  onLoginRequired
}: RatingSectionProps) {
  const [newRating, setNewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      onLoginRequired();
      return;
    }

    if (newRating === 0) {
      alert('Bitte wähle eine Bewertung aus');
      return;
    }

    setIsSubmitting(true);
    
    // Simuliert Ajax Request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmitRating(newRating, comment);
    
    // Formular zurücksetzen
    setNewRating(0);
    setComment('');
    setIsSubmitting(false);
  };

  const userHasRated = currentUser && ratings.some(r => r.userId === currentUser.id);

  return (
    <Card>
      <CardHeader>
        <h2>Bewertungen & Kommentare</h2>
      </CardHeader>
      <CardContent>
        {!userHasRated && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-orange-50/50 rounded-xl">
            <h3 className="mb-4">Rezept bewerten</h3>
            
            {!currentUser && (
              <div className="mb-4 p-4 bg-amber-100 border border-amber-300 rounded-lg">
                <p className="text-sm text-amber-800">
                  Du musst angemeldet sein, um dieses Rezept zu bewerten.
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm mb-2">Deine Bewertung</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                  >
                    <Star
                      className={`size-8 transition-colors ${
                        star <= (hoveredRating || newRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm mb-2">
                Kommentar (optional)
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Teile deine Erfahrung mit diesem Rezept..."
                rows={4}
                className="resize-none"
                disabled={!currentUser}
              />
            </div>

            <Button
              type="submit"
              disabled={!currentUser || isSubmitting || newRating === 0}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
            >
              {isSubmitting ? 'Wird gespeichert...' : 'Bewertung abgeben'}
            </Button>
          </form>
        )}

        {userHasRated && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ Du hast dieses Rezept bereits bewertet
            </p>
          </div>
        )}

        <div className="space-y-6">
          {ratings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Star className="size-12 mx-auto mb-4 text-gray-300" />
              <p>Noch keine Bewertungen vorhanden.</p>
              <p className="text-sm">Sei der Erste, der dieses Rezept bewertet!</p>
            </div>
          ) : (
            ratings.map((rating) => (
              <div key={rating.id} className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={rating.userAvatar} alt={rating.userName} />
                  <AvatarFallback>{rating.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span>{rating.userName}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`size-4 ${
                            star <= rating.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-gray-700">{rating.comment}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
