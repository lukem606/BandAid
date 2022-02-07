const jwt = require("jsonwebtoken");

const jwToken = require("../utils/jwToken");

const userAuthentication = (req, res, next) => {
  const accessToken = req.get("Authorization");
  const refreshToken = req.cookies.__refresh_token;

  try {
    if (!accessToken) {
      throw new Error("No access token");
    } else if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const accessTokenPayload = jwToken.verifyToken(accessToken);
    const refreshTokenPayload = jwToken.verifyToken(refreshToken);

    if (
      accessTokenPayload instanceof jwt.JsonWebTokenError &&
      !(accessTokenPayload instanceof jwt.TokenExpiredError)
    ) {
      throw new Error("Invalid access token");
    }

    if (accessTokenPayload instanceof jwt.TokenExpiredError) {
      if (refreshTokenPayload instanceof Error) {
        throw new Error("Invalid refresh token");
      }

      const newAccessToken = jwToken.generateAccessToken({
        accessTokenPayload,
      });

      res.set("Authorization", newAccessToken);
      next();
    } else {
      const newRefreshToken = jwToken.generateRefreshToken(refreshTokenPayload);

      res.cookie("__refresh_token", newRefreshToken);
      next();
    }
  } catch (error) {
    res.clearCookie("__refresh_token");
    res.removeHeader("Authorization");
    res.status(401).json({ error: error.message });
  }
};

module.exports = userAuthentication;
