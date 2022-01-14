const jwt = require("jsonwebtoken");
const { getPublicKey, getPrivateKey } = require("./getEncryptionKeys");

const publicKey = getPublicKey();
const privateKey = getPrivateKey();

const generateAccessToken = (payload) => {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "HS256",
    expiresIn: 60 * 5,
  });

  return accessToken;
};

const generateRefreshToken = (payload) => {
  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: "HS256",
    expiresIn: 60 * 60 * 24 * 14,
  });

  return refreshToken;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, privateKey);
  } catch (error) {
    return error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
