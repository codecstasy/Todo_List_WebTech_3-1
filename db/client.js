import pg from "pg";

export const dbClient = new pg.Client({
  connectionString:
    "postgresql://postgres:Shattik_2023@db.lokznrqtrearfewwvmqs.supabase.co:5432/postgres",
});
console.log("hi");
await dbClient.connect();

const result = await dbClient.query("SELECT * from users");
console.log("~~~ results, ", result.rows);
