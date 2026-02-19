import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "../db/index.js";
import { user } from "../db/schema/index.js";
import { UsersQuery } from "../types/types.js";

export const userController = async (req: Request, res:Response) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query as UsersQuery;
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100)
        const offset = (currentPage - 1) * limitPerPage;
        const filterConditions = [];

        if (search) {
            filterConditions.push(
                or(
                    ilike(user.name, `%${search}%`),
                    ilike(user.email, `%${search}%`)
                )
            )
        }

        if (role) {
            filterConditions.push(
                eq(user.role, role as any)
            )
        }

        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db.select({ count: sql`count(*)` }).from(user).where(whereClause);

        const totalCount = Number(countResult[0]?.count ?? 0);

        const usersList = await db.select({ ...getTableColumns(user) }).from(user).where(whereClause).orderBy(desc(user.createdAt)).limit(limitPerPage).offset(offset)

        res.status(200).json({
            data: usersList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage)
            }
        })
    } catch (error) {
        console.log(`Get /users error: ${error}`)
        res.status(500).json({
            error: 'Failed to get users'
        })
    }
}