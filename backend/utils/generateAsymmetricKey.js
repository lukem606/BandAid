const fs = require("fs");
const { generateKeyPair } = require("crypto");

const generateAsymmetricKey = () => {
  generateKeyPair(
    "rsa",
    {
      modulusLength: 2048,
      publicExponent: 0x10101,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "der",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "der",
      },
    },
    (error, publicKey, privateKey) => {
      if (!error) {
        fs.writeFile("./public.key", publicKey.toString("hex"), (err) => {
          if (error) {
            console.log(error);
          }
        });

        fs.writeFile("./private.key", privateKey.toString("hex"), (err) => {
          if (error) {
            console.log(error);
          }
        });
      } else {
        console.log(error);
      }
    }
  );
};

generateAsymmetricKey();
