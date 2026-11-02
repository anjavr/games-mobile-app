export async function createGameTable(db) {
  await db.execAsync(`
    PRAGMA journal_mode = 'wal';

    CREATE TABLE IF NOT EXISTS "game" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "name" TEXT UNIQUE NOT NULL,
      "short_description" TEXT UNIQUE NOT NULL,
      "description" TEXT NOT NULL,
      "rules" TEXT NOT NULL,
      "yt_link" TEXT NOT NULL
    );
  `);
}

export async function insertGame(db, name, short_description, description, rules, yt_link) {
  try {
    const statement = await db.prepareAsync(
      `INSERT INTO game (name, short_description, description, rules, yt_link)
       VALUES (?, ?, ?, ?, ?)`
    );

    await statement.executeAsync([name, short_description, description, rules, yt_link]);
    await statement.finalizeAsync();

    console.log("Game inserted successfully!");
    return true;

  } catch (error) {
    console.error("Error inserting game:", error);
    return false;
  }
}

export async function getGames(db) {
  try {
    const games = await db.getAllAsync(`SELECT * FROM game`);
    return games; 
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}

export async function getGameById(db, id) {
  try {
    const game = await db.getFirstAsync(
      "SELECT * FROM game WHERE id = ?",
      [id]
    );
    return game ?? null;
  } catch (error) {
    console.error("Error fetching game by id:", error);
    return null;
  }
}



