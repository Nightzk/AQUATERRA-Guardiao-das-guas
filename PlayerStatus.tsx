import { Player } from '@/shared/types';
import { Heart, Star, User } from 'lucide-react';

interface PlayerStatusProps {
  player: Player;
}

export default function PlayerStatus({ player }: PlayerStatusProps) {
  const healthPercentage = (player.health / player.max_health) * 100;
  const experienceToNext = (player.level * 100) - player.experience;

  return (
    <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 text-white shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{player.name}</h3>
          <p className="text-blue-200">Guardião das Águas</p>
        </div>
      </div>

      {/* Level */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium">Nível {player.level}</span>
        </div>
        <div className="text-xs text-blue-200">
          {experienceToNext > 0 ? `${experienceToNext} XP para próximo nível` : 'Máximo!'}
        </div>
      </div>

      {/* Health */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium">Saúde</span>
          <span className="text-xs text-blue-200 ml-auto">
            {player.health}/{player.max_health}
          </span>
        </div>
        <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              healthPercentage > 60 ? 'bg-green-500' :
              healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      </div>

      {/* Experience */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-purple-400 rounded-full" />
          <span className="text-sm font-medium">Experiência</span>
          <span className="text-xs text-blue-200 ml-auto">{player.experience} XP</span>
        </div>
        <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300"
            style={{ width: `${(player.experience % 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
