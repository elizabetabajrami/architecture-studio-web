/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-require-imports */

const express = require("express");
const Portfolio = require("../../backend/models/Portfolio");
const portfolioRoutes = require("../../backend/routes/portfolioRoutes");

jest.mock("../../backend/models/Portfolio", () => ({
  find: jest.fn(),
}));

jest.mock("../../backend/middleware/adminMiddleware", () => (_req, _res, next) => next());

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/portfolio", portfolioRoutes);
  return app;
};

const request = async (app, { method, path }) => {
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${path}`, { method });
    const text = await response.text();

    return {
      body: text ? JSON.parse(text) : null,
      status: response.status,
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

describe("portfolio API route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns portfolio projects", async () => {
    const projects = [
      {
        _id: "project-1",
        category: "Residential",
        mainImage: "/project.jpg",
        title: "Modern House",
      },
    ];
    const sort = jest.fn().mockResolvedValue(projects);

    Portfolio.find.mockReturnValue({ sort });

    const response = await request(createApp(), {
      method: "GET",
      path: "/api/portfolio",
    });

    expect(Portfolio.find).toHaveBeenCalledWith();
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(projects);
  });
});
