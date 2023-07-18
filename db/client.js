import pg from "pg";

export const dbClient = new pg.Client({
  connectionString:
    "postgresql://postgres:d2e9n7VfXVPVhatf@db.siywtvvbtmamcuuaaztu.supabase.co:5432/postgres",
});
console.log("hi");
await dbClient.connect();

const result = await dbClient.query("SELECT * from users");
console.log("~~~ results, ", result.rows);
