const fs = require("fs");

const getPublicKey = () => {
  try {
    publicKey = fs.readFileSync("./public.key");
    return publicKey;
  } catch (e) {
    return e;
  }
};

const getPrivateKey = () => {
  try {
    privateKey = fs.readFileSync("./private.key");
    return privateKey;
  } catch (e) {
    return e;
  }
};

module.exports = {
  getPublicKey,
  getPrivateKey,
};
