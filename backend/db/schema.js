const readline = require("readline");
const db = require("./index");

const initialiseDatabase = async () => {
  const usersTable = `
    DROP TABLE IF EXISTS users CASCADE;
    
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        password CHAR(60) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

  // const sessionsTable = `
  //     DROP TABLE IF EXISTS sessions CASCADE;

  //     CREATE TABLE sessions (
  //       id SERIAL PRIMARY KEY,
  //       user_id INTEGER NOT NULL,
  //       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //       FOREIGN KEY (user_id) REFERENCES users(id)
  //     );
  //   `;

  const bandsTable = `
    DROP TABLE IF EXISTS bands CASCADE;
    
    CREATE TABLE bands (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

  const eventsTable = `
    DROP TABLE IF EXISTS events CASCADE;
    
    CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        band_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        type VARCHAR(100),
        location TEXT,
        start_time TIME,
        end_time TIME,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (band_id) REFERENCES bands(id)
    );
    `;

  const bandMembersTable = `
    DROP TABLE IF EXISTS band_members CASCADE;

    CREATE TABLE band_members (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        band_id INTEGER NOT NULL,
        admin BOOLEAN DEFAULT FALSE,
        role VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(band_id) REFERENCES bands(id)
    );
    `;

  try {
    console.log("Creating users table");
    const users = await db.query(usersTable);

    console.log("Creating bands table");
    const bands = await db.query(bandsTable);

    console.log("Creating events table");
    const events = await db.query(eventsTable);

    console.log("Creating band members table");
    const bandMembers = await db.query(bandMembersTable);
  } catch (e) {
    console.log(e);
  }
};

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

input.question(
  "Running schema.ts will wipe all database data, are you sure you want to run? [y/n]\n> ",
  async (answer) => {
    if (answer.toLowerCase() === "n") {
      process.exit(0);
    }

    await initialiseDatabase();
    input.close();
  }
);
