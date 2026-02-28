import { createSchemaFactory } from '@zenstackhq/zod';
import { schema } from './zenstack/schema';

// Create a schema factory from the ZenStack schema
const factory = createSchemaFactory(schema);

// Build Zod schemas for the User and Post models
const UserSchema = factory.makeModelSchema('User');
const UserCreateSchema = factory.makeModelCreateSchema('User');
const UserUpdateSchema = factory.makeModelUpdateSchema('User');
const PostCreateSchema = factory.makeModelCreateSchema('Post');

// Valid user create input
const validUserInput = { email: 'alice@example.com' };
console.log('UserCreateSchema.parse (valid):', UserCreateSchema.parse(validUserInput));

// Invalid user create input (wrong type for email)
const invalidUserInput = { email: 123 };
const userResult = UserCreateSchema.safeParse(invalidUserInput);
console.log('UserCreateSchema.safeParse (invalid):', userResult.success ? 'valid' : userResult.error.issues);

// Valid post create input
const validPostInput = { title: 'Hello World', content: 'My first post' };
console.log('PostCreateSchema.parse (valid):', PostCreateSchema.parse(validPostInput));

// Validate a full user object (including nested posts) against UserSchema
const userData = {
  id: 1,
  email: 'alice@example.com',
  posts: [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Hello World',
      content: 'My first post',
      slug: null,
      viewCount: 0,
      published: false,
      authorId: 1,
    },
  ],
};
const parsed = UserSchema.parse(userData);
console.log('UserSchema.parse:', JSON.stringify(parsed, null, 2));

// Validate a user update payload (all fields are optional)
const userUpdate = UserUpdateSchema.parse({ email: 'alice2@example.com' });
console.log('UserUpdateSchema.parse:', userUpdate);
