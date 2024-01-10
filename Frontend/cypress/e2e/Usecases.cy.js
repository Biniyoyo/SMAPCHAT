describe("Home page", () => {
  /// Use case 2.1: verifies by asserting that atleast one row of map cards
  /// is visible when accessing the home page.
  it("A user can see a list of maps on the home page", () => {
    cy.visit("127.0.0.1:3000/");
    cy.get(".row").should("have.length.greaterThan", 0);
  });

  /// Use case 2.2: verifies the user can search for a map by typing a search
  /// term in, hitting the search button, and asserting a card with that name
  /// appears.
  it("A user can enter a search term on the home page", () => {
    cy.visit("127.0.0.1:3000/");
    cy.get('input[placeholder="Search for maps"]').type("map");
    cy.get("#searchButton").click();
  });

  /// Use case 2.3: verifies that the user can sort by rating instead of date
  /// by clicking the rating button
  it("A user can change the sort mode on the home page", () => {
    cy.visit("127.0.0.1:3000/");
    cy.get("label").contains("Rating").click();
  });
});

describe("View page", () => {

  const login = () => {
      cy.visit("http://127.0.0.1:3000/login-page");
      cy.get('input[placeholder="E-Mail"]').type("test@test.com");
      cy.get('input[placeholder="Password"]').type("password");
      cy.get("button").contains("Login").click();
      cy.url().should('eq', 'http://127.0.0.1:3000/');
  }

  /// Use case 2.4: verifies a user can leave a comment by typing into the input
  /// and clicking on the add comment button
  it("A user can comment on a map", () => {
    cy.session('Comment session', () => {
      login();
      cy.visit("127.0.0.1:3000/view-map-page/657e80eeef4da688fce1e278");
      cy.wait(5000);
      cy.get("textarea").type("Hello from cypress!");
      cy.get("button").contains("ADD COMMENT");
    })
  });

  /// Use case 2.5: verifies a user can rate a map by clicking on one of the rating
  /// stars
  it("A user can rate a map", () => {
    cy.visit("127.0.0.1:3000/view-map-page/657e80eeef4da688fce1e278");
    cy.get(".Star").first();
  });

  /// Use case 2.6: verifies a user can fork a map that they do not own
  it("A user can fork a map", () => {
    cy.visit("127.0.0.1:3000/view-map-page/657e80eeef4da688fce1e278");
    cy.get("button").contains("Fork").click();
  });

  /// Use case 2.7: verifies a user can see a map by checking for the leasflet element
  it("A user can see a map", () => {
    cy.visit("127.0.0.1:3000/view-map-page/657e80eeef4da688fce1e278");
    cy.get(".leaflet-control-container");
  });

  /// Use case 2.8: verifies a user can delete their own map
  /// TODO: Login before this test!
  /*it("A user can delete their map", () => {
    cy.visit("127.0.0.1:3000/view-map-page");
    cy.get("button").contains("delete").click();
  });*/
});

describe("Create page", () => {
  /// Use case 2.9: verifies a user can upload a map file
  it("A user can upload a file for map geometry", () => {
    cy.visit("http://127.0.0.1:3000/create-page");

    cy.get('input[type="file"]').as("fileInput");

    cy.fixture("NY.geo.json").then((fileContent) => {
      cy.get("@fileInput").attachFile({
        fileContent: fileContent.toString(),
        fileName: "NY.geo.json",
      });
    });
  });

  /// Use case 2.10: verifies a use can select a map graphic type
  it("A use can select a map graphic type", () => {
    cy.visit("http://127.0.0.1:3000/create-page");
    cy.get("button").contains("Bubble Map").click();
  });
});

describe("Edit page", () => {
  /// Use case 2.11: verifies a user can edit the contents of a map by
  /// verifying the existence of a toolbox component
  it("A user can edit the contents of a map graphic", () => {
    cy.visit("http://127.0.0.1:3000/map-edit-page/ArrowMap");
    cy.get("#toolbox");
  });

  /// Use case 2.12: verifies a user can download their map graphic data
  /*it("A user can download their map graphic data", () => {
    cy.visit("http://127.0.0.1:3000/map-edit-page/ArrowMap");
    cy.get("button").contains("Save").click();
    cy.get("button").contains("Download").click();
  });*/

  /// Use case 2.13: verifies a user can save their map graphic data
  it("A user can save their map graphic data", () => {
    cy.visit("http://127.0.0.1:3000/map-edit-page/ArrowMap");
    cy.get("button").contains("Save");
  });

  /// Use case 2.14: verifies a user can upload their map graphic data
  it("A user can publish a map graphic", () => {
    cy.visit("http://127.0.0.1:3000/map-edit-page/ArrowMap");
    cy.get("button").contains("Publish");
  });

  /// Use case 2.15: verifies a user can use the tools of the arrow map editor
  it("A user can utilize the arrow map editor", () => {
    cy.visit("http://127.0.0.1:3000/map-edit-page/ArrowMap");
  });

  /// Use case 2.16: verifies a user can use the tools of the bubble map editor
  it("A user can utilize the bubble map editor", () => {
    cy.visit("http://127.0.0.1:3000/map-edit-page/BubbleMap");
  });

  /// Use case 2.17: verifies a user can use the tools of the scale map editor
  it("A user can utilize the scale map editor", () => {
    cy.visit("http://127.0.0.1:3000/map-edit-page/ScaleMap");
  });

  /// Use case 2.18: verifies a user can use the tools of the picture map editor
  it("A user can utilize the picture map editor", () => {
    cy.visit("http://127.0.0.1:3000/map-edit-page/PictureMap");
  });

  /// Use case 2.19: verifies a user can use the tools of the category map editor
  it("A user can utilize the category map editor", () => {
    cy.visit("http://127.0.0.1:3000/map-edit-page/CategoryMap");
  });
});

describe("My maps page", () => {

  const login = () => {
    cy.visit("http://127.0.0.1:3000/login-page");
    cy.get('input[placeholder="E-Mail"]').type("test@test.com");
    cy.get('input[placeholder="Password"]').type("password");
    cy.get("button").contains("Login").click();
    cy.url().should('eq', 'http://127.0.0.1:3000/');
  }

  /// Use case 2.20: verifies by asserting that atleast one row of map cards
  /// is visible when accessing the my maps page.
  it("A user can see a list of maps on the my maps page", () => {
    cy.session('Mymaps session 1', () => {
      login();
      cy.visit("127.0.0.1:3000/my-maps-page/657e7d6def4da688fce1e247");
      cy.get(".row").should("have.length.greaterThan", 0);
    })
  });

  /// Use case 2.21:
  it("A user can enter a search term on the my maps page", () => {
    cy.session('Mymaps session 2', () => {
      login();
    cy.visit("127.0.0.1:3000/my-maps-page/657e7d6def4da688fce1e247");
    cy.get('input[placeholder="Search for maps"]').type("map");
    cy.get("#searchButton").click();
  })
  });

  /// Use case 2.22: 
  it("A user can change the sort mode on the my maps page", () => {
    cy.session('Mymaps session 3', () => {
      login();
    cy.visit("127.0.0.1:3000/my-maps-page/657e7d6def4da688fce1e247");
    cy.get("label").contains("Rating").click();
  })
  });
});

describe("Login page", () => {
  /// use case 2.23: verifies that a user can login
  it("A user can log in to the application", () => {
    cy.visit("http://127.0.0.1:3000/login-page");
    cy.get('input[placeholder="E-Mail"]').type("test@test.com");
    cy.get('input[placeholder="Password"]').type("password");
    cy.get("button").contains("Login").click();
    // TODO: Get user widget to confirm login
  });

  /// use case 2.24: verifies that a user can recover their password
  it("A user can recover their password", () => {
    cy.visit("http://127.0.0.1:3000/login-page");
    cy.get("button").contains("Forgot Password/username?").click();
    cy.get('input[placeholder="Recovery E-Mail"]').type("test@test.com");
    cy.get("button").contains("Send Reset Instructions").click();
  });

  /// use case 2.25: verifies that a user can register a new account
  it("A user can register a new account", () => {
    cy.visit("http://127.0.0.1:3000/login-page");
    cy.get("button").contains("Register").click();
    cy.get('input[placeholder="E-Mail"]').type("test@test.com");
    cy.get('input[placeholder="Username"]').type("tester");
    cy.get('input[placeholder="Password"]').type("password");
    cy.get('input[placeholder="Repeat Password"]').type("password");
    cy.get("button").contains("Register").click();
  });
});
