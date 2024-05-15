import { Hono } from "hono";

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

blogRouter.post("/blog", (c) => {
  return c.text("Hello Hono!");
});

blogRouter.put("/blog", (c) => {
  return c.text("Hello Hono!");
});

blogRouter.get("/blog/:id", (c) => {
  return c.text("Hello Hono!");
});
