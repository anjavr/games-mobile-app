export async function createUserTable(db) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS "user" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "username" TEXT UNIQUE NOT NULL,
        "password" TEXT NOT NULL
      );
    `);
}

export async function insertUser(db, user) {
  try {
    await db.runAsync(
      `INSERT INTO user (username, password) VALUES (?, ?)`,
      [user.username, user.password]
    );

    const inserted = await db.getFirstAsync(
      `SELECT id FROM user WHERE username = ? LIMIT 1`,
      [user.username]
    );

    console.log(`Korisnik ${user.username} kreiran sa ID:`, inserted?.id);
    return inserted?.id || null;

  } catch (error) {

    if (error?.message?.includes("UNIQUE constraint failed")) {

      const existingUser = await db.getFirstAsync(
        `SELECT id FROM user WHERE username = ? LIMIT 1`,
        [user.username]
      );

      console.log(
        `Korisnik ${user.username} već postoji sa ID:`,
        existingUser?.id
      );

      return existingUser?.id || null;
    }

    console.error("Greška pri kreiranju korisnika:", error);
    return null;
  }
}




// Login korisnika
export async function loginUser(db, username, password) {
  try {
    const allUsers = await db.getAllAsync(`SELECT id, username, password FROM "user"`);
    console.log("DEBUG svi korisnici u bazi:", allUsers);

    console.log(`Pokušaj login-a: ${username} / ${password}`);

    const result = await db.getFirstAsync(
      `SELECT * FROM "user" WHERE username = ? AND password = ? LIMIT 1`,
      [username, password]
    );

    return result || null;

  } catch (error) {
    console.error("Greška pri loginu:", error);
    return null;
  }
}


export async function getUserById(db, userId) {
  try {
    const user = await db.getFirstAsync(
      `SELECT id, username, password FROM user WHERE id = ?`,
      [userId]
    );
    return user || null;
  } catch (error) {
    console.error("Greška pri dohvatu korisnika:", error);
    return null;
  }
}
