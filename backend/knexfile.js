export default {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./cards.sqlite3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./db/migrations",
    },
  },
};
