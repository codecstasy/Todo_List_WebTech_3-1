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

const createUser = async (name, email, password) => {
  return await dbClient.query(
    `
        INSERT INTO users (
            name,
            email,
            password
        )
        VALUES
            ('${name}', '${email}', '${password}'); 
        `
  );
};

const getUserByEmail = async (email) => {
  const { rows } = await dbClient.query(
    `SELECT * FROM users WHERE email='${email}';`
  );
  return rows[0];
};

router.get("/", async (req, res) => {
  const { rows } = await dbClient.query("SELECT * FROM users");
  res.send(rows);
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await getUserByEmail(email);

  if (user) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  console.log("~~~~ name, email, password", { name, email, password });

  await createUser(name, email, passwordHash);
  const newUser = await getUserByEmail(email);
  console.log("~~~~ newUser", newUser);

  const token = jwt.sign(
    { email, name, id: newUser?.id, type: newUser?.type },
    JWT_SECRET_KEY ?? ""
  );

  return res.status(200).json({
    user: {
      email,
      name: newUser?.name,
      id: newUser?.id,
    },
    token,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("~~~~ email, password", email, password);

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({ message: "Not found" });
  }

  const isPasswordSame = await bcrypt.compare(password, user.password);

  if (!isPasswordSame) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "Wrong password" });
  }

  const token = jwt.sign(
    { email, name: user.name, id: user.id },
    JWT_SECRET_KEY ?? ""
  );

  return res.status(200).send({
    user: {
      email,
      name: user?.name,
      id: user?.id,
    },
    token,
  });
});
