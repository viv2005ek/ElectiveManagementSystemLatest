// swaggerSchema.ts

export const schemas = {
  Student: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '123' },
      name: { type: 'string', example: 'John Doe' },
      email: { type: 'string', example: 'john.doe@example.com' },
      age: { type: 'integer', example: 22 },
    },
  },
  UserLogin: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'user@example.com' },
      password: { type: 'string', example: 'password123' },
    },
  },
  UserRegister: {
    type: 'object',
    properties: {
      firstName: { type: 'string', example: 'John' },
      lastName: { type: 'string', example: 'Doe' },
      email: { type: 'string', example: 'user@example.com' },
      password: { type: 'string', example: 'password123' },
      registrationNumber: { type: 'string', example: 'S1234567A' },
    },
  },
  TokenResponse: {
    type: 'object',
    properties: {
      token: { type: 'string', example: 'jwt-token-here' },
    },
  },
  Admin: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '456' },
      name: { type: 'string', example: 'Admin User' },
      role: { type: 'string', example: 'Admin' },
      email: { type: 'string', example: 'admin@example.com' },
    },
  },
  Department: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '789' },
      name: { type: 'string', example: 'Computer Science' },
      code: { type: 'string', example: 'CS' },
    },
  },
  MinorSpecialization: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '321' },
      name: { type: 'string', example: 'Data Science' },
      departmentId: { type: 'string', example: '789' },
    },
  },
  ProgrammeElective: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '123' },
      courseCode: { type: 'string', example: 'CS101' },
      name: { type: 'string', example: 'Computer Science 101' },
      semester: { type: 'integer', example: 1 },
      isStandalone: { type: 'boolean', example: true },
      minorSpecializationId: { type: 'string', example: '12345' },
    },
  },
};
