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
        "/api/users": {
            get: {
                summary: "Get users list",
                description: "Available only for administrators",
                tags: ["Users"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "pageSize",
                        in: "query",
                        description: "Number of items per page",
                        schema: {
                            type: "integer",
                            example: 10,
                        },
                    },
                    {
                        name: "page",
                        in: "query",
                        description: "Page number",
                        schema: {
                            type: "integer",
                            example: 1,
                        },
                    },
                    {
                        name: "sort",
                        in: "query",
                        description: "Sort field",
                        schema: {
                            type: "string",
                            example: "name",
                        },
                    },
                    {
                        name: "sortDirection",
                        in: "query",
                        description: "Sort direction (asc or desc, 1 or -1)",
                        schema: {
                            type: "string",
                            enum: ["asc", "desc"],
                            example: "asc",
                        },
                    },
                    {
                        name: "search",
                        in: "query",
                        description: "Search term",
                        schema: {
                            type: "string",
                            example: "John",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "User list successfully retrieved",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "array",
                                            items: {
                                                $ref: "#/components/schemas/User",
                                            },
                                        },
                                        pageSize: {
                                            type: "integer",
                                        },
                                        page: {
                                            type: "integer",
                                        },
                                        totalPages: {
                                            type: "integer",
                                        },
                                        total: {
                                            type: "integer",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                    "403": {
                        description: "Access denied",
                    },
                },
            },
        },
        "api/users/{id}": {
            get: {
                summary: "Get user by ID",
                description: "Accessible only to administrators.",
                tags: ["Users"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "User identifier",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "User successfully retrieved",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/User",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                    "403": {
                        description: "Access denied",
                    },
                    "404": {
                        description: "User not found",
                    },
                },
            },
            put: {
                summary: "Update user by ID",
                description: "Accessible only to administrators.",
                tags: ["Users"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "User identifier",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    description: "Data for updating the user",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UserUpdateDTO",
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "User successfully updated",
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
                                                "User info is successfully updated",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                    "403": {
                        description: "Access denied",
                    },
                    "404": {
                        description: "User not found",
                    },
                },
            },
            delete: {
                summary: "Delete user by ID",
                description: "Accessible only to administrators.",
                tags: ["Users"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "User identifier",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "User successfully deleted",
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
                        description: "Unauthorized",
                    },
                    "403": {
                        description: "Access denied",
                    },
                    "404": {
                        description: "User not found",
                    },
                },
            },
        },
        "/api/clinics": {
            get: {
                summary: "Get list of clinics",
                description: "Accessible to authorized users only",
                tags: ["Clinics"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "pageSize",
                        in: "query",
                        description: "Number of items per page",
                        schema: { type: "integer", example: 10 },
                    },
                    {
                        name: "page",
                        in: "query",
                        description: "Page number",
                        schema: { type: "integer", example: 1 },
                    },
                    {
                        name: "sort",
                        in: "query",
                        description: "Field to sort by",
                        schema: { type: "string", example: "name" },
                    },
                    {
                        name: "sortDirection",
                        in: "query",
                        description: "Sort direction (asc or desc, 1 or -1)",
                        schema: {
                            type: "string",
                            enum: ["asc", "desc"],
                            example: "asc",
                        },
                    },
                    {
                        name: "search",
                        in: "query",
                        description: "Search query",
                        schema: { type: "string", example: "Dental" },
                    },
                ],
                responses: {
                    "200": {
                        description: "List of clinics retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "array",
                                            items: {
                                                $ref: "#/components/schemas/Clinic",
                                            },
                                        },
                                        pageSize: { type: "integer" },
                                        page: { type: "integer" },
                                        totalPages: { type: "integer" },
                                        total: { type: "integer" },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden" },
                },
            },
            post: {
                summary: "Create a clinic",
                description: "Accessible to roles: DOCTOR, ADMIN",
                tags: ["Clinics"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    description: "Clinic data for creation",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ClinicCreateDTO",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "New clinic created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/Clinic",
                                        },
                                        details: {
                                            type: "string",
                                            example:
                                                "New Clinic is created successfully",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden" },
                },
            },
        },
        "/api/clinics/{id}": {
            get: {
                summary: "Get a clinic by ID",
                description: "Accessible to authorized users only",
                tags: ["Clinics"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Clinic identifier",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Clinic retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/Clinic",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden" },
                    "404": { description: "Clinic not found" },
                },
            },
            put: {
                summary: "Update a clinic by ID",
                description: "Accessible to roles: DOCTOR, ADMIN",
                tags: ["Clinics"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Clinic identifier",
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    description: "Clinic data for update",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ClinicCreateDTO",
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Clinic information updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/Clinic",
                                        },
                                        details: {
                                            type: "string",
                                            example:
                                                "Clinic info is updated successfully",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden" },
                    "404": { description: "Clinic not found" },
                },
            },
            delete: {
                summary: "Delete a clinic by ID",
                description: "Accessible to roles: DOCTOR, ADMIN",
                tags: ["Clinics"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Clinic identifier",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Clinic deleted successfully",
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
                                                "Clinic is deleted successfully",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "403": { description: "Forbidden" },
                    "404": { description: "Clinic not found" },
                },
            },
        },
        "/api/doctors": {
            get: {
                summary: "Get doctors list",
                description: "Returns paginated list of doctors",
                tags: ["Doctors"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "pageSize",
                        in: "query",
                        description: "Number of doctors per page",
                        schema: {
                            type: "integer",
                            example: 10,
                        },
                    },
                    {
                        name: "page",
                        in: "query",
                        description: "Page number",
                        schema: {
                            type: "integer",
                            example: 1,
                        },
                    },
                    {
                        name: "sort",
                        in: "query",
                        description: "Sort field",
                        schema: {
                            type: "string",
                            example: "name",
                        },
                    },
                    {
                        name: "sortDirection",
                        in: "query",
                        description: "Sort direction (asc or desc)",
                        schema: {
                            type: "string",
                            enum: ["asc", "desc"],
                            example: "asc",
                        },
                    },
                    {
                        name: "search",
                        in: "query",
                        description: "Search term",
                        schema: {
                            type: "string",
                            example: "Smith",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "Doctors list successfully received",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "array",
                                            items: {
                                                $ref: "#/components/schemas/Doctor",
                                            },
                                        },
                                        pageSize: { type: "integer" },
                                        page: { type: "integer" },
                                        totalPages: { type: "integer" },
                                        total: { type: "integer" },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                },
            },
            post: {
                summary: "Create a new doctor",
                description: "Accessible only to ADMIN role",
                tags: ["Doctors"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    description: "Doctor creation data",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/DoctorCreateByAdminDTO",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Doctor created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/Doctor",
                                        },
                                        details: {
                                            type: "string",
                                            example:
                                                "Doctor was created successfully",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                    403: { description: "Forbidden - only admins allowed" },
                },
            },
        },
        "/api/doctors/{id}": {
            get: {
                summary: "Get doctor by ID",
                description: "Returns doctor info by ID",
                tags: ["Doctors"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Doctor identifier",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "Doctor data retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/Doctor",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                    404: { description: "Doctor not found" },
                },
            },
            put: {
                summary: "Update doctor by ID",
                description: "Accessible to ADMIN and DOCTOR roles",
                tags: ["Doctors"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Doctor identifier",
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    description: "Doctor update data",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/DoctorUpdateDTO",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Doctor updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/Doctor",
                                        },
                                        details: {
                                            type: "string",
                                            example:
                                                "Doctor info is successfully updated",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                    403: {
                        description:
                            "Forbidden - only admins and doctors allowed",
                    },
                    404: { description: "Doctor not found" },
                },
            },
            delete: {
                summary: "Delete doctor by ID",
                description: "Accessible only to ADMIN role",
                tags: ["Doctors"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Doctor identifier",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "Doctor deleted successfully",
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
                                                "Doctor is deleted successfully",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                    403: { description: "Forbidden - only admins allowed" },
                    404: { description: "Doctor not found" },
                },
            },
        },
        "/api/services": {
            get: {
                summary: "Get list of doctor services",
                description: "Returns paginated list of doctor services",
                tags: ["DoctorServices"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "pageSize",
                        in: "query",
                        description: "Number of services per page",
                        schema: { type: "integer", example: 10 },
                    },
                    {
                        name: "page",
                        in: "query",
                        description: "Page number",
                        schema: { type: "integer", example: 1 },
                    },
                    {
                        name: "sort",
                        in: "query",
                        description: "Sort field",
                        schema: { type: "string", example: "name" },
                    },
                    {
                        name: "sortDirection",
                        in: "query",
                        description: "Sort direction (asc or desc)",
                        schema: {
                            type: "string",
                            enum: ["asc", "desc"],
                            example: "asc",
                        },
                    },
                    {
                        name: "search",
                        in: "query",
                        description: "Search term",
                        schema: { type: "string", example: "therapy" },
                    },
                ],
                responses: {
                    200: {
                        description:
                            "List of doctor services retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "array",
                                            items: {
                                                $ref: "#/components/schemas/Service",
                                            },
                                        },
                                        pageSize: { type: "integer" },
                                        page: { type: "integer" },
                                        totalPages: { type: "integer" },
                                        total: { type: "integer" },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                },
            },
            post: {
                summary: "Create a new doctor service",
                description: "Only ADMIN role can create a new service",
                tags: ["DoctorServices"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    description: "Service creation data",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ServiceCreateDTO",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Service created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/Service",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                    403: { description: "Forbidden - only admins allowed" },
                },
            },
        },
        "/api/services/{id}": {
            get: {
                summary: "Get doctor service by ID",
                description: "Returns doctor service details by ID",
                tags: ["DoctorServices"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Service identifier",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "Service data retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/Service",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                    404: { description: "Service not found" },
                },
            },
            put: {
                summary: "Update doctor service by ID",
                description: "Only ADMIN role can update service",
                tags: ["DoctorServices"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Service identifier",
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    description: "Service update data",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ServiceUpdateDTO",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Service updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            $ref: "#/components/schemas/Service",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                    403: { description: "Forbidden - only admins allowed" },
                    404: { description: "Service not found" },
                },
            },
            delete: {
                summary: "Delete doctor service by ID",
                description: "Only ADMIN role can delete service",
                tags: ["DoctorServices"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Service identifier",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "Service deleted successfully",
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
                                                "Service is deleted successfully",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                    403: { description: "Forbidden - only admins allowed" },
                    404: { description: "Service not found" },
                },
            },
        },
        "/admin/:id": {
            post: {
                summary: "Change user role by ID",
                description: "Allows ADMIN to change the role of a user",
                tags: ["Admin"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "User identifier",
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    description: "New role for the user",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    role: {
                                        type: "string",
                                        enum: ["ADMIN", "USER", "DOCTOR"],
                                        example: "USER",
                                    },
                                },
                                required: ["role"],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Role updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "object",
                                            description: "Updated role entity",
                                            oneOf: [
                                                {
                                                    $ref: "#/components/schemas/Admin",
                                                },
                                                {
                                                    $ref: "#/components/schemas/User",
                                                },
                                                {
                                                    $ref: "#/components/schemas/Doctor",
                                                },
                                            ],
                                        },
                                        details: {
                                            type: "string",
                                            example:
                                                "Role is updated successfully",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                    403: { description: "Forbidden - only admins allowed" },
                    400: { description: "Invalid role" },
                    404: { description: "User not found" },
                },
            },
        },
        "/admin/deactivate/:id": {
            patch: {
                summary: "Deactivate user by ID",
                description: "Allows ADMIN to deactivate a user account",
                tags: ["Admin"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "User identifier",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "User deactivated successfully",
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
                                                "User is deactivated successfully",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                    403: { description: "Forbidden - only admins allowed" },
                    404: { description: "User not found" },
                },
            },
        },
        "/verify/:token": {
            get: {
                summary: "Verify email by token",
                description:
                    "Verifies user's email and activates their account using a verification token",
                tags: ["Auth"],
                parameters: [
                    {
                        name: "token",
                        in: "path",
                        required: true,
                        description: "Verification token",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "Email verified and account activated",
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
                                                "Email is successfully verified, account activated",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: { description: "Invalid or expired token" },
                    404: { description: "User not found" },
                },
            },
            patch: {
                summary: "Verify email by token (alternative method)",
                description:
                    "Alternative endpoint to verify user's email by token",
                tags: ["Auth"],
                parameters: [
                    {
                        name: "token",
                        in: "path",
                        required: true,
                        description: "Verification token",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: {
                        description: "Email verified and account activated",
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
                                                "Email is successfully verified, account activated",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: { description: "Invalid or expired token" },
                    404: { description: "User not found" },
                },
            },
        },
        "/verify": {
            post: {
                summary: "Request new verification email",
                description:
                    "Sends a verification email to the specified address",
                tags: ["Auth"],
                requestBody: {
                    description: "Email to send verification to",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                        format: "email",
                                        example: "user@example.com",
                                    },
                                },
                                required: ["email"],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Verification email sent",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "string",
                                            nullable: true,
                                        },
                                        details: {
                                            type: "string",
                                            example: "Check your email!",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: { description: "Invalid email format" },
                    404: { description: "User with email not found" },
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
            Clinic: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    city: { type: "string" },
                    address: { type: "string" },
                    doctors: {
                        type: "array",
                        items: { type: "string" },
                    },
                    services: {
                        type: "array",
                        items: { type: "string" },
                    },
                },
            },
            ClinicCreateDTO: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    city: { type: "string" },
                    address: { type: "string" },
                },
            },
            Doctor: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    userInfo: { type: "string" },
                    services: {
                        type: "array",
                        items: { type: "string" },
                    },
                    clinics: {
                        type: "array",
                        items: { type: "string" },
                    },
                },
                required: ["_id", "userInfo", "services", "clinics"],
            },
            DoctorCreateByAdminDTO: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    surname: { type: "string" },
                    age: { type: "integer" },
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                    phoneNumber: { type: "string", nullable: true },
                    services: {
                        oneOf: [
                            { type: "string" },
                            {
                                type: "array",
                                items: { type: "string" },
                            },
                        ],
                        nullable: true,
                    },
                    clinics: {
                        oneOf: [
                            { type: "string" },
                            {
                                type: "array",
                                items: { type: "string" },
                            },
                        ],
                        nullable: true,
                    },
                },
                required: ["name", "surname", "age", "email", "password"],
            },
            DoctorUpdateDTO: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    surname: { type: "string" },
                    age: { type: "integer" },
                    email: { type: "string", format: "email" },
                    phoneNumber: { type: "string", nullable: true },
                    services: {
                        type: "array",
                        items: { type: "string" },
                        nullable: true,
                    },
                    clinics: {
                        type: "array",
                        items: { type: "string" },
                        nullable: true,
                    },
                },
            },
            Service: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    doctors: {
                        type: "array",
                        items: { type: "string" },
                    },
                    clinics: {
                        type: "array",
                        items: { type: "string" },
                    },
                },
                required: ["_id", "name", "doctors", "clinics"],
            },
            ServiceCreateDTO: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    doctors: {
                        type: "array",
                        items: { type: "string" },
                        nullable: true,
                    },
                    clinics: {
                        type: "array",
                        items: { type: "string" },
                        nullable: true,
                    },
                },
                required: ["name"],
            },
            ServiceUpdateDTO: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    doctors: {
                        type: "array",
                        items: { type: "string" },
                        nullable: true,
                    },
                    clinics: {
                        type: "array",
                        items: { type: "string" },
                        nullable: true,
                    },
                },
            },
            Admin: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    surname: { type: "string" },
                    age: { type: "integer" },
                    email: { type: "string" },
                    phoneNumber: { type: "string" },
                    role: { type: "string", enum: ["admin"] },
                    isActive: { type: "boolean" },
                    isDeleted: { type: "boolean" },
                    isVerified: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
        },
    },
};
export { swaggerDocument, swaggerUi };
