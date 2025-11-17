import { Clock, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Recipe } from '../App';

const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Klassische Pasta Carbonara',
    description: 'Cremige italienische Pasta mit Speck, Ei und Parmesan - ein zeitloser Klassiker!',
    image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3NjI5MzExNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Anna Schmidt',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    cookTime: '25 Min',
    difficulty: 'Mittel',
    ingredients: [
      '400g Spaghetti',
      '200g Guanciale oder Speck',
      '4 Eigelb',
      '100g Pecorino Romano',
      'Schwarzer Pfeffer',
      'Salz'
    ],
    instructions: [
      'Pasta in Salzwasser al dente kochen',
      'Speck in Würfel schneiden und knusprig braten',
      'Eigelb mit geriebenem Käse vermischen',
      'Pasta mit Speck und Ei-Käse-Mischung vermengen',
      'Mit Pfeffer würzen und servieren'
    ],
    ratings: [
      {
        id: 1,
        userId: 2,
        userName: 'Thomas Müller',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
        rating: 5,
        comment: 'Absolut perfekt! Genau wie in Italien.',
        createdAt: '2024-03-10'
      },
      {
        id: 2,
        userId: 3,
        userName: 'Lisa Weber',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        rating: 4,
        comment: 'Sehr lecker, aber ich hätte mehr Speck genommen.',
        createdAt: '2024-03-08'
      }
    ],
    averageRating: 4.5,
    createdAt: '2024-03-05'
  },
  {
    id: 2,
    title: 'Pizza Margherita',
    description: 'Authentische neapolitanische Pizza mit Tomaten, Mozzarella und frischem Basilikum.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGF8ZW58MXx8fHwxNzYyOTQ4ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Marco Rossi',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco',
    cookTime: '45 Min',
    difficulty: 'Schwer',
    ingredients: [
      '500g Pizzamehl',
      '300ml Wasser',
      '7g Trockenhefe',
      '10g Salz',
      '400g San Marzano Tomaten',
      '250g Mozzarella di Bufala',
      'Frisches Basilikum',
      'Olivenöl'
    ],
    instructions: [
      'Hefeteig zubereiten und 24h ruhen lassen',
      'Teig ausrollen und dünn formen',
      'Tomatensoße auftragen',
      'Mozzarella und Basilikum hinzufügen',
      'Bei 250°C für 10-12 Minuten backen'
    ],
    ratings: [
      {
        id: 3,
        userId: 4,
        userName: 'Sophie Klein',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
        rating: 5,
        comment: 'Die beste Pizza die ich je selbst gemacht habe!',
        createdAt: '2024-03-12'
      }
    ],
    averageRating: 5,
    createdAt: '2024-03-01'
  },
  {
    id: 3,
    title: 'Schokoladenkuchen',
    description: 'Saftiger Schokoladenkuchen mit Ganache - perfekt für alle Schokoladenliebhaber!',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlfGVufDF8fHx8MTc2Mjk1MTMxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Julia Becker',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia',
    cookTime: '60 Min',
    difficulty: 'Mittel',
    ingredients: [
      '200g Zartbitterschokolade',
      '175g Butter',
      '4 Eier',
      '200g Zucker',
      '100g Mehl',
      '50g Kakaopulver',
      '200ml Sahne für Ganache'
    ],
    instructions: [
      'Schokolade und Butter schmelzen',
      'Eier und Zucker schaumig rühren',
      'Schokolade unterrühren, Mehl und Kakao hinzufügen',
      'Bei 180°C 35-40 Minuten backen',
      'Mit Schokoladenganache überziehen'
    ],
    ratings: [],
    averageRating: 0,
    createdAt: '2024-03-13'
  },
  {
    id: 4,
    title: 'Frischer Sommersalat',
    description: 'Knackiger Salat mit Avocado, Tomaten und einem Honig-Senf-Dressing.',
    image: 'https://images.unsplash.com/photo-1677653805080-59c57727c84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkfGVufDF8fHx8MTc2Mjk4NDE4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Sarah Grün',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    cookTime: '15 Min',
    difficulty: 'Einfach',
    ingredients: [
      '1 Kopfsalat',
      '2 Avocados',
      '300g Kirschtomaten',
      '1 Gurke',
      '3 EL Olivenöl',
      '2 EL Honig',
      '1 EL Senf',
      'Zitronensaft'
    ],
    instructions: [
      'Salat waschen und zerkleinern',
      'Gemüse schneiden',
      'Dressing aus Öl, Honig, Senf und Zitrone mischen',
      'Alles vermengen und servieren'
    ],
    ratings: [
      {
        id: 4,
        userId: 5,
        userName: 'Peter Lang',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peter',
        rating: 4,
        comment: 'Super erfrischend! Perfekt für heiße Tage.',
        createdAt: '2024-03-11'
      }
    ],
    averageRating: 4,
    createdAt: '2024-03-09'
  },
  {
    id: 5,
    title: 'Gebratener Lachs mit Gemüse',
    description: 'Zartes Lachsfilet mit mediterranem Ofengemüse - gesund und lecker!',
    image: 'https://images.unsplash.com/photo-1580959375944-abd7e991f971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBkaXNofGVufDF8fHx8MTc2MzAxMDIzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Michael Fischer',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    cookTime: '35 Min',
    difficulty: 'Mittel',
    ingredients: [
      '4 Lachsfilets',
      '2 Zucchini',
      '2 Paprika',
      '1 Aubergine',
      'Kirschtomaten',
      'Olivenöl',
      'Kräuter der Provence',
      'Zitrone'
    ],
    instructions: [
      'Gemüse in Stücke schneiden',
      'Gemüse mit Öl und Gewürzen im Ofen rösten',
      'Lachs in der Pfanne braten',
      'Mit Zitrone beträufeln',
      'Mit dem Ofengemüse servieren'
    ],
    ratings: [
      {
        id: 5,
        userId: 6,
        userName: 'Claudia Werner',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Claudia',
        rating: 5,
        comment: 'Mein neues Lieblingsrezept! So gesund und lecker.',
        createdAt: '2024-03-14'
      }
    ],
    averageRating: 5,
    createdAt: '2024-03-07'
  },
  {
    id: 6,
    title: 'Vegetarisches Curry',
    description: 'Aromatisches Gemüsecurry mit Kokosmilch und indischen Gewürzen.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBjdXJyeXxlbnwxfHx8fDE3NjI5NjI0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Priya Sharma',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    cookTime: '40 Min',
    difficulty: 'Mittel',
    ingredients: [
      '1 Blumenkohl',
      '2 Kartoffeln',
      '1 Dose Kichererbsen',
      '400ml Kokosmilch',
      '2 Zwiebeln',
      'Ingwer und Knoblauch',
      'Currypaste',
      'Garam Masala',
      'Koriander'
    ],
    instructions: [
      'Zwiebeln, Ingwer und Knoblauch anbraten',
      'Currypaste hinzufügen',
      'Gemüse und Kokosmilch dazugeben',
      '30 Minuten köcheln lassen',
      'Mit Reis servieren'
    ],
    ratings: [
      {
        id: 6,
        userId: 7,
        userName: 'David Schneider',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        rating: 5,
        comment: 'Unglaublich aromatisch! Schmeckt wie beim Inder.',
        createdAt: '2024-03-13'
      },
      {
        id: 7,
        userId: 8,
        userName: 'Emma Hoffmann',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        rating: 4,
        comment: 'Sehr lecker, ich habe noch Spinat hinzugefügt.',
        createdAt: '2024-03-12'
      }
    ],
    averageRating: 4.5,
    createdAt: '2024-03-06'
  }
];

type RecipeGridProps = {
  onRecipeClick: (recipe: Recipe) => void;
};

export function RecipeGrid({ onRecipeClick }: RecipeGridProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-orange-600 mb-4">Entdecke köstliche Rezepte</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Teile deine Lieblingsrezepte mit der Community und entdecke neue kulinarische Kreationen
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_RECIPES.map((recipe) => (
          <Card
            key={recipe.id}
            className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => onRecipeClick(recipe)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-3 right-3 bg-white/90 text-gray-700 hover:bg-white">
                {recipe.difficulty}
              </Badge>
            </div>
            <CardContent className="p-5">
              <h3 className="mb-2">{recipe.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="size-4" />
                  {recipe.cookTime}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'Neu'}
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-5 pb-5 pt-0">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={recipe.authorAvatar} alt={recipe.author} />
                  <AvatarFallback>{recipe.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{recipe.author}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { MOCK_RECIPES };
