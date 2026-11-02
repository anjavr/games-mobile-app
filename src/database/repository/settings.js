export async function createSettingsTable(db) {
  await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    PRAGMA foreign_keys = ON;

    CREATE TABLE "settings" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "user_id" INTEGER NOT NULL,
      "language" TEXT NOT NULL,
      "theme" TEXT NOT NULL,
      CONSTRAINT "fk_user"
        FOREIGN KEY ("user_id") REFERENCES "user" ("id")
          ON UPDATE NO ACTION
          ON DELETE NO ACTION
    );
  `);
}

export async function getSettings(db, userId) {
  const result = await db.getFirstAsync(
    "SELECT * FROM settings WHERE user_id = ? LIMIT 1",
    [userId]
  );
  return result;
}

export async function insertSettings(db, userId, language = "en", theme = "light") {
  try {
    await db.runAsync(
      `INSERT INTO settings (user_id, language, theme)
       VALUES (?, ?, ?)`,
      [userId, language, theme]
    );

    return true;
  } catch (error) {
    console.error("Error inserting settings:", error);
    return false;
  }
}

export async function updateSettings(db, userId, language, theme) {
  try {
    await db.runAsync(
      `UPDATE settings
       SET language = ?, theme = ?
       WHERE user_id = ?`,
      [language, theme, userId]
    );

    return true;
  } catch (error) {
    console.error("Error updating settings:", error);
    return false;
  }
}
