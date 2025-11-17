import { useState } from 'react';
import { Header } from './components/Header';
import { RecipeGrid } from './components/RecipeGrid';
import { RecipeDetail } from './components/RecipeDetail';
import { UploadRecipe } from './components/UploadRecipe';
import { LoginDialog } from './components/LoginDialog';
import { RegisterDialog } from './components/RegisterDialog';

export type Recipe = {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  authorAvatar: string;
  cookTime: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  ratings: Rating[];
  averageRating: number;
  createdAt: string;
};

export type Rating = {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'recipe' | 'upload'>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Mock login - würde später mit PHP Backend verbunden
    const mockUser: User = {
      id: 1,
      name: 'Max Mustermann',
      email: email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max'
    };
    setCurrentUser(mockUser);
    setShowLogin(false);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Mock register - würde später mit PHP Backend verbunden
    const mockUser: User = {
      id: Date.now(),
      name: name,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };
    setCurrentUser(mockUser);
    setShowRegister(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentView('recipe');
  };

  const handleUploadClick = () => {
    if (!currentUser) {
      setShowLogin(true);
    } else {
      setCurrentView('upload');
    }
  };

  const handleRecipeUploaded = () => {
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Header
        currentUser={currentUser}
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogout={handleLogout}
        onLogoClick={() => setCurrentView('home')}
        onUploadClick={handleUploadClick}
      />

      <main>
        {currentView === 'home' && (
          <RecipeGrid onRecipeClick={handleRecipeClick} />
        )}
        {currentView === 'recipe' && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            currentUser={currentUser}
            onBack={() => setCurrentView('home')}
            onLoginRequired={() => setShowLogin(true)}
          />
        )}
        {currentView === 'upload' && currentUser && (
          <UploadRecipe
            currentUser={currentUser}
            onCancel={() => setCurrentView('home')}
            onSuccess={handleRecipeUploaded}
          />
        )}
      </main>

      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterDialog
        open={showRegister}
        onOpenChange={setShowRegister}
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}
