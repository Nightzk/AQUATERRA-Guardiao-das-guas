import { useState, useEffect } from 'react';
import { Area, Player } from '@/shared/types';
import { Waves, Trees, Home, Anchor } from 'lucide-react';

interface GameMapProps {
  player: Player;
  currentArea: Area;
  onAreaChange: (areaName: string) => void;
  onExplore: () => void;
}

export default function GameMap({ player, currentArea, onAreaChange, onExplore }: GameMapProps) {
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/areas');
      const data = await response.json();
      setAreas(data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const getAreaIcon = (type: string) => {
    switch (type) {
      case 'village': return <Home className="w-6 h-6" />;
      case 'reef': return <Anchor className="w-6 h-6" />;
      case 'mangrove': return <Trees className="w-6 h-6" />;
      case 'ocean': return <Waves className="w-6 h-6" />;
      default: return <Home className="w-6 h-6" />;
    }
  };

  const getPollutionColor = (level: number) => {
    if (level < 30) return 'from-green-400 to-blue-500';
    if (level < 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-500 to-red-700';
  };

  return (
    <div className="w-full h-96 relative rounded-xl overflow-hidden shadow-2xl">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${currentArea.background_image})`,
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-900/60" />
      
      {/* Content */}
      <div className="relative h-full p-6 flex flex-col">
        {/* Area Info */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {getAreaIcon(currentArea.type)}
            <h2 className="text-2xl font-bold text-white">{currentArea.name}</h2>
          </div>
          <p className="text-blue-100 mb-3">{currentArea.description}</p>
          
          {/* Pollution Level */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-200">Nível de Poluição:</span>
            <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden max-w-32">
              <div 
                className={`h-full bg-gradient-to-r ${getPollutionColor(currentArea.pollution_level)}`}
                style={{ width: `${currentArea.pollution_level}%` }}
              />
            </div>
            <span className="text-sm text-white font-medium">{currentArea.pollution_level}%</span>
          </div>
        </div>

        {/* Player Position */}
        <div className="absolute" style={{ 
          left: `${player.x_position}%`, 
          top: `${player.y_position}%`,
          transform: 'translate(-50%, -50%)'
        }}>
          <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-lg animate-pulse" />
        </div>

        {/* Area Navigation */}
        <div className="mt-auto">
          <div className="flex gap-2 mb-4">
            {areas.map((area) => (
              <button
                key={area.id}
                onClick={() => onAreaChange(area.name)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  area.id === currentArea.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/20 text-blue-100 hover:bg-white/30'
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
          
          <button
            onClick={onExplore}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all shadow-lg"
          >
            🔍 Explorar Área
          </button>
        </div>
      </div>
    </div>
  );
}
