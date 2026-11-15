import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

try {
  const tables = await sql`
    select table_name
    from information_schema.tables
    where table_name in ('questions', 'mobile_refresh_tokens', 'quiz_attempts')
    order by table_name
  `;
  console.log("tables:", tables.map((row) => row.table_name));

  const columns = await sql`
    select table_name, column_name, data_type
    from information_schema.columns
    where table_name in ('questions', 'mobile_refresh_tokens', 'quiz_attempts')
    order by table_name, ordinal_position
  `;
  console.log(columns);
} finally {
  await sql.end();
}
