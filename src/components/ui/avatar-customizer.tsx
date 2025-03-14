
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit3, Palette, Glasses, Smile, CircleUser } from 'lucide-react';

interface AvatarOption {
  type: string;
  value: string;
  label: string;
}

const hairStyles = [
  { type: 'hairStyle', value: 'short', label: 'Short' },
  { type: 'hairStyle', value: 'long', label: 'Long' },
  { type: 'hairStyle', value: 'mohawk', label: 'Mohawk' },
  { type: 'hairStyle', value: 'waveShort', label: 'Wave Short' },
  { type: 'hairStyle', value: 'waveLong', label: 'Wave Long' },
];

const hairColors = [
  { type: 'hairColor', value: 'blonde', label: 'Blonde' },
  { type: 'hairColor', value: 'brown', label: 'Brown' },
  { type: 'hairColor', value: 'black', label: 'Black' },
  { type: 'hairColor', value: 'red', label: 'Red' },
  { type: 'hairColor', value: 'gray', label: 'Gray' },
  { type: 'hairColor', value: 'platinum', label: 'Platinum' },
];

const eyeTypes = [
  { type: 'eyes', value: 'round', label: 'Round' },
  { type: 'eyes', value: 'oval', label: 'Oval' },
  { type: 'eyes', value: 'smiling', label: 'Smiling' },
  { type: 'eyes', value: 'sleepy', label: 'Sleepy' },
  { type: 'eyes', value: 'winking', label: 'Winking' },
];

const mouthTypes = [
  { type: 'mouth', value: 'smile', label: 'Smile' },
  { type: 'mouth', value: 'surprised', label: 'Surprised' },
  { type: 'mouth', value: 'serious', label: 'Serious' },
  { type: 'mouth', value: 'laughing', label: 'Laughing' },
  { type: 'mouth', value: 'smirk', label: 'Smirk' },
];

const accessories = [
  { type: 'accessories', value: 'none', label: 'None' },
  { type: 'accessories', value: 'glasses', label: 'Glasses' },
  { type: 'accessories', value: 'sunglasses', label: 'Sunglasses' },
  { type: 'accessories', value: 'earrings', label: 'Earrings' },
  { type: 'accessories', value: 'mustache', label: 'Mustache' },
  { type: 'accessories', value: 'beard', label: 'Beard' },
];

export interface AvatarSettings {
  seed: number;
  hairStyle?: string;
  hairColor?: string;
  eyes?: string;
  mouth?: string;
  accessories?: string;
}

interface AvatarCustomizerProps {
  avatarSettings: AvatarSettings;
  onAvatarChange: (settings: AvatarSettings) => void;
}

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  avatarSettings,
  onAvatarChange
}) => {
  const [localSettings, setLocalSettings] = useState<AvatarSettings>(avatarSettings);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = (option: AvatarOption) => {
    const newSettings = { ...localSettings, [option.type]: option.value };
    setLocalSettings(newSettings);
    onAvatarChange(newSettings);
  };

  const generateRandomAvatar = () => {
    const newSeed = Math.floor(Math.random() * 10000);
    const newSettings = { ...localSettings, seed: newSeed };
    setLocalSettings(newSettings);
    onAvatarChange(newSettings);
  };

  // Build the avatar URL with all parameters
  const buildAvatarUrl = (settings: AvatarSettings) => {
    let url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${settings.seed}`;
    
    if (settings.hairStyle) url += `&hair=${settings.hairStyle}`;
    if (settings.hairColor) url += `&hairColor=${settings.hairColor}`;
    if (settings.eyes) url += `&eyes=${settings.eyes}`;
    if (settings.mouth) url += `&mouth=${settings.mouth}`;
    if (settings.accessories && settings.accessories !== 'none') {
      url += `&accessories=${settings.accessories}`;
    }
    
    return url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="absolute top-4 left-4 p-0 h-10 w-10 rounded-full overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform duration-200 border-primary/50 hover:border-primary"
        >
          <Avatar className="h-full w-full">
            <AvatarImage src={buildAvatarUrl(localSettings)} alt="Your avatar" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Your Avatar</DialogTitle>
          <DialogDescription>
            Create your personalized game avatar
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center my-4">
          <Avatar className="h-24 w-24 border-2 border-primary animate-pulse">
            <AvatarImage 
              src={buildAvatarUrl(localSettings)} 
              alt="Avatar preview" 
              className="animate-none" 
            />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateRandomAvatar} 
          className="mx-auto w-40 mb-4 hover:bg-secondary/50 transition-colors duration-300"
        >
          Random Avatar
        </Button>
        
        <Tabs defaultValue="hairStyle" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="hairStyle" className="flex flex-col items-center gap-1 py-2">
              <User className="h-4 w-4" />
              <span className="text-xs">Hair</span>
            </TabsTrigger>
            <TabsTrigger value="hairColor" className="flex flex-col items-center gap-1 py-2">
              <Palette className="h-4 w-4" />
              <span className="text-xs">Color</span>
            </TabsTrigger>
            <TabsTrigger value="eyes" className="flex flex-col items-center gap-1 py-2">
              <Glasses className="h-4 w-4" />
              <span className="text-xs">Eyes</span>
            </TabsTrigger>
            <TabsTrigger value="mouth" className="flex flex-col items-center gap-1 py-2">
              <Smile className="h-4 w-4" />
              <span className="text-xs">Mouth</span>
            </TabsTrigger>
            <TabsTrigger value="accessories" className="flex flex-col items-center gap-1 py-2">
              <CircleUser className="h-4 w-4" />
              <span className="text-xs">Extras</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hairStyle" className="mt-0">
            <div className="grid grid-cols-3 gap-2">
              {hairStyles.map((option) => (
                <Button
                  key={option.value}
                  variant={localSettings.hairStyle === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleOptionSelect(option)}
                  className="h-20 flex flex-col hover:scale-105 transition-transform duration-200"
                >
                  <div className="w-10 h-10 mb-1">
                    <img 
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${localSettings.seed}&hair=${option.value}`}
                      alt={option.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="hairColor" className="mt-0">
            <div className="grid grid-cols-3 gap-2">
              {hairColors.map((option) => (
                <Button
                  key={option.value}
                  variant={localSettings.hairColor === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleOptionSelect(option)}
                  className="h-20 flex flex-col hover:scale-105 transition-transform duration-200"
                >
                  <div className="w-10 h-10 mb-1">
                    <img 
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${localSettings.seed}&hair=${localSettings.hairStyle}&hairColor=${option.value}`}
                      alt={option.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="eyes" className="mt-0">
            <div className="grid grid-cols-3 gap-2">
              {eyeTypes.map((option) => (
                <Button
                  key={option.value}
                  variant={localSettings.eyes === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleOptionSelect(option)}
                  className="h-20 flex flex-col hover:scale-105 transition-transform duration-200"
                >
                  <div className="w-10 h-10 mb-1">
                    <img 
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${localSettings.seed}&eyes=${option.value}`}
                      alt={option.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mouth" className="mt-0">
            <div className="grid grid-cols-3 gap-2">
              {mouthTypes.map((option) => (
                <Button
                  key={option.value}
                  variant={localSettings.mouth === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleOptionSelect(option)}
                  className="h-20 flex flex-col hover:scale-105 transition-transform duration-200"
                >
                  <div className="w-10 h-10 mb-1">
                    <img 
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${localSettings.seed}&mouth=${option.value}`}
                      alt={option.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="accessories" className="mt-0">
            <div className="grid grid-cols-3 gap-2">
              {accessories.map((option) => (
                <Button
                  key={option.value}
                  variant={localSettings.accessories === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleOptionSelect(option)}
                  className="h-20 flex flex-col hover:scale-105 transition-transform duration-200"
                >
                  <div className="w-10 h-10 mb-1">
                    <img 
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${localSettings.seed}&accessories=${option.value === 'none' ? '' : option.value}`}
                      alt={option.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
