/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-require-imports */

const express = require("express");
const Contact = require("../../backend/models/Contact");
const contactRoutes = require("../../backend/routes/contactRoutes");

jest.mock("../../backend/models/Contact", () => ({
  create: jest.fn(),
}));

jest.mock("../../backend/middleware/adminMiddleware", () => (_req, _res, next) => next());

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/contact", contactRoutes);
  return app;
};

const request = async (app, { body, method, path }) => {
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      body: body ? JSON.stringify(body) : undefined,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      method,
    });
    const text = await response.text();

    return {
      body: text ? JSON.parse(text) : null,
      status: response.status,
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

describe("contact API route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates a contact message", async () => {
    const contact = {
      _id: "contact-1",
      email: "client@example.com",
      fullName: "Client Name",
      message: "I want to discuss a project.",
    };

    Contact.create.mockResolvedValue(contact);

    const response = await request(createApp(), {
      body: {
        email: contact.email,
        fullName: contact.fullName,
        message: contact.message,
      },
      method: "POST",
      path: "/api/contact",
    });

    expect(Contact.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: contact.email,
        fullName: contact.fullName,
        message: contact.message,
      }),
    );
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      contact,
      message: "Contact message created successfully",
    });
  });
});
