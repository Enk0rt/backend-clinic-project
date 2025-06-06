import { OpenAPIV3 } from "openapi-types";
import swaggerUi from "swagger-ui-express";

import { config } from "./config";

const swaggerDocument: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
        title: "Clinics API Documentation",
        version: "1.0.0",
        description: "API documentation for searching Clinics and doctors",
    },
    servers: [
        {
            url: config.FRONTEND_URL,
            description: "Local server",
        },
    ],
    tags: [
        {
            name: "Auth",
            description: "Authentication endpoints",
        },
        {
            name: "Users",
            description: "Users endpoints",
        },
    ],
    paths: {
        "/api/auth/sign-up": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UserSignUp",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "User successfully registered",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "object",
                                            properties: {
                                                user: {
                                                    $ref: "#/components/schemas/User",
                                                },
                                                verifyToken: {
                                                    type: "string",
                                                },
                                            },
                                        },
                                        details: { type: "string" },
                                    },
                                },
                                example: {
                                    data: {
                                        user: {
                                            _id: "68429e5c510d0aba276992d6",
                                            name: "Alex",
                                            surname: "China",
                                            age: 30,
                                            email: "12321324@gmail.com",
                                            phoneNumber: "+380663424325",
                                            role: "user",
                                            isActive: false,
                                            isDeleted: false,
                                            isVerified: false,
                                            createdAt:
                                                "2025-06-06T07:53:00.116Z",
                                            updatedAt:
                                                "2025-06-06T07:53:00.116Z",
                                        },
                                        verifyToken: "eyJh...TQiY",
                                    },
                                    details:
                                        "Sign up is successful, user is created",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error or bad request",
                    },
                },
            },
        },
        "/api/auth/sign-in": {
            post: {
                tags: ["Auth"],
                summary: "Sign in user",
                description:
                    "Allows a registered user to sign in and receive access and refresh tokens",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: {
                                        type: "string",
                                        example: "user@example.com",
                                    },
                                    password: {
                                        type: "string",
                                        example: "password123",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Sign in successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "object",
                                            properties: {
                                                user: {
                                                    type: "object",
                                                    properties: {
                                                        _id: {
                                                            type: "string",
                                                            example:
                                                                "683c6ebd2e16f4f979820c60",
                                                        },
                                                        name: {
                                                            type: "string",
                                                            example: "Artem",
                                                        },
                                                        surname: {
                                                            type: "string",
                                                            example: "Pali",
                                                        },
                                                        age: {
                                                            type: "integer",
                                                            example: 22,
                                                        },
                                                        email: {
                                                            type: "string",
                                                            example:
                                                                "user@example.com",
                                                        },
                                                        role: {
                                                            type: "string",
                                                            example: "admin",
                                                        },
                                                        isActive: {
                                                            type: "boolean",
                                                            example: true,
                                                        },
                                                        isDeleted: {
                                                            type: "boolean",
                                                            example: false,
                                                        },
                                                        isVerified: {
                                                            type: "boolean",
                                                            example: true,
                                                        },
                                                        createdAt: {
                                                            type: "string",
                                                            format: "date-time",
                                                        },
                                                        updatedAt: {
                                                            type: "string",
                                                            format: "date-time",
                                                        },
                                                    },
                                                },
                                                tokens: {
                                                    type: "object",
                                                    properties: {
                                                        accessToken: {
                                                            type: "string",
                                                            example:
                                                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                                        },
                                                        refreshToken: {
                                                            type: "string",
                                                            example:
                                                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        details: {
                                            type: "string",
                                            example: "Sign in is successful",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Invalid credentials",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string",
                                            example:
                                                "Invalid email or password",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get current user",
                description:
                    "Returns the currently authenticated user based on the access token.",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    "200": {
                        description: "User information retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/MeResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description:
                            "Unauthorized - token is missing or invalid",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string",
                                            example: "User is not signed in",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Auth"],
                summary: "Delete current user",
                description:
                    "Deletes the currently authenticated user by setting the `isDeleted` flag or removing from DB.",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    "200": {
                        description: "User deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "string",
                                            nullable: true,
                                            example: null,
                                        },
                                        details: {
                                            type: "string",
                                            example:
                                                "User is deleted successfully",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized - user is not signed in",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string",
                                            example: "User is not signed in",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/recovery": {
            post: {
                tags: ["Auth"],
                summary: "Request password recovery",
                description:
                    "Sends a recovery email if the provided email exists.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email"],
                                properties: {
                                    email: {
                                        type: "string",
                                        format: "email",
                                        example: "user@example.com",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description:
                            "Recovery email sent (or silently accepted if email not found)",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "object",
                                            nullable: true,
                                            example: null,
                                        },
                                        details: {
                                            type: "string",
                                            example: "Check your email",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid input (e.g. wrong email format)",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string",
                                            example: "Invalid email format",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/recovery/{token}": {
            patch: {
                tags: ["Auth"],
                summary: "Reset password by recovery token",
                description:
                    "Allows a user to reset their password using a valid recovery token.",
                parameters: [
                    {
                        name: "token",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                        description: "Recovery token from email",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["password"],
                                properties: {
                                    password: {
                                        type: "string",
                                        minLength: 6,
                                        example: "newSecurePass123",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Password successfully changed",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/User",
                                        },
                                        details: {
                                            type: "string",
                                            example:
                                                "Password successfully changed",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid token or bad request",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string",
                                            example: "Invalid or expired token",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            UserAdminCreate: {
                type: "object",
                required: [
                    "name",
                    "surname",
                    "email",
                    "password",
                    "phoneNumber",
                    "role",
                ],
                properties: {
                    name: { type: "string", example: "Admin" },
                    surname: { type: "string", example: "User" },
                    age: { type: "integer", example: 35 },
                    email: { type: "string", example: "admin@example.com" },
                    password: { type: "string", example: "AdminPass123" },
                    phoneNumber: { type: "string", example: "+380501234567" },
                    role: {
                        type: "string",
                        enum: ["user", "admin", "doctor"],
                        example: "doctor",
                    },
                },
            },
            UserSignUp: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    name: { type: "string", example: "Alex" },
                    surname: { type: "string", example: "China" },
                    age: { type: "integer", example: 30 },
                    email: { type: "string", example: "user@example.com" },
                    password: { type: "string", example: "password123" },
                    phoneNumber: { type: "string", example: "+380663424325" },
                },
            },
            User: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    surname: { type: "string" },
                    age: { type: "integer" },
                    email: { type: "string" },
                    phoneNumber: { type: "string" },
                    role: { type: "string", enum: ["user", "admin", "doctor"] },
                    isActive: { type: "boolean" },
                    isDeleted: { type: "boolean" },
                    isVerified: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
            TokenPair: {
                type: "object",
                properties: {
                    accessToken: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                    refreshToken: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                },
            },
        },
    },
};

export { swaggerDocument, swaggerUi };
