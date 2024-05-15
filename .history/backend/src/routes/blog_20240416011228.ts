import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, verify, sign } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// blogRouter.use("/*",(c,next) => {
//     next();
// })

blogRouter.post("/", (c) => {
  return c.text("Hello Hono Main!");
});

blogRouter.post("/blog", async (c) => {
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

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

blogRouter.put("/blog", (c) => {
  return c.text("Hello Hono!");
});

blogRouter.get("/blog/:id", (c) => {
  return c.text("Hello Hono!");
});
