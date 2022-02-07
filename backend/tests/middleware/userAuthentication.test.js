const jwt = require("jsonwebtoken");
const fs = require("fs");

const {
  getPrivateKey,
  getPublicKey,
} = require("../../utils/getEncryptionKeys");
const userAuthentication = require("../../middleware/userAuthentication");

const privateKey = getPrivateKey();
const publicKey = getPublicKey();

describe("userAuthentication", () => {
  describe("when request contains valid access token", () => {
    const accessToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "RS256",
      expiresIn: 60 * 5,
    });

    const refreshToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "RS256",
      expiresIn: 60 * 60 * 24 * 14,
    });

    const req = {
      get: jest.fn().mockReturnValue(accessToken),
      cookies: {
        __refresh_token: refreshToken,
      },
    };
    const res = {
      cookie: jest.fn(),
    };
    const next = jest.fn();

    afterEach(() => {
      req.get.mockClear();
      res.cookie.mockClear();
      next.mockClear();
    });

    it("should generate a new refresh token", async () => {
      await userAuthentication(req, res, next);

      expect(res.cookie.mock.calls[0][0]).toBe("__refresh_token");
    });

    it("should call next", async () => {
      await userAuthentication(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("when request contains expired access token", () => {
    const accessToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "RS256",
      expiresIn: 0 - 60 * 5,
    });

    const refreshToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "RS256",
      expiresIn: 60 * 60 * 24 * 14,
    });

    const req = {
      get: jest.fn().mockReturnValue(accessToken),
      cookies: {
        __refresh_token: refreshToken,
      },
    };
    const res = {
      clearCookie: jest.fn(),
      cookie: jest.fn(),
      set: jest.fn(),
    };
    const next = jest.fn();

    afterEach(() => {
      req.get.mockClear();
      res.cookie.mockClear();
      res.set.mockClear();
      next.mockClear();
    });

    it("should generate new access token", async () => {
      await userAuthentication(req, res, next);

      expect(res.set.mock.calls[0][0]).toBe("Authorization");
      expect(res.set.mock.calls[0][1]).toEqual(
        expect.not.stringMatching(accessToken)
      );
    });

    it("should call next", async () => {
      await userAuthentication(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("when request contains invalid access token but valid refresh token", () => {
    const accessToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "HS256",
      expiresIn: 60 * 5,
    });

    const refreshToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "RS256",
      expiresIn: 60 * 60 * 24 * 14,
    });

    const req = {
      get: jest.fn().mockReturnValue(accessToken),
      cookies: {
        __refresh_token: refreshToken,
      },
    };
    const res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      removeHeader: jest.fn(),
    };
    const next = 0;

    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    afterEach(() => {
      req.get.mockClear();
      res.clearCookie.mockClear();
      res.json.mockClear();
      res.removeHeader.mockClear();
      res.status.mockClear();
    });

    it("should respond with 401 status", async () => {
      await userAuthentication(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return json with error message", async () => {
      await userAuthentication(req, res, next);
      const json = res.json.mock.calls[0][0];

      expect(json.error).toBe("Invalid access token");
    });

    it("should clear __refresh_token cookie", async () => {
      await userAuthentication(req, res, next);

      expect(res.clearCookie.mock.calls[0][0]).toBe("__refresh_token");
    });

    it("should clear 'Authorization' header", async () => {
      await userAuthentication(req, res, next);

      expect(res.removeHeader.mock.calls[0][0]).toBe("Authorization");
    });
  });

  describe("when request contains refresh token but no access token", () => {
    const refreshToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "RS256",
      expiresIn: 60 * 60 * 24 * 14,
    });

    const req = {
      get: jest.fn().mockReturnValue(undefined),
      cookies: {
        __refresh_token: jest.fn().mockReturnValue(refreshToken),
      },
    };
    const res = {
      clearCookie: jest.fn(),
      removeHeader: jest.fn(),
    };
    const next = 0;

    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    afterEach(() => {
      req.get.mockClear();
      req.cookies.__refresh_token.mockClear();
      res.clearCookie.mockClear();
      res.json.mockClear();
      res.removeHeader.mockClear();
      res.status.mockClear();
    });

    it("should respond with 401 status", async () => {
      await userAuthentication(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return json with error message", async () => {
      await userAuthentication(req, res, next);
      const json = res.json.mock.calls[0][0];

      expect(json.error).toBe("No access token");
    });

    it("should clear __refresh_token cookie", async () => {
      await userAuthentication(req, res, next);

      expect(res.clearCookie.mock.calls[0][0]).toBe("__refresh_token");
    });
  });
});
