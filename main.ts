import { createSchemaFactory } from '@zenstackhq/zod';
import { createClient } from './db';
import { schema } from './zenstack/schema';

// Create a schema factory from the ZenStack schema
const factory = createSchemaFactory(schema);

// Build Zod schemas for the User and Post models
const UserSchema = factory.makeModelSchema('User');
const UserCreateSchema = factory.makeModelCreateSchema('User');
const UserUpdateSchema = factory.makeModelUpdateSchema('User');

const PostSchema = factory.makeModelSchema('Post');
const PostCreateSchema = factory.makeModelCreateSchema('Post');

async function main() {
  const db = await createClient();

  // --- Demonstrate Zod validation ---

  // Valid user create input
  const validUserInput = { email: 'alice@example.com' };
  console.log('UserCreateSchema.parse (valid):', UserCreateSchema.parse(validUserInput));

  // Invalid user create input (missing required field)
  const invalidUserInput = { email: 123 };
  const userResult = UserCreateSchema.safeParse(invalidUserInput);
  console.log('UserCreateSchema.safeParse (invalid):', userResult.success ? 'valid' : userResult.error.issues);

  // Valid post create input
  const validPostInput = { title: 'Hello World', content: 'My first post' };
  console.log('PostCreateSchema.parse (valid):', PostCreateSchema.parse(validPostInput));

  // --- Demonstrate Zod validation against database data ---

  // Create a user with posts in the database
  const user = await db.user.create({
    data: {
      email: 'alice@example.com',
      posts: {
        create: [{ title: 'Hello World', content: 'My first post' }],
      },
    },
    include: { posts: true },
  });

  // Validate the returned user data using UserSchema
  const parsed = UserSchema.parse(user);
  console.log('UserSchema.parse (db result):', JSON.stringify(parsed, null, 2));

  // Validate a user update payload
  const userUpdate = UserUpdateSchema.parse({ email: 'alice2@example.com' });
  console.log('UserUpdateSchema.parse:', userUpdate);
}

main();
