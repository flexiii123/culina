import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChefHat } from 'lucide-react';

type LoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
};

export function LoginDialog({ open, onOpenChange, onLogin, onSwitchToRegister }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Bitte fülle alle Felder aus');
      return;
    }

    setIsLoading(true);

    // Simuliert Ajax Login Request zum PHP Backend
    console.log('Ajax Login Request würde an PHP Backend gesendet:', { email, password });
    
    // Simuliert Verzögerung
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onLogin(email, password);
    setIsLoading(false);
    setEmail('');
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl">
              <ChefHat className="size-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center">Willkommen zurück!</DialogTitle>
          <DialogDescription className="text-center">
            Melde dich an, um Rezepte hochzuladen und zu bewerten
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="login-email">E-Mail</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
            />
          </div>

          <div>
            <Label htmlFor="login-password">Passwort</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
          >
            {isLoading ? 'Anmelden...' : 'Anmelden'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Noch kein Konto?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-orange-600 hover:underline"
          >
            Jetzt registrieren
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
