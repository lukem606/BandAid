const validate = require("validate.js");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ ~!?@#$%^&*+\-_,.{}])[a-zA-Z\d~!?@#$%^&*+\-_,.{}]*$/;

const schema = {
  email: {
    presence: true,
    type: "string",
    email: {
      message: "address is not valid",
    },
  },
  password: {
    presence: true,
    type: "string",
    length: {
      minimum: 8,
      maximum: 40,
    },
    format: {
      pattern: passwordRegex,
      message:
        "must contain an upper and a lowercase letter, a number and a special character ~!?@#$%^&*+-_,.{}",
    },
  },
  confirmationPassword: {
    presence: false,
    type: "string",
    equality: "password",
  },
  staySignedIn: {
    presence: false,
    type: "boolean",
  },
};

const userValidation = async (req, res, next) => {
  const { userDetails } = req.body;

  try {
    await validate.async(userDetails, schema);

    next();
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

module.exports = userValidation;
