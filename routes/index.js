// ./routes/index.js
import users from "./user.js";
import todoRouter from "./todo.js";

const mountRoutes = (app) => {
  app.use("/users", users);
  app.use("/todos", todoRouter);
  // etc..
};

export default mountRoutes;
