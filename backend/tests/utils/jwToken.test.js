const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../../utils/jwToken");
const { getPrivateKey } = require("../../utils/getEncryptionKeys");

const privateKey = getPrivateKey();
const jwtRegex = /^[^.]+\.[^.]+\.[^.]+$/;

describe("generateAccessToken", () => {
  const payload = {
    userId: 0,
  };

  it("should return a string", () => {
    const accessToken = generateAccessToken(payload);

    expect(typeof accessToken).toBe("string");
  });

  it("returned string should be jwt", () => {
    const accessToken = generateAccessToken(payload);

    expect(accessToken).toMatch(jwtRegex);
  });
});

describe("generateRefreshToken", () => {
  const payload = {
    userId: 0,
  };

  it("should return a string", () => {
    const refreshToken = generateRefreshToken(payload);

    expect(typeof refreshToken).toBe("string");
  });

  it("returned string should be jwt", () => {
    const refreshToken = generateRefreshToken(payload);

    expect(refreshToken).toMatch(jwtRegex);
  });
});

describe("verifyToken", () => {
  const payload = {
    userId: 0,
  };

  describe("when token is valid", () => {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "HS256",
      expiresIn: 60 * 5,
    });

    it("should return an object", () => {
      const result = verifyToken(accessToken);

      expect(result).toBeInstanceOf(Object);
    });

    it("should return the payload", () => {
      const result = verifyToken(accessToken);

      expect(result).toHaveProperty("userId");
    });
  });

  describe("when token has expired", () => {
    const accessToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "HS256",
      expiresIn: 0 - 60 * 5,
    });

    it("should return a TokenExpiredError", () => {
      const result = verifyToken(accessToken);

      expect(result).toBeInstanceOf(jwt.TokenExpiredError);
    });
  });

  describe("when token is not authorized", () => {
    const accessToken = jwt.sign({ userId: 0 }, "not-valid", {
      algorithm: "HS256",
      expiresIn: 60 * 5,
    });

    it("should return a JsonWebTokenError", () => {
      const result = verifyToken(accessToken);

      expect(result).toBeInstanceOf(jwt.JsonWebTokenError);
    });
  });
});
