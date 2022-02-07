const fs = require("fs");
const { generateKeyPair } = require("crypto");

const generateAsymmetricKey = () => {
  generateKeyPair(
    "rsa",
    {
      modulusLength: 2048,
      publicExponent: 0x10101,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    },
    (error, publicKey, privateKey) => {
      if (!error) {
        writeKeyToFile(privateKey, "private");
        writeKeyToFile(publicKey, "public");
      } else {
        console.log(error);
      }
    }
  );
};

const writeKeyToFile = (key, fileName) => {
  fs.writeFile(`./${fileName}.key`, key, (error) => {
    if (error) {
      console.log(error);
    }
  });
};

generateAsymmetricKey();
