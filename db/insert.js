import { dbClient } from "./client";

const insertUser = () => {
  dbClient.connect(() => {
    dbClient.query(
      `
        INSERT INTO employee (
            name,
            email,
            password
        )
        VALUES
            ("Sumon", "s@gmail.com", "334"); 
        `
    );
  });
};

insertUser();
