jest.mock("@auth0/auth0-spa-js", () => {
    return jest.fn().mockResolvedValue({
      handleRedirectCallback: jest.fn(),
      getUser: jest.fn().mockResolvedValue({
        name: "Test User",
        email: "test@example.com",
        "https://classcheck.com/role": "professor"
      }),
    });
  });
  
  const { getUserRole } = require ("../authService");
  
  describe("Auth0 Role Logic", () => {
    it("should return the correct role from the user token", async () => {
      const role = await getUserRole();
      expect(role).toBe("professor");
    });
  });
