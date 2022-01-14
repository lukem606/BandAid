const jwt = require("jsonwebtoken");
const fs = require("fs");

const { getPrivateKey } = require("../../utils/getEncryptionKeys");
const userAuthentication = require("../../middleware/userAuthentication");

const privateKey = getPrivateKey();

describe("userAuthentication", () => {
  describe("when request contains valid access token", () => {
    const accessToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "HS256",
      expiresIn: 60 * 5,
    });

    const refreshToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "HS256",
      expiresIn: 60 * 60 * 24 * 14,
    });

    const req = {
      header: {
        get: jest.fn().mockReturnValue(accessToken),
      },
      cookies: {
        __refresh_token: refreshToken,
      },
    };
    const res = {
      cookie: jest.fn(),
      set: jest.fn(),
    };
    const next = jest.fn();

    afterEach(() => {
      res.cookie.mockClear();
      next.mockClear();
    });

    it("should generate a new refresh token", async () => {
      await userAuthentication(req, res, next);

      expect(res.set.mock.calls[0][0]).toBe("Authorization");
      expect(res.set.mock.calls[0][1]).toBe(`Bearer ${accessToken}`);
      expect(res.cookie.mock.calls[0][0]).toBe("__refresh_token");
      expect(res.cookie.mock.calls[0][1]).not.toBe(refreshToken);
    });

    it("should call next", async () => {
      await userAuthentication(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("when request contains expired access token", () => {
    const accessToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "HS256",
      expiresIn: 0 - 60 * 5,
    });

    const refreshToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "HS256",
      expiresIn: 60 * 60 * 24 * 14,
    });

    const req = {
      header: jest.fn().mockReturnValue(accessToken),
      cookies: {
        __refresh_token: refreshToken,
      },
    };
    const res = {
      cookie: jest.fn(),
      set: jest.fn(),
    };
    const next = jest.fn();

    afterEach(() => {
      req.header.mockClear();
      res.cookie.mockClear();
      res.set.mockClear();
      next.mockClear();
    });

    it("should generate new access and refresh tokens", async () => {
      await userAuthentication(req, res, next);

      expect(res.set.mock.calls[0][0]).toBe("Authorization");
      expect(res.set.mock.calls[0][1]).not.toBe(`Bearer ${accessToken}`);
      expect(res.cookie.mock.calls[0][0]).toBe("__refresh_token");
      expect(res.cookie.mock.calls[0][1]).not.toBe(refreshToken);
    });

    it("should call next", async () => {
      await userAuthentication(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("when request contains invalid access token but valid refresh token", () => {
    const accessToken = jwt.sign({ userId: 0 }, "not-valid", {
      algorithm: "HS256",
      expiresIn: 60 * 5,
    });

    const refreshToken = jwt.sign({ userId: 0 }, privateKey, {
      algorithm: "HS256",
      expiresIn: 60 * 60 * 24 * 14,
    });

    const req = {
      header: jest.fn().mockReturnValue(accessToken),
      cookies: {
        __refresh_token: refreshToken,
      },
    };
    const res = {
      clearCookie: jest.fn(),
      removeHeader: jest.fn(),
      redirect: jest.fn(),
    };
    const next = jest.fn();

    afterEach(() => {
      req.header.mockClear();
      res.clearCookie.mockClear();
      res.removeHeader.mockClear();
      res.redirect.mockClear();
      next.mockClear();
    });

    it("should respond with 301 status", async () => {
      await userAuthentication(req, res, next);

      expect(res.redirect.mock.calls[0][0]).toBe(301);
      expect(res.redirect.mock.calls[0][1]).toBe("/login");
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
      algorithm: "HS256",
      expiresIn: 60 * 60 * 24 * 14,
    });

    const req = {
      cookies: {
        __refresh_token: refreshToken,
      },
    };
    const res = {
      clearCookie: jest.fn(),
      redirect: jest.fn(),
    };
    const next = jest.fn();

    afterEach(() => {
      res.redirect.mockClear();
      next.mockClear();
    });

    it("should respond with 301 status", async () => {
      await userAuthentication(req, res, next);

      expect(res.redirect.mock.calls[0][0]).toBe(301);
      expect(res.redirect.mock.calls[0][1]).toBe("/login");
    });

    it("should clear __refresh_token cookie", async () => {
      await userAuthentication(req, res, next);

      expect(res.clearCookie.mock.calls[0][0]).toBe("__refresh_token");
    });
  });
});
