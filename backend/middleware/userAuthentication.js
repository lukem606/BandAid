const userAuthentication = (req, res, next) => {
  console.log("USER AUTH");

  res
    .set({
      "access-token": "token",
    })
    .status(200)
    .json({ ham: "salad" });

  // next();
};

module.exports = userAuthentication;
