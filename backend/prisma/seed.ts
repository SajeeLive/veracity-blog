import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Setup connection for the seed script
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEED_DATA = [
  {
    email: 'dilsh@veracity.com',
    firstName: 'Dilsh',
    lastName: 'Dev',
    handle: 'dilsh_codes',
    blogs: [
      {
        title: 'Building Veracity with NestJS and Prisma',
        content:
          'This is the first post on our new blogging platform! We are using a robust stack to ensure type safety.',
      },
      {
        title: 'Why I love PWAs',
        content:
          'PWAs are the future of mobile web development. They combine the best of web and native apps.',
      },
      {
        title: 'Mastering TanStack Router',
        content:
          'Type-safe routing in React has never been easier. Let’s dive into TanStack Router configurations.',
      },
    ],
  },
  {
    email: 'sarah.engineer@veracity.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    handle: 'schen_dev',
    blogs: [
      {
        title: 'Advanced Concurrent Systems',
        content:
          'Exploring mutual exclusion and semaphores in high-performance distributed systems.',
      },
      {
        title: 'PostgreSQL Indexing Strategies',
        content:
          'How to optimize your Prisma queries by understanding B-Tree and GIST indexes.',
      },
    ],
  },
  {
    email: 'marcus.ux@veracity.com',
    firstName: 'Marcus',
    lastName: 'Rivera',
    handle: 'marcus_design',
    blogs: [
      {
        title: 'Accessibility in PWA Design',
        content:
          'Designing for the web should be inclusive. Here are 5 tips for better ARIA labels.',
      },
      {
        title: 'The Psychology of Dark Mode',
        content:
          'Why users prefer dark interfaces and how to implement it using Tailwind CSS.',
      },
    ],
  },
  {
    email: 'alex.web3@veracity.com',
    firstName: 'Alex',
    lastName: 'Kim',
    handle: 'cryptocoder',
    blogs: [
      {
        title: 'Web3 Auth for Modern Apps',
        content:
          'Moving beyond passwords: How to integrate wallet-based authentication in NestJS.',
      },
      {
        title: 'Blockchain Testnets 101',
        content:
          'A guide to setting up your first integration with the Tempo blockchain testnet.',
      },
    ],
  },
];

async function main() {
  console.log('--- Starting Seed ---');

  for (const item of SEED_DATA) {
    const user = await prisma.user.upsert({
      where: { email: item.email },
      update: {}, // Don't change anything if user exists
      create: {
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        author: {
          create: {
            handle: item.handle,
          },
        },
      },
      include: { author: true },
    });

    console.log(`User/Author: ${user.email} (${user.author?.handle})`);

    if (user.author) {
      for (const blog of item.blogs) {
        await prisma.blog.create({
          data: {
            title: blog.title,
            content: blog.content,
            authorId: user.author.id,
          },
        });
      }
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
