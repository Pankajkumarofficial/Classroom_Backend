import { Request, Response } from "express";
import { db } from "../db/index.js";
import { classes } from "../db/schema/index.js";

export const classController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      teacherId,
      subjectId,
      capacity,
      description,
      status,
    } = req.body;

    // Insert new class
    const [createdClass] = await db
      .insert(classes)
      .values({
        name,
        teacherId,
        subjectId,
        description,
        capacity,
        status,
        inviteCode: Math.random().toString(36).substring(2, 9),
      })

      .returning({
        id: classes.id,
      });

    if (!createdClass) {
      throw new Error("Class creation failed");
    }

    return res.status(201).json({
      data: createdClass,
      message: "Class created successfully",
    });
  } catch (error) {
    console.error("POST /classes error:", error);

    return res.status(500).json({
      error: "Failed to create class",
    });
  }
};
