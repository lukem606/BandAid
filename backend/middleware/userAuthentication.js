const fs = require("fs");

const userAuthentication = (req, res, next) => {
  const accessToken = req.header("Authorization");
  const refreshToken = req.cookies.__refresh_token;

  try {
    /*
    
    Verify access token
    
    If valid;
      Generate new refresh token and add to res
      Call next

    If expired;
      Verify refresh token

      If valid;
        Generate new access and refresh tokens, add to res
        Call next

      If invalid;
        Redirect to login

    If invalid;
      Redirect to login

      */
  } catch (e) {
    console.log(e);
  }
};

module.exports = userAuthentication;
