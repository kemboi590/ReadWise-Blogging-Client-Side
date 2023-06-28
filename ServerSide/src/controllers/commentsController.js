import sql from "mssql";
import config from "../db/config.js";

//get comments of a blog
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("id", sql.VarChar, id)
      .query("EXEC CommentDetails @PostID = @id");
    res.status(200).json(result.recordsets[0]);
  } catch (error) {
    res.status(201).json(error.message);
  }
};

//CREATE COMMENT
export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { UserID } = req.user;

    const { Coment, CreatedAt } = req.body;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("UserID", sql.Int, UserID)
      .input("Coment", sql.VarChar, Coment)
      .input("CreatedAt", sql.VarChar, CreatedAt)
      .query(
        "INSERT INTO Comments (PostID, UserID, Coment, CreatedAt) VALUES (@id, @UserID, @Coment,GETDATE())"
      );
    res.status(200).json("Comment created successfully");
  } catch (error) {
    res.status(201).json({ error: error.message });
  }
};

//update comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { Coment } = req.body;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("id", sql.VarChar, id)
      .input("Coment", sql.VarChar, Coment)
      .query("UPDATE Comments SET Coment = @Coment WHERE CommentID = @id");
    res.status(200).json("Comment updated successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    sql.close();
  }
};

//delete comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("id", sql.VarChar, id)
      .query("DELETE FROM Comments WHERE CommentID = @id");
    res.status(200).json("Comment deleted successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    sql.close();
  }
};
