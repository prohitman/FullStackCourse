Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", `${Cypress.env("BACKEND")}/login`, {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("loggedBlogappUser", JSON.stringify(body))
    cy.visit("/")
  })
})

Cypress.Commands.add("createBlog", ({ title, author, url }) => {
  const user = JSON.parse(localStorage.getItem("loggedBlogappUser"))

  cy.request({
    url: `${Cypress.env("BACKEND")}/blogs`,
    method: "POST",
    body: { title, author, url, important: true },
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })

  cy.visit("/")
})
