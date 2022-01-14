const {
  registerValidation,
  loginValidation,
} = require("../../middleware/userValidation");

describe("registerValidation", () => {
  describe("when passed valid user details", () => {
    it("should call next", async () => {
      const req = {
        body: {
          userDetails: {
            email: "name@name.co.uk",
            password: "passWORD1?",
            confirmationPassword: "passWORD1?",
            staySignedIn: true,
          },
        },
      };
      const res = {};
      const next = jest.fn();

      await registerValidation(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("when email doesn't contain an extension", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name",
          password: "passWORD1?",
          confirmationPassword: "passWORD1?",
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

    it("should respond with 400 status", async () => {
      await registerValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await registerValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          email: ["Email address is not valid"],
        },
      });
    });
  });

  describe("when email doesn't contain a username", () => {
    const req = {
      body: {
        userDetails: {
          email: "@name.co.uk",
          password: "passWORD1?",
          confirmationPassword: "passWORD1?",
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

    it("should respond with 400 status", async () => {
      await registerValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await registerValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          email: ["Email address is not valid"],
        },
      });
    });
  });

  describe("when password doesn't contain a lowercase letter", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "PASSWORD1?",
          confirmationPassword: "PASSWORD1?",
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

    it("should respond with 400 status", async () => {
      await registerValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await registerValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: [
            "Password must contain an upper and a lowercase letter, a number and a special character ~!?@#$%^&*+-_,.{}",
          ],
        },
      });
    });
  });

  describe("when password doesn't contain an uppercase letter", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "password1?",
          confirmationPassword: "password1?",
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

    it("should respond with 400 status", async () => {
      await registerValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await registerValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: [
            "Password must contain an upper and a lowercase letter, a number and a special character ~!?@#$%^&*+-_,.{}",
          ],
        },
      });
    });
  });

  describe("when password doesn't contain a number", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORD?",
          confirmationPassword: "passWORD?",
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

    it("should respond with 400 status", async () => {
      await registerValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await registerValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: [
            "Password must contain an upper and a lowercase letter, a number and a special character ~!?@#$%^&*+-_,.{}",
          ],
        },
      });
    });
  });

  describe("when password doesn't contain a special character", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORD1",
          confirmationPassword: "passWORD1",
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

    it("should respond with 400 status", async () => {
      await registerValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await registerValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: [
            "Password must contain an upper and a lowercase letter, a number and a special character ~!?@#$%^&*+-_,.{}",
          ],
        },
      });
    });
  });

  describe("when password is less than 8 characters", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "pW1!",
          confirmationPassword: "pW1!",
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

    it("should respond with 400 status", async () => {
      await registerValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await registerValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: ["Password is too short (minimum is 8 characters)"],
        },
      });
    });
  });

  describe("when password is more than 40 characters", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORDpassWORDpassWORDpassWORDpassWORD1?",
          confirmationPassword: "passWORDpassWORDpassWORDpassWORDpassWORD1?",
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

    it("should respond with 400 status", async () => {
      await registerValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await registerValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: ["Password is too long (maximum is 40 characters)"],
        },
      });
    });
  });

  describe("when confirmation password doesn't match password", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORD1?",
          confirmationPassword: "PASSword2!",
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

    it("should respond with 400 status", async () => {
      await registerValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await registerValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          confirmationPassword: [
            "Confirmation password is not equal to password",
          ],
        },
      });
    });
  });
});

/*

WOW WOW WOW WOW WOW WOW WOW WOW WOW WOW 
WOW WOW WOW WOW WOW WOW WOW WOW WOW WOW
WOW WOW WOW WOW WOW WOW WOW WOW WOW WOW
WOW WOW WOW WOW WOW WOW WOW WOW WOW WOW
WOW WOW WOW WOW WOW WOW WOW WOW WOW WOW
WOW WOW WOW WOW WOW WOW WOW WOW WOW WOW
WOW WOW WOW WOW WOW WOW WOW WOW WOW WOW
WOW WOW WOW WOW WOW WOW WOW WOW WOW WOW
WOW WOW WOW WOW WOW WOW WOW WOW WOW WOW
WOW WOW WOW WOW WOW WOW WOW WOW WOW WOW

*/

describe("loginValidation", () => {
  describe("when passed valid user details", () => {
    it("should call next", async () => {
      const req = {
        body: {
          userDetails: {
            email: "name@name.co.uk",
            password: "passWORD1?",
          },
        },
      };
      const res = {};
      const next = jest.fn();

      await loginValidation(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("when email doesn't contain an extension", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name",
          password: "passWORD1?",
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

    it("should respond with 400 status", async () => {
      await loginValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await loginValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          email: ["Email address is not valid"],
        },
      });
    });
  });

  describe("when email doesn't contain a username", () => {
    const req = {
      body: {
        userDetails: {
          email: "@name.co.uk",
          password: "passWORD1?",
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

    it("should respond with 400 status", async () => {
      await loginValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await loginValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          email: ["Email address is not valid"],
        },
      });
    });
  });

  describe("when password doesn't contain a lowercase letter", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "PASSWORD1?",
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

    it("should respond with 400 status", async () => {
      await loginValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await loginValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: [
            "Password must contain an upper and a lowercase letter, a number and a special character ~!?@#$%^&*+-_,.{}",
          ],
        },
      });
    });
  });

  describe("when password doesn't contain an uppercase letter", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "password1?",
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

    it("should respond with 400 status", async () => {
      await loginValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await loginValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: [
            "Password must contain an upper and a lowercase letter, a number and a special character ~!?@#$%^&*+-_,.{}",
          ],
        },
      });
    });
  });

  describe("when password doesn't contain a number", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORD?",
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

    it("should respond with 400 status", async () => {
      await loginValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await loginValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: [
            "Password must contain an upper and a lowercase letter, a number and a special character ~!?@#$%^&*+-_,.{}",
          ],
        },
      });
    });
  });

  describe("when password doesn't contain a special character", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORD1",
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

    it("should respond with 400 status", async () => {
      await loginValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await loginValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: [
            "Password must contain an upper and a lowercase letter, a number and a special character ~!?@#$%^&*+-_,.{}",
          ],
        },
      });
    });
  });

  describe("when password is less than 8 characters", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "pW1!",
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

    it("should respond with 400 status", async () => {
      await loginValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await loginValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: ["Password is too short (minimum is 8 characters)"],
        },
      });
    });
  });

  describe("when password is more than 40 characters", () => {
    const req = {
      body: {
        userDetails: {
          email: "name@name.co.uk",
          password: "passWORDpassWORDpassWORDpassWORDpassWORD1?",
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

    it("should respond with 400 status", async () => {
      await loginValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return json with error message", async () => {
      await loginValidation(req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          password: ["Password is too long (maximum is 40 characters)"],
        },
      });
    });
  });
});
