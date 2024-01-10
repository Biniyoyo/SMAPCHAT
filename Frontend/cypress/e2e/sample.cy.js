describe("touch server", () => {
  it("attempts to ping the locally running frontend server", () => {
    cy.visit("127.0.0.1:3000/");
  });
});
