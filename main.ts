import { createSchemaFactory } from '@zenstackhq/zod';
import { schema } from './zenstack/schema';

const factory = createSchemaFactory(schema);

// enum
const roleSchema = factory.makeEnumSchema('Role');
console.log('"STAFF" is a valid Role?', roleSchema.safeParse('STAFF').success);

// type
const profileSchema = factory.makeTypeSchema('Profile');
console.log(
    'Profile allows invalid website?',
    profileSchema.safeParse({ website: 'not-a-url' }).success,
);

// User model's create schema
const userCreateSchema = factory.makeModelCreateSchema('User');
console.log(
    'User create schema allows omitting "role"?',
    userCreateSchema.safeParse({ email: 'alice@example.com' }).success,
);

// User model full schema
const userSchema = factory.makeModelSchema('User');
console.log(
    'User full model allows relations?',
    userSchema.safeParse({
        id: 1,
        email: 'user@example.com',
        role: 'ADMIN',
        profile: { bio: 'A developer', website: 'https://example.com' },
        posts: [{ id: 1, title: 'Post1' }],
    }).success,
);

// `@@meta` and `@meta` handling
console.log(
    'User schema has description meta:',
    userSchema.meta()?.description,
);
console.log(
    'User.email field has description:',
    userCreateSchema.shape.email.meta()?.description,
);
