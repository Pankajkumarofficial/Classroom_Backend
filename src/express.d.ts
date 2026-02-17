import "express";

declare global {
  namespace Express {
    interface User {
      role?: "Admin" | "Teacher" | "Student";
    }

    interface Request {
      user?: User;
    }
  }
}
