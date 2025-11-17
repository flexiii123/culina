import { useState } from 'react';
import { ArrowLeft, Clock, Star, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RatingSection } from './RatingSection';
import type { Recipe, User, Rating } from '../App';

type RecipeDetailProps = {
  recipe: Recipe;
  currentUser: User | null;
  onBack: () => void;
  onLoginRequired: () => void;
};

export function RecipeDetail({ recipe, currentUser, onBack, onLoginRequired }: RecipeDetailProps) {
  const [ratings, setRatings] = useState<Rating[]>(recipe.ratings);
  const [averageRating, setAverageRating] = useState(recipe.averageRating);

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }

    // Simuliert einen Ajax-Call zum PHP Backend
    // In der echten Anwendung würde hier ein fetch() zu einer PHP-API erfolgen
    const newRating: Rating = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Mock Ajax Request (würde später durch echten PHP API Call ersetzt)
    setTimeout(() => {
      const updatedRatings = [...ratings, newRating];
      setRatings(updatedRatings);
      
      // Durchschnitt neu berechnen
      const sum = updatedRatings.reduce((acc, r) => acc + r.rating, 0);
      const avg = sum / updatedRatings.length;
      setAverageRating(avg);
      
      console.log('Ajax Request würde an PHP Backend gesendet:', {
        recipeId: recipe.id,
        userId: currentUser.id,
        rating: rating,
        comment: comment
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="size-4 mr-2" />
          Zurück zu allen Rezepten
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-orange-600 mb-2">{recipe.title}</h1>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {recipe.difficulty}
              </Badge>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="size-5" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                <span>
                  {averageRating > 0 ? (
                    <>
                      {averageRating.toFixed(1)} ({ratings.length} {ratings.length === 1 ? 'Bewertung' : 'Bewertungen'})
                    </>
                  ) : (
                    'Noch keine Bewertungen'
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
              <Avatar className="h-12 w-12">
                <AvatarImage src={recipe.authorAvatar} alt={recipe.author} />
                <AvatarFallback>{recipe.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-500">Erstellt von</p>
                <p>{recipe.author}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <h2>Zutaten</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 size-2 rounded-full bg-orange-500 flex-shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2>Zubereitung</h2>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p className="pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <RatingSection
          ratings={ratings}
          currentUser={currentUser}
          onSubmitRating={handleRatingSubmit}
          onLoginRequired={onLoginRequired}
        />
      </div>
    </div>
  );
}
