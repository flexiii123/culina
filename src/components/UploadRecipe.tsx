import { useState, useRef } from 'react';
import { Upload, X, Plus, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { User } from '../App';

type UploadRecipeProps = {
  currentUser: User;
  onCancel: () => void;
  onSuccess: () => void;
};

export function UploadRecipe({ currentUser, onCancel, onSuccess }: UploadRecipeProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validierung des Dateityps
      if (!file.type.startsWith('image/')) {
        alert('Bitte wähle eine Bilddatei aus');
        return;
      }

      // Validierung der Dateigröße (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Die Datei ist zu groß. Maximum 5MB.');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validierung
    if (!title || !description || !cookTime || !difficulty) {
      alert('Bitte fülle alle Pflichtfelder aus');
      return;
    }

    if (!imageFile) {
      alert('Bitte füge ein Bild hinzu');
      return;
    }

    const validIngredients = ingredients.filter(i => i.trim() !== '');
    const validInstructions = instructions.filter(i => i.trim() !== '');

    if (validIngredients.length === 0 || validInstructions.length === 0) {
      alert('Bitte füge mindestens eine Zutat und einen Zubereitungsschritt hinzu');
      return;
    }

    setIsUploading(true);

    // Simuliert Ajax File Upload zum PHP Backend
    // In der echten Anwendung würde hier FormData mit fetch() gesendet werden
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('cookTime', cookTime);
    formData.append('difficulty', difficulty);
    formData.append('ingredients', JSON.stringify(validIngredients));
    formData.append('instructions', JSON.stringify(validInstructions));
    formData.append('userId', currentUser.id.toString());

    console.log('Ajax FormData Upload würde an PHP Backend gesendet:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Simuliert Upload-Verzögerung
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsUploading(false);
    alert('Rezept erfolgreich hochgeladen! 🎉');
    onSuccess();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={onCancel}
        className="mb-6"
      >
        <ArrowLeft className="size-4 mr-2" />
        Abbrechen
      </Button>

      <Card>
        <CardHeader>
          <h1 className="text-orange-600">Neues Rezept hochladen</h1>
          <p className="text-gray-600">Teile dein Lieblingsrezept mit der Culina-Community</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bild Upload */}
            <div>
              <Label htmlFor="image">Rezeptbild *</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={imagePreview}
                      alt="Rezeptvorschau"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-orange-400 hover:bg-orange-50/50 transition-colors cursor-pointer"
                  >
                    <Upload className="size-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">
                      Klicke hier oder ziehe ein Bild hierher
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG bis zu 5MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Grundinformationen */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Rezepttitel *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Spaghetti Carbonara"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cookTime">Zubereitungszeit *</Label>
                <Input
                  id="cookTime"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  placeholder="z.B. 30 Min"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="difficulty">Schwierigkeitsgrad *</Label>
              <Select value={difficulty} onValueChange={setDifficulty} required>
                <SelectTrigger>
                  <SelectValue placeholder="Wähle einen Schwierigkeitsgrad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Einfach">Einfach</SelectItem>
                  <SelectItem value="Mittel">Mittel</SelectItem>
                  <SelectItem value="Schwer">Schwer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Beschreibung *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreibe dein Rezept..."
                rows={3}
                className="resize-none"
                required
              />
            </div>

            {/* Zutaten */}
            <div>
              <Label>Zutaten *</Label>
              <div className="space-y-2 mt-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      placeholder={`Zutat ${index + 1}`}
                    />
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addIngredient}
                  className="w-full"
                >
                  <Plus className="size-4 mr-2" />
                  Zutat hinzufügen
                </Button>
              </div>
            </div>

            {/* Zubereitungsschritte */}
            <div>
              <Label>Zubereitungsschritte *</Label>
              <div className="space-y-2 mt-2">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center mt-2">
                      {index + 1}
                    </div>
                    <Textarea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      placeholder={`Schritt ${index + 1}`}
                      rows={2}
                      className="resize-none flex-1"
                    />
                    {instructions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInstruction(index)}
                        className="mt-2"
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addInstruction}
                  className="w-full"
                >
                  <Plus className="size-4 mr-2" />
                  Schritt hinzufügen
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Wird hochgeladen...
                  </>
                ) : (
                  <>
                    <Upload className="size-4 mr-2" />
                    Rezept veröffentlichen
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
