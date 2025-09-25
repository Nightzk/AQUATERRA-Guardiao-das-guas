import { useState } from 'react';
import { Enemy, Player, CombatAction } from '@/shared/types';
import { Sword, Heart, Sparkles, Shield } from 'lucide-react';

interface CombatSystemProps {
  player: Player;
  enemy: Enemy;
  onCombatAction: (action: CombatAction) => Promise<void>;
  onCombatEnd: () => void;
  isLoading: boolean;
}

export default function CombatSystem({ 
  player, 
  enemy, 
  onCombatAction, 
  onCombatEnd,
  isLoading 
}: CombatSystemProps) {
  const [enemyHealth, setEnemyHealth] = useState(enemy.health);
  const [playerHealth, setPlayerHealth] = useState(player.health);
  const [combatLog, setCombatLog] = useState<string[]>([]);

  const handleAction = async (action: CombatAction) => {
    if (isLoading) return;
    
    try {
      await onCombatAction(action);
    } catch (error) {
      console.error('Combat error:', error);
    }
  };

  const getEnemyTypeColor = (type: string) => {
    switch (type) {
      case 'pollution': return 'from-gray-600 to-gray-800';
      case 'climate': return 'from-purple-600 to-purple-800';
      case 'human': return 'from-red-600 to-red-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getEnemyIcon = (type: string) => {
    switch (type) {
      case 'pollution': return '🏭';
      case 'climate': return '🌪️';
      case 'human': return '👤';
      default: return '👾';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-4xl w-full shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          ⚔️ Combate Ambiental ⚔️
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Player Side */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 mb-4">
              <div className="text-6xl mb-3">🌊</div>
              <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
              <div className="w-full h-4 bg-black/30 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                  style={{ width: `${(playerHealth / player.max_health) * 100}%` }}
                />
              </div>
              <p className="text-blue-200 text-sm">{playerHealth}/{player.max_health} HP</p>
            </div>
          </div>

          {/* Enemy Side */}
          <div className="text-center">
            <div className={`bg-gradient-to-br ${getEnemyTypeColor(enemy.type)} rounded-xl p-6 mb-4`}>
              <div className="text-6xl mb-3">{getEnemyIcon(enemy.type)}</div>
              <h3 className="text-xl font-bold text-white mb-2">{enemy.name}</h3>
              <div className="w-full h-4 bg-black/30 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300"
                  style={{ width: `${(enemyHealth / enemy.health) * 100}%` }}
                />
              </div>
              <p className="text-gray-200 text-sm">{enemyHealth}/{enemy.health} HP</p>
            </div>
          </div>
        </div>

        {/* Combat Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleAction({ type: 'attack', target: 'enemy' })}
            disabled={isLoading}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white py-4 px-6 rounded-xl font-medium hover:from-red-600 hover:to-red-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sword className="w-5 h-5" />
            Atacar
          </button>
          
          <button
            onClick={() => handleAction({ type: 'heal', target: 'self' })}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white py-4 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Curar
          </button>
          
          <button
            onClick={() => handleAction({ type: 'purify', target: 'enemy' })}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-700 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Purificar
          </button>
        </div>

        {/* Combat Log */}
        {combatLog.length > 0 && (
          <div className="bg-black/30 rounded-xl p-4 mb-6 max-h-32 overflow-y-auto">
            {combatLog.map((log, index) => (
              <p key={index} className="text-gray-300 text-sm mb-1">{log}</p>
            ))}
          </div>
        )}

        {/* Enemy Description */}
        <div className="text-center mb-6">
          <p className="text-gray-300 italic">{enemy.description}</p>
        </div>

        {/* Exit Combat */}
        <div className="text-center">
          <button
            onClick={onCombatEnd}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-2 px-6 rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all"
          >
            Fugir do Combate
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <div className="animate-spin text-4xl">⚔️</div>
          </div>
        )}
      </div>
    </div>
  );
}
