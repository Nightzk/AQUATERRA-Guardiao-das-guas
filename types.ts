import z from "zod";

// Player Schema
export const PlayerSchema = z.object({
  id: z.number(),
  name: z.string(),
  level: z.number(),
  health: z.number(),
  max_health: z.number(),
  experience: z.number(),
  current_area: z.string(),
  x_position: z.number(),
  y_position: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Player = z.infer<typeof PlayerSchema>;

// Area Schema
export const AreaSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  description: z.string().nullable(),
  pollution_level: z.number(),
  is_restored: z.number(), // SQLite boolean as number
  background_image: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Area = z.infer<typeof AreaSchema>;

// Enemy Schema
export const EnemySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  health: z.number(),
  attack_power: z.number(),
  description: z.string().nullable(),
  area_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Enemy = z.infer<typeof EnemySchema>;

// Quest Schema
export const QuestSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  target_area_id: z.number().nullable(),
  reward_experience: z.number(),
  is_completed: z.number(), // SQLite boolean as number
  created_at: z.string(),
  updated_at: z.string(),
});

export type Quest = z.infer<typeof QuestSchema>;

// Combat Action Schema
export const CombatActionSchema = z.object({
  type: z.enum(['attack', 'heal', 'purify']),
  target: z.enum(['enemy', 'self']),
});

export type CombatAction = z.infer<typeof CombatActionSchema>;

// Game State Schema
export const GameStateSchema = z.object({
  player: PlayerSchema,
  current_area: AreaSchema,
  in_combat: z.boolean(),
  current_enemy: EnemySchema.nullable(),
  available_quests: z.array(QuestSchema),
});

export type GameState = z.infer<typeof GameStateSchema>;
