import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { 
  PlayerSchema, 
  AreaSchema, 
  EnemySchema, 
  QuestSchema, 
  CombatActionSchema 
} from "@/shared/types";
import z from "zod";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Get all areas
app.get("/api/areas", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM areas ORDER BY id"
  ).all();
  
  return c.json(results);
});

// Get area by ID
app.get("/api/areas/:id", async (c) => {
  const id = c.req.param("id");
  
  const area = await c.env.DB.prepare(
    "SELECT * FROM areas WHERE id = ?"
  ).bind(id).first();
  
  if (!area) {
    return c.json({ error: "Area not found" }, 404);
  }
  
  return c.json(area);
});

// Create new player
app.post("/api/players", zValidator("json", z.object({
  name: z.string().min(1).max(50)
})), async (c) => {
  const { name } = c.req.valid("json");
  
  const result = await c.env.DB.prepare(
    "INSERT INTO players (name) VALUES (?) RETURNING *"
  ).bind(name).first();
  
  return c.json(result);
});

// Get player by ID
app.get("/api/players/:id", async (c) => {
  const id = c.req.param("id");
  
  const player = await c.env.DB.prepare(
    "SELECT * FROM players WHERE id = ?"
  ).bind(id).first();
  
  if (!player) {
    return c.json({ error: "Player not found" }, 404);
  }
  
  return c.json(player);
});

// Update player position
app.put("/api/players/:id/position", zValidator("json", z.object({
  x_position: z.number(),
  y_position: z.number(),
  current_area: z.string().optional()
})), async (c) => {
  const id = c.req.param("id");
  const { x_position, y_position, current_area } = c.req.valid("json");
  
  let query = "UPDATE players SET x_position = ?, y_position = ?, updated_at = CURRENT_TIMESTAMP";
  const params = [x_position, y_position];
  
  if (current_area) {
    query += ", current_area = ?";
    params.push(current_area);
  }
  
  query += " WHERE id = ? RETURNING *";
  params.push(id);
  
  const result = await c.env.DB.prepare(query).bind(...params).first();
  
  if (!result) {
    return c.json({ error: "Player not found" }, 404);
  }
  
  return c.json(result);
});

// Get enemies in area
app.get("/api/areas/:areaId/enemies", async (c) => {
  const areaId = c.req.param("areaId");
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM enemies WHERE area_id = ?"
  ).bind(areaId).all();
  
  return c.json(results);
});

// Combat action
app.post("/api/combat/:playerId/:enemyId", zValidator("json", CombatActionSchema), async (c) => {
  const playerId = c.req.param("playerId");
  const enemyId = c.req.param("enemyId");
  const action = c.req.valid("json");
  
  // Get player and enemy
  const player = await c.env.DB.prepare(
    "SELECT * FROM players WHERE id = ?"
  ).bind(playerId).first();
  
  const enemy = await c.env.DB.prepare(
    "SELECT * FROM enemies WHERE id = ?"
  ).bind(enemyId).first();
  
  if (!player || !enemy) {
    return c.json({ error: "Player or enemy not found" }, 404);
  }
  
  let damage = 0;
  let healing = 0;
  let result = "";
  
  // Calculate action effects
  switch (action.type) {
    case 'attack':
      damage = Math.floor(Math.random() * 30) + 20; // 20-50 damage
      result = `Você atacou ${enemy.name} causando ${damage} de dano!`;
      break;
    case 'heal':
      healing = Math.floor(Math.random() * 20) + 15; // 15-35 healing
      result = `Você se curou em ${healing} pontos de vida!`;
      break;
    case 'purify':
      damage = Math.floor(Math.random() * 40) + 30; // 30-70 damage to pollution enemies
      result = `Você purificou a área causando ${damage} de dano!`;
      break;
  }
  
  // Apply effects
  let newPlayerHealth = player.health;
  let newEnemyHealth = enemy.health;
  
  if (action.type === 'heal') {
    newPlayerHealth = Math.min(player.max_health, player.health + healing);
  } else {
    newEnemyHealth = Math.max(0, enemy.health - damage);
  }
  
  // Enemy counter-attack if alive
  let enemyDamage = 0;
  if (newEnemyHealth > 0 && action.type !== 'heal') {
    enemyDamage = Math.floor(Math.random() * enemy.attack_power) + 5;
    newPlayerHealth = Math.max(0, newPlayerHealth - enemyDamage);
    result += ` ${enemy.name} contra-atacou causando ${enemyDamage} de dano!`;
  }
  
  // Update player health
  await c.env.DB.prepare(
    "UPDATE players SET health = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(newPlayerHealth, playerId).run();
  
  // Check if enemy is defeated
  const enemyDefeated = newEnemyHealth <= 0;
  let experienceGained = 0;
  
  if (enemyDefeated) {
    experienceGained = Math.floor(Math.random() * 20) + 10;
    result += ` ${enemy.name} foi derrotado! Você ganhou ${experienceGained} de experiência!`;
    
    // Update player experience
    await c.env.DB.prepare(
      "UPDATE players SET experience = experience + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(experienceGained, playerId).run();
  }
  
  return c.json({
    result,
    player_health: newPlayerHealth,
    enemy_health: newEnemyHealth,
    enemy_defeated: enemyDefeated,
    experience_gained: experienceGained
  });
});

// Get available quests
app.get("/api/quests", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM quests WHERE is_completed = 0 ORDER BY id"
  ).all();
  
  return c.json(results);
});

export default app;
