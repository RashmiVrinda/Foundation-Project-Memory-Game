// Import database connection
import db from "../db/db_connection.js";

// models/cardModel.js
export const getAllCards = async () => {
  const result = await db.raw("SELECT * FROM card");
  return result;
};
