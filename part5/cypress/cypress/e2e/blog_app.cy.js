describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`)

    const user = {
      name: "Cypress Tester",
      username: "cypress",
      password: "test123",
    }

    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user)
    cy.visit("/")
  })

  it("Login form is shown", function () {
    cy.contains("login")
  })

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get('input[name="Username"]').type("cypress")
      cy.get('input[name="Password"]').type("test123")
      cy.get("button").contains("login").click()
      cy.contains("Successfully")
    })

    it("fails with wrong credentials", function () {
      cy.get('input[name="Username"]').type("cypress")
      cy.get('input[name="Password"]').type("wrong")
      cy.get("button").contains("login").click()
      cy.get(".error")
        .should("contain", "wrong credentials")
    })
  })

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "cypress", password: "test123" })
    })

    it("A blog can be created", function () {
      cy.contains("create new blog").click()
      cy.get('input[placeholder="write title here"]').type("Test Blog")
      cy.get('input[placeholder="write author here"]').type("Author A")
      cy.get('input[placeholder="write url here"]').type("http://example.com")
      cy.contains("save").click()
      cy.contains("Test Blog Author A")
    })

    it("User can like a blog", function () {
      cy.createBlog({
        title: "Blog to Like",
        author: "Author B",
        url: "http://like.com",
      })

      cy.contains("Blog to Like").contains("show").click()
      cy.contains("like").click()
      cy.contains("Likes: 1")
    })

    it("Creator can delete a blog", function () {
      cy.createBlog({
        title: "Blog to Delete",
        author: "Author C",
        url: "http://delete.com",
      })

      cy.contains("Blog to Delete").contains("show").click()
      cy.contains("remove").click()
      cy.get("html").should("not.contain", "Blog to Delete")
    })

    it("Other users cannot see the delete button", function () {
      cy.createBlog({
        title: "Protected Blog",
        author: "Author D",
        url: "http://hidden.com",
      })

      cy.contains("logout").click()

      const anotherUser = {
        name: "Other User",
        username: "other",
        password: "password",
      }

      cy.request("POST", `${Cypress.env("BACKEND")}/users`, anotherUser)
      cy.login({ username: "other", password: "password" })

      cy.contains("Protected Blog").contains("show").click()
      cy.contains("remove").should("not.exist")
    })

    it("Blogs are ordered by likes (descending)", function () {
      cy.createBlog({ title: "Least Liked", author: "A", url: "a.com" })
      cy.createBlog({ title: "Medium Liked", author: "B", url: "b.com" })
      cy.createBlog({ title: "Most Liked", author: "C", url: "c.com" })

      cy.contains("Least Liked").contains("show").click()
      cy.contains("Medium Liked").contains("show").click()
      cy.contains("Most Liked").contains("show").click()

      for (let i = 0; i < 3; i++) {
        cy.contains("Most Liked").parent().contains("like").click()
        cy.wait(100)
      }
      for (let i = 0; i < 2; i++) {
        cy.contains("Medium Liked").parent().contains("like").click()
        cy.wait(100)
      }
      cy.contains("Least Liked").parent().contains("like").click()
      cy.wait(100)

      cy.get(".blog").eq(0).should("contain", "Most Liked")
      cy.get(".blog").eq(1).should("contain", "Medium Liked")
      cy.get(".blog").eq(2).should("contain", "Least Liked")
    })
  })
})
