import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChefHat } from 'lucide-react';

type RegisterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (name: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
};

export function RegisterDialog({ open, onOpenChange, onRegister, onSwitchToLogin }: RegisterDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      alert('Bitte fülle alle Felder aus');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 6) {
      alert('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setIsLoading(true);

    // Simuliert Ajax Register Request zum PHP Backend
    console.log('Ajax Register Request würde an PHP Backend gesendet:', { name, email, password });
    
    // Simuliert Verzögerung
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onRegister(name, email, password);
    setIsLoading(false);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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
          <DialogTitle className="text-center">Bei Culina registrieren</DialogTitle>
          <DialogDescription className="text-center">
            Erstelle einen Account und werde Teil unserer Koch-Community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="register-name">Name</Label>
            <Input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              required
            />
          </div>

          <div>
            <Label htmlFor="register-email">E-Mail</Label>
            <Input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
            />
          </div>

          <div>
            <Label htmlFor="register-password">Passwort</Label>
            <Input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <Label htmlFor="register-confirm-password">Passwort bestätigen</Label>
            <Input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
          >
            {isLoading ? 'Registrieren...' : 'Registrieren'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Bereits registriert?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-orange-600 hover:underline"
          >
            Jetzt anmelden
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
