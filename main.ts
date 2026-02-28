import { createSchemaFactory } from '@zenstackhq/zod';
import { globalRegistry } from 'zod';
import { schema } from './zenstack/schema';

// Create a schema factory from the ZenStack schema
const factory = createSchemaFactory(schema);

// --- Enum schema ---
// `Role` enum has two values: USER and ADMIN
const RoleSchema = factory.makeEnumSchema('Role');

// Valid enum value
console.log('RoleSchema.parse (valid):', RoleSchema.parse('ADMIN'));

// Invalid enum value
const roleResult = RoleSchema.safeParse('SUPERUSER');
console.log('RoleSchema.safeParse (invalid):', roleResult.success ? 'valid' : roleResult.error.issues);

// --- Type definition schema ---
// `Profile` is a composite type; its `website` field carries @url validation
const ProfileSchema = factory.makeTypeSchema('Profile');

// Valid profile
console.log('ProfileSchema.parse (valid):', ProfileSchema.parse({ bio: 'A developer', website: 'https://example.com' }));

// Invalid profile — website fails @url validation
const profileResult = ProfileSchema.safeParse({ website: 'not-a-url' });
console.log('ProfileSchema.safeParse (invalid website):', profileResult.success ? 'valid' : profileResult.error.issues);

// --- Model create schema with @email validation attribute ---
// UserCreateSchema: the `email` field has @email, so Zod enforces email format
const UserCreateSchema = factory.makeModelCreateSchema('User');

// Valid create input
console.log('UserCreateSchema.parse (valid):', UserCreateSchema.parse({ email: 'alice@example.com' }));

// Invalid email format — rejected by the @email attribute
const emailResult = UserCreateSchema.safeParse({ email: 'not-an-email' });
console.log('UserCreateSchema.safeParse (invalid email):', emailResult.success ? 'valid' : emailResult.error.issues);

// Invalid field type
const typeResult = UserCreateSchema.safeParse({ email: 123 });
console.log('UserCreateSchema.safeParse (invalid type):', typeResult.success ? 'valid' : typeResult.error.issues);

// --- Full model read schema ---
const UserSchema = factory.makeModelSchema('User');

const userData = {
  id: 1,
  email: 'alice@example.com',
  role: 'ADMIN',
  profile: { bio: 'A developer', website: 'https://example.com' },
  posts: [],
};
console.log('UserSchema.parse:', JSON.stringify(UserSchema.parse(userData), null, 2));

// --- Model update schema ---
const UserUpdateSchema = factory.makeModelUpdateSchema('User');
console.log('UserUpdateSchema.parse:', UserUpdateSchema.parse({ email: 'alice2@example.com', role: 'USER' }));

// --- Post create schema ---
const PostCreateSchema = factory.makeModelCreateSchema('Post');
console.log('PostCreateSchema.parse (valid):', PostCreateSchema.parse({ title: 'Hello World', content: 'My first post' }));

// --- @@meta description metadata ---
// @@meta('description', '...') on a model, type, or enum is turned into Zod schema
// metadata, accessible via z.globalRegistry.get(schema).
console.log('UserCreateSchema description:', globalRegistry.get(UserCreateSchema)?.description);
console.log('ProfileSchema description:   ', globalRegistry.get(ProfileSchema)?.description);
console.log('RoleSchema description:      ', globalRegistry.get(RoleSchema)?.description);

// @meta('description', '...') on a field is reflected on the individual field schema
console.log('email field description:     ', globalRegistry.get(UserCreateSchema.shape.email)?.description);
