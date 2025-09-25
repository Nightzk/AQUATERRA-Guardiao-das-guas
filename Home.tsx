import { useState } from 'react';
import { User, Play, Info } from 'lucide-react';
import Game from '@/react-app/pages/Game';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleCreatePlayer = async () => {
    if (!playerName.trim()) {
      alert('Por favor, digite um nome para seu personagem!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName.trim() })
      });

      const player = await response.json();
      setPlayerId(player.id);
      setGameStarted(true);
    } catch (error) {
      console.error('Error creating player:', error);
      alert('Erro ao criar personagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (gameStarted && playerId) {
    return <Game playerId={playerId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-6 animate-bounce">🌊</div>
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-200 to-teal-200 bg-clip-text text-transparent">
            Aquaterra
          </h1>
          <h2 className="text-2xl text-blue-200 mb-6">Guardião das Águas</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Embarque em uma jornada épica para proteger os oceanos e combater as mudanças climáticas. 
            Como Guardião das Águas, você deve restaurar o equilíbrio entre a natureza e a civilização.
          </p>
        </div>

        {/* Character Creation */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Criar Personagem
          </h3>
          
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Nome do Guardião
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Digite o nome do seu personagem"
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-blue-300/30 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  maxLength={50}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreatePlayer()}
                />
              </div>
            </div>

            <button
              onClick={handleCreatePlayer}
              disabled={loading || !playerName.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="animate-spin text-2xl">🌊</div>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  Iniciar Aventura
                </>
              )}
            </button>
          </div>
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🏝️</div>
            <h4 className="text-lg font-bold text-white mb-2">Exploração</h4>
            <p className="text-blue-200 text-sm">
              Descubra vilas costeiras, recifes de coral, manguezais e cavernas submarinas
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⚔️</div>
            <h4 className="text-lg font-bold text-white mb-2">Combate</h4>
            <p className="text-green-200 text-sm">
              Enfrente monstros de poluição e manifestações das mudanças climáticas
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">📚</div>
            <h4 className="text-lg font-bold text-white mb-2">Missões</h4>
            <p className="text-purple-200 text-sm">
              Complete missões para limpar áreas, educar comunidades e restaurar ecossistemas
            </p>
          </div>
        </div>

        {/* Info Button */}
        <div className="text-center">
          <button
            onClick={() => setShowInfo(true)}
            className="bg-white/20 text-white py-2 px-6 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2 mx-auto"
          >
            <Info className="w-4 h-4" />
            Sobre o Jogo
          </button>
        </div>

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Sobre Aquaterra</h3>
              <div className="text-blue-100 space-y-4">
                <p>
                  <strong>Aquaterra: Guardião das Águas</strong> é um RPG 2D que combina aventura, 
                  educação ambiental e conscientização sobre mudanças climáticas.
                </p>
                <p>
                  <strong>História:</strong> Você é um jovem Guardião escolhido para proteger 
                  territórios aquáticos. Enfrentará ameaças como poluição, pesca predatória 
                  e desmatamento, aprendendo a equilibrar tradição cultural com ciência moderna.
                </p>
                <p>
                  <strong>Gameplay:</strong> Explore diferentes ambientes, complete missões de 
                  limpeza e proteção, enfrente inimigos simbólicos em combate por turnos e 
                  tome decisões que afetam o futuro do mundo aquático.
                </p>
                <p>
                  <strong>Objetivo:</strong> Unir cultura oceânica e preservação ambiental para 
                  garantir um futuro sustentável contra as mudanças climáticas.
                </p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowInfo(false)}
                  className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-2 px-6 rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
