import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Setup connection for the seed script
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Cleaning Database ---');
  // Order matters for foreign keys
  await prisma.blog.deleteMany();
  await prisma.author.deleteMany();
  await prisma.user.deleteMany();

  console.log('--- Starting Seed ---');

  const authors = [];
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const handles = ['CodeArtisan', 'ByteBard', 'LogicLuminary', 'PixelProphet', 'SyntaxSorcerer', 'DataDruid', 'CyberSage', 'NodeNinja', 'QueryQueen', 'ThePragma'];

  for (let i = 0; i < 10; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@veracity.com`;
    const handle = handles[i];

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        author: {
          create: {
            handle,
          },
        },
      },
      include: { author: true },
    });

    if (user.author) {
      authors.push(user.author);
    }
    console.log(`Created Author: ${handle} (${email})`);
  }

  const blogTopics = [
    'NestJS', 'Prisma', 'TypeScript', 'React', 'Next.js', 'PostgreSQL', 
    'Docker', 'Kubernetes', 'AWS', 'Serverless', 'Microservices', 'GraphQL',
    'TDD', 'Clean Code', 'Performance', 'Security', 'Frontend', 'Backend'
  ];
  const adjectives = ['Amazing', 'Advanced', 'Modern', 'Simple', 'Robust', 'Scalable', 'Fast', 'Secure'];

  console.log('--- Creating 100 Blogs ---');
  for (let i = 0; i < 100; i++) {
    const author = authors[i % authors.length];
    const topic = blogTopics[Math.floor(Math.random() * blogTopics.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const title = `${adj} ${topic} Guide Part ${i + 1}`;
    const content = `Content for blog post #${i + 1}. This post explores ${topic} in a ${adj.toLowerCase()} way. 
    Lately, many developers have been looking into ${topic} for building ${adj.toLowerCase()} systems. 
    In this guide, we will dive deep into the best practices and common pitfalls when working with ${topic}.
    Timestamp: ${new Date().toISOString()}. Unique ID: ${Math.random().toString(36).substring(7)}.`;

    await prisma.blog.create({
      data: {
        title,
        content,
        authorId: author.id,
      },
    });

    if ((i + 1) % 10 === 0) {
      console.log(`Created ${i + 1} blogs...`);
    }
  }

  console.log('--- Seed Finished ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
