import { useState, useEffect } from 'react';
import { Player, Area, Enemy, CombatAction } from '@/shared/types';
import GameMap from '@/react-app/components/GameMap';
import PlayerStatus from '@/react-app/components/PlayerStatus';
import CombatSystem from '@/react-app/components/CombatSystem';
import QuestPanel from '@/react-app/components/QuestPanel';
import { Settings, Scroll, Map } from 'lucide-react';

interface GameProps {
  playerId: number;
}

export default function Game({ playerId }: GameProps) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  const [inCombat, setInCombat] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [loading, setLoading] = useState(true);
  const [combatLoading, setCombatLoading] = useState(false);
  const [showQuests, setShowQuests] = useState(false);

  useEffect(() => {
    loadGameData();
  }, [playerId]);

  const loadGameData = async () => {
    try {
      // Load player
      const playerResponse = await fetch(`/api/players/${playerId}`);
      const playerData = await playerResponse.json();
      setPlayer(playerData);

      // Load current area
      const areasResponse = await fetch('/api/areas');
      const areas = await areasResponse.json();
      const area = areas.find((a: Area) => a.name === playerData.current_area) || areas[0];
      setCurrentArea(area);
    } catch (error) {
      console.error('Error loading game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaChange = async (areaName: string) => {
    if (!player || !currentArea) return;

    try {
      const areasResponse = await fetch('/api/areas');
      const areas = await areasResponse.json();
      const newArea = areas.find((a: Area) => a.name === areaName);
      
      if (newArea) {
        setCurrentArea(newArea);
        
        // Update player position
        await fetch(`/api/players/${player.id}/position`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            x_position: 50,
            y_position: 50,
            current_area: areaName
          })
        });
      }
    } catch (error) {
      console.error('Error changing area:', error);
    }
  };

  const handleExplore = async () => {
    if (!currentArea) return;

    try {
      const response = await fetch(`/api/areas/${currentArea.id}/enemies`);
      const enemies = await response.json();
      
      if (enemies.length > 0) {
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        setCurrentEnemy(randomEnemy);
        setInCombat(true);
      } else {
        alert('Área pacífica! Nenhum inimigo encontrado.');
      }
    } catch (error) {
      console.error('Error exploring:', error);
    }
  };

  const handleCombatAction = async (action: CombatAction) => {
    if (!player || !currentEnemy) return;

    setCombatLoading(true);
    try {
      const response = await fetch(`/api/combat/${player.id}/${currentEnemy.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      });

      const result = await response.json();
      
      // Update player health
      setPlayer(prev => prev ? { ...prev, health: result.player_health } : null);
      
      // Check if combat ended
      if (result.enemy_defeated || result.player_health <= 0) {
        setInCombat(false);
        setCurrentEnemy(null);
        
        if (result.enemy_defeated) {
          alert(`Vitória! ${result.result}`);
          // Reload player data to get updated experience
          loadGameData();
        } else if (result.player_health <= 0) {
          alert('Você foi derrotado! Respawnando na vila...');
          // Reset player health and position
          await fetch(`/api/players/${player.id}/position`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              x_position: 50,
              y_position: 50,
              current_area: 'Vila Costeira'
            })
          });
          loadGameData();
        }
      }
    } catch (error) {
      console.error('Combat error:', error);
    } finally {
      setCombatLoading(false);
    }
  };

  const handleCombatEnd = () => {
    setInCombat(false);
    setCurrentEnemy(null);
  };

  if (loading || !player || !currentArea) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🌊</div>
          <p className="text-white text-xl">Carregando o mundo aquático...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            🌊 Aquaterra: Guardião das Águas 🌊
          </h1>
          <p className="text-blue-200 text-center">
            Proteja os oceanos e lute contra as mudanças climáticas!
          </p>
        </div>

        {/* Main Game Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Player Status */}
          <div className="lg:col-span-1">
            <PlayerStatus player={player} />
          </div>

          {/* Game Map */}
          <div className="lg:col-span-2">
            <GameMap
              player={player}
              currentArea={currentArea}
              onAreaChange={handleAreaChange}
              onExplore={handleExplore}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowQuests(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-purple-800 transition-all shadow-lg flex items-center gap-2"
          >
            <Scroll className="w-5 h-5" />
            Missões
          </button>
          
          <button
            onClick={() => loadGameData()}
            className="bg-gradient-to-r from-gray-500 to-gray-700 text-white py-3 px-6 rounded-xl font-medium hover:from-gray-600 hover:to-gray-800 transition-all shadow-lg flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Atualizar
          </button>
        </div>

        {/* Combat System */}
        {inCombat && currentEnemy && (
          <CombatSystem
            player={player}
            enemy={currentEnemy}
            onCombatAction={handleCombatAction}
            onCombatEnd={handleCombatEnd}
            isLoading={combatLoading}
          />
        )}

        {/* Quest Panel */}
        <QuestPanel
          isOpen={showQuests}
          onClose={() => setShowQuests(false)}
        />
      </div>
    </div>
  );
}
