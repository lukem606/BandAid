const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://heejhgdx:Bss5fJt7fUst3zzXJiwzDoZps3GjMgHl@tyke.db.elephantsql.com/heejhgdx",
});

const query = async (query, params) => {
  if (params) {
    const response = await pool.query(query, params);
    return response;
  } else {
    const response = await pool.query(query);
    return response;
  }
};

const getClient = async () => {
  const response = await pool.connect();
  return response;
};

module.exports = {
  query: query,
  getClient: getClient,
};
