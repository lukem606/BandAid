const database = require("../utils/database");

const exposeService = async (req, res, next) => {
  req.service = getService();
  next();
};

const getService = () => {
  return {
    database: {
      createUser: createUser,
      getUser: getUser,
    },
  };
};

const createUser = async (userDetails) => {
  try {
    const { email, password } = userDetails;

    if (!email || !password) {
      throw new Error("createUser requires email and password hash");
    }

    const query = `INSERT INTO users (email, password) VALUES ($1, $2);`;
    const params = [email, password];

    await database.query(query, params);
  } catch (e) {
    return e;
  }
};

const getUser = async (email) => {
  try {
    if (!email) {
      throw new Error("getUser requires email");
    }

    const query = `SELECT email, password FROM users WHERE email = $1;`;
    const params = [email];

    const result = await database.query(query, params);
    const userDetails = result.rows[0];

    return userDetails;
  } catch (e) {
    return e;
  }
};

module.exports = exposeService;
