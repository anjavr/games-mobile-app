export async function createResultTable(db) {
  await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS "result" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "user_id" INTEGER NOT NULL,
      "game_id" INTEGER NOT NULL,
      "score" INTEGER,
      "date_played" TEXT,
      CONSTRAINT "fk_result_user"
        FOREIGN KEY ("user_id") REFERENCES "user" ("id")
          ON UPDATE NO ACTION ON DELETE NO ACTION,
      CONSTRAINT "fk_result_game"
        FOREIGN KEY ("game_id") REFERENCES "game" ("id")
          ON UPDATE NO ACTION ON DELETE NO ACTION
    );
  `);
}

export async function insertResult(db, { userId, gameId, score, datePlayed }) {
  return await db.runAsync(
    `INSERT INTO result (user_id, game_id, score, date_played)
     VALUES (?, ?, ?, ?)`,
    [userId, gameId, score, datePlayed]
  );
}

export async function saveTicTacToeResult(
  db,
  { userId, gameId, winner, playerSymbol, moves, difficulty }
) {
  let baseScore = 0;

  if (winner === playerSymbol) {
    baseScore = 3 + Math.max(0, 10 - moves);
  } else if (winner === "Draw") {
    baseScore = 1;
  }

  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  };

  const multiplier = difficultyMultiplier[difficulty] ?? 1;
  const score = Math.round(baseScore * multiplier);

  const datePlayed = new Date().toISOString();

  try {
    await insertResult(db, { userId, gameId, score, datePlayed });
    console.log(`Score ${score} saved (${difficulty})`);
    return score;
  } catch (error) {
    console.error("Greška pri upisu rezultata:", error);
    throw error;
  }
}


export async function saveSudokuResult(db, { userId, gameId, score }) {
  const datePlayed = new Date().toISOString();

  try {
    await insertResult(db, {
      userId,
      gameId,
      score,
      datePlayed,
    });

    console.log(`Sudoku rezultat sa score ${score} je uspješno sačuvan.`);
    return score;
  } catch (error) {
    console.error("Greška pri čuvanju Sudoku rezultata:", error);
    throw error;
  }
}


export async function saveMemoryResult(
  db,
  { userId, gameId, moves, time }
) {
  const PAIRS = 6;
  const BASE_SCORE = PAIRS * 100; 
  const MIN_MOVES = PAIRS;

  const wrongMoves = Math.max(0, moves - MIN_MOVES);
  const movePenalty = wrongMoves * 20;

  const timeBonus = Math.max(0, 300 - time); 

  let score = BASE_SCORE - movePenalty + timeBonus;
  score = Math.max(0, score); 

  const datePlayed = new Date().toISOString();

  try {
    await insertResult(db, {
      userId,
      gameId,
      score,
      datePlayed,
    });

    console.log(`Memory rezultat sa score ${score} je uspješno sačuvan.`);
    return score;
  } catch (error) {
    console.error("Greška pri čuvanju Memory rezultata:", error);
    throw error;
  }
}


export async function getLeaderboard(db) {
  try {
    const results = await db.getAllAsync(`
      SELECT 
        result.id,
        result.score,
        user.username,
        game.name AS game_name
      FROM result
      JOIN user ON result.user_id = user.id
      JOIN game ON result.game_id = game.id
      ORDER BY result.score DESC
    `);

    return results;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}


export async function getBestScoreForGame(db, userId, gameId) {
  try {
    const result = await db.getFirstAsync(
      `
      SELECT MAX(score) as bestScore
      FROM result
      WHERE user_id = ? AND game_id = ?
      `,
      [userId, gameId]
    );

    return result?.bestScore ?? null;
  } catch (error) {
    console.error("Greška pri dohvatu rezultata:", error);
    return null;
  }
}
