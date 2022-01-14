const {
  getPublicKey,
  getPrivateKey,
} = require("../../utils/getEncryptionKeys");

describe("getPublicKey", () => {
  describe("when successful", () => {
    it("should return a string", async () => {
      const publicKey = await getPublicKey();

      expect(typeof publicKey).toBe("string");
    });

    it("return value should not be empty", async () => {
      const publicKey = await getPublicKey();

      expect(publicKey.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("when unsuccessful", () => {
    process.chdir("./api");

    it("should return an error", async () => {
      try {
        const publicKey = await getPublicKey();
      } catch (error) {
        expect(error).toMatch("error");
      }
    });

    process.chdir("..");
  });
});

describe("getPrivateKey", () => {
  describe("when successful", () => {
    it("should return a string", async () => {
      const privateKey = await getPrivateKey();

      expect(typeof privateKey).toBe("string");
    });

    it("return value should not be empty", async () => {
      const privateKey = await getPrivateKey();

      expect(privateKey.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("when unsuccessful", () => {
    process.chdir("./api");

    it("should return an error", async () => {
      try {
        const privateKey = await getPrivateKey();
      } catch (error) {
        expect(error).toMatch("error");
      }
    });

    process.chdir("..");
  });
});
