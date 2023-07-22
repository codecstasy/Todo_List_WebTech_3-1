import Router from "express-promise-router";
import { dbClient } from "../db/client.js";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const JWT_SECRET_KEY = "abra-ca-debra-123";
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

// export our router to be mounted by the parent application
export default router;

const createTodo = async (title, userId) => {
  return await dbClient.query(
    `
        INSERT INTO todos (
            title,
            user_id
        )
        VALUES
            ('${title}', '${userId}'); 
        `
  );
};

const getTodosByUserId = async (userId) => {
  const { rows } = await dbClient.query(
    `SELECT * FROM todos JOIN todo_item ON todos.id=todo_item.todo_id where todos.user_id='${userId}' ORDER BY todo_item.created_at ASC;`
  );
  return rows;
};

const getSingleTodoByUserId = async (userId) => {
  const { rows } = await dbClient.query(
    `SELECT * FROM todos where todos.user_id='${userId}';`
  );
  return rows;
};

// get all todos
router.get("/", async (req, res) => {
  const { userId } = req.query;
  const todos = await getTodosByUserId(userId);
  if (todos.length === 0) {
    createTodo("", userId);
  }

  const newTodos = await getTodosByUserId(userId);
  res.send(newTodos);
});

const createTodoItem = async (value, todoId) => {
  return await dbClient.query(
    `
        INSERT INTO todo_item (
            value,
            todo_id
        )
        VALUES
            ('${value}', '${todoId}'); 
        `
  );
};

router.post("/add-todo-item", async (req, res) => {
  const { value, userId } = req.body;
  console.log("~~~ 1 value", value, userId);

  const todos = await getSingleTodoByUserId(userId);
  console.log("~~~ value", value, userId, todos);

  await createTodoItem(value, todos[0].id);
  const newTodos = await getTodosByUserId(userId);
  res.send(newTodos);
});

const deleteTodoItem = async (todoId) => {
  return await dbClient.query(
    `
        DELETE from todo_item where id='${todoId}';
        `
  );
};
router.post("/delete-todo-item", async (req, res) => {
  const { todoItemId, userId } = req.body;
  await deleteTodoItem(todoItemId);
  const newTodos = await getTodosByUserId(userId);
  res.send(newTodos);
});

const updateTodoItem = async (value, isDone, todoItemId) => {
  return await dbClient.query(
    `
      UPDATE todo_item
      SET value = '${value}',
          is_done = ${isDone}
      WHERE id = '${todoItemId}';
        `
  );
};

router.post("/update-todo-item", async (req, res) => {
  console.log("~~~ req.body", req.body);

  const { value, isDone, userId, todoItemId } = req.body;
  await updateTodoItem(value, isDone, todoItemId);
  const rows = await getTodosByUserId(userId);
  res.send(rows);
});
