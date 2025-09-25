import { useState, useEffect } from 'react';
import { Quest } from '@/shared/types';
import { Scroll, Target, Award, CheckCircle } from 'lucide-react';

interface QuestPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestPanel({ isOpen, onClose }: QuestPanelProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchQuests();
    }
  }, [isOpen]);

  const fetchQuests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quests');
      const data = await response.json();
      setQuests(data);
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case 'cleanup': return '🧹';
      case 'protection': return '🛡️';
      case 'education': return '📚';
      case 'boss': return '👑';
      default: return '📋';
    }
  };

  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case 'cleanup': return 'from-green-500 to-green-700';
      case 'protection': return 'from-blue-500 to-blue-700';
      case 'education': return 'from-yellow-500 to-yellow-700';
      case 'boss': return 'from-purple-500 to-purple-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40">
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Scroll className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Missões Disponíveis</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin text-4xl">📜</div>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {quests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-300">Nenhuma missão disponível no momento.</p>
              </div>
            ) : (
              quests.map((quest) => (
                <div
                  key={quest.id}
                  className={`bg-gradient-to-r ${getQuestTypeColor(quest.type)} rounded-xl p-4 text-white`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{getQuestTypeIcon(quest.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{quest.title}</h3>
                      <p className="text-sm opacity-90 mb-3">{quest.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            <span className="text-sm">{quest.reward_experience} XP</span>
                          </div>
                          
                          {quest.is_completed ? (
                            <div className="flex items-center gap-1 text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">Concluída</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span className="text-sm">Em andamento</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-2 px-6 rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
