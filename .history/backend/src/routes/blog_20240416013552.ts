import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const user = await verify(token, c.env.JWT_SECRET);

  if (!user) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  c.set("userId", user.id);
  await next();
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: "1",
    },
  });
  return c.json({
    id: blog.id,
  });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = prisma.blog.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({ id: (await blog).id });
});

blogRouter.get("/", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.blog.findFirst({
      where: {
        id: body.id,
      },
    });

    return c.json(blogs);
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while fetching blogs",
    });
  }
});

// TODO: Add Pagination
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.blog.findMany();

  return c.json(blogs);
});
