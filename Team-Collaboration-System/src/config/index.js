//swagger config file
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

module.exports = (app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Team Workspace & Project Collaboration API",
        version: "1.0.0",
        description: "Swagger documentation for backend APIs",
      },
      servers: [
        {
          url: "http://localhost:5000/api",
          description: "Local development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./src/config/swagger-docs/*.swagger.js"],
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};
