import { getAllCards } from "../models/cardModel.js";

// controller: get all cards
export const allCards = async (req, res) => {
  try {
    // getAllCards(Model-SQL)
    const cards = await getAllCards();
    console.log(cards);
    res.status(200).json(cards);
  } catch (error) {
    console.error("error fetching cards:", error);
    res.status(500).json({ error: "failed to fetch cards" });
  }
};
