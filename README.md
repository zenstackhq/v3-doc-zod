# ZenStack V3 Zod Integration Sample

This project demonstrates how to use the [`@zenstackhq/zod`](https://www.npmjs.com/package/@zenstackhq/zod) package to generate [Zod](https://zod.dev) validation schemas from a [ZenStack](https://zenstack.dev) model.

The ZenStack schema (`zenstack/schema.zmodel`) defines two models — `User` and `Post`. Using `createSchemaFactory`, the sample derives Zod schemas for reading, creating, and updating these models, then validates data against them.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```
