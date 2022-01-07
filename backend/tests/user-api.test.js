const bcrypt = require("bcryptjs");

const { registerUser, loginUser } = require("../api/user");

describe("/user/register", () => {
  describe("when passed valid user credentials", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORD1?",
          confirmationPassword: "passWORD1?",
          staySignedIn: true,
        },
      },
      service: {
        database: {
          createUser: jest.fn(),
        },
      },
    };
    const res = {};
    const next = jest.fn();

    afterEach(() => {
      req.service.database.createUser.mockClear();
      next.mockClear();
    });

    it("should call database.createUser", async () => {
      await registerUser(req, res, next);
      expect(req.service.database.createUser).toHaveBeenCalledTimes(1);
    });

    it("should call database.createUser with hashed login details", async () => {
      await registerUser(req, res, next);
      const userDetails = req.service.database.createUser.mock.calls[0][0];

      expect(userDetails.email).toBe(req.body.userDetails.email);
      expect(userDetails.password.length).toBe(60);
    });

    it("should call next", async () => {
      await registerUser(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("when error occurs with database handler", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORD1?",
          confirmationPassword: "passWORD1?",
          staySignedIn: true,
        },
      },
      service: {
        database: {
          createUser: (userDetails) => {
            throw new Error("Database error");
          },
        },
      },
    };
    const res = {};
    const next = jest.fn();

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    afterEach(() => {
      res.status.mockClear();
      res.json.mockClear();
      next.mockClear();
    });

    it("should return a 400 status", async () => {
      await registerUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await registerUser(req, res, next);
      const error = res.json.mock.calls[0][0];

      expect(error).toHaveProperty("error");
    });
  });
});

describe("/user/login", () => {
  describe("when user logs in correctly", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORD1?",
          staySignedIn: true,
        },
      },
      service: {
        database: {
          getUser: jest.fn((userDetails) => {
            const password = bcrypt.hashSync("passWORD1?", 10);
            return { password: password };
          }),
        },
      },
    };
    const res = {};
    const next = jest.fn();

    afterEach(() => {
      req.service.database.getUser.mockClear();
      next.mockClear();
    });

    it("should call database.getUser", async () => {
      await loginUser(req, res, next);
      expect(req.service.database.getUser).toHaveBeenCalledTimes(1);
    });

    it("email should be passed to database.getUser", async () => {
      await loginUser(req, res, next);
      const getUserArgument = req.service.database.getUser.mock.calls[0][0];

      expect(getUserArgument).toBe(req.body.userDetails.email);
    });

    it("should call next", async () => {
      await loginUser(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("when passed password doesn't match stored password", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "password1?",
          staySignedIn: true,
        },
      },
      service: {
        database: {
          getUser: jest.fn((userDetails) => {
            const password = bcrypt.hashSync("passWORD1?", 10);
            return { password: password };
          }),
        },
      },
    };
    const res = {};
    const next = jest.fn();

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    afterEach(() => {
      res.status.mockClear();
      res.json.mockClear();
      next.mockClear();
    });

    it("should return a 400 status", async () => {
      await loginUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await loginUser(req, res, next);
      const json = res.json.mock.calls[0][0];

      expect(json.error.message).toBe("Incorrect password");
    });
  });

  describe("when error occurs with database handler", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORD1?",
          staySignedIn: true,
        },
      },
      service: {
        database: {
          getUser: (userDetails) => {
            throw new Error("Database error");
          },
        },
      },
    };
    const res = {};
    const next = jest.fn();

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    afterEach(() => {
      res.status.mockClear();
      res.json.mockClear();
      next.mockClear();
    });

    it("should return a 400 status", async () => {
      await loginUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await loginUser(req, res, next);
      const json = res.json.mock.calls[0][0];

      expect(json).toHaveProperty("error");
    });
  });
});
