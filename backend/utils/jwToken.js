const jwt = require("jsonwebtoken");
const { getPublicKey, getPrivateKey } = require("./getEncryptionKeys");

const publicKey = getPublicKey();
const privateKey = getPrivateKey();

const generateAccessToken = (payload) => {
  if (payload.hasOwnProperty("exp")) {
    delete payload.exp;
  }

  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: 60 * 5,
  });

  return accessToken;
};

const generateRefreshToken = (payload) => {
  if (payload.hasOwnProperty("exp")) {
    delete payload.exp;
  }

  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: 60 * 60 * 24 * 14,
  });

  return refreshToken;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, publicKey, { algorithm: "RS256" });
  } catch (error) {
    return error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
