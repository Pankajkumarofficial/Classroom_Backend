import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    varchar,
    timestamp,
    boolean,
    pgEnum,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

// reuse the timestamp helper pattern from app.ts for consistency
const timestamps = {
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
};

// additional enum required by the task
export const roleEnum = pgEnum('role', [
    'student',
    'teacher',
    'admin',
]);

// ---- tables defined by Better Auth core schema ----

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: varchar('image', { length: 2048 }),
    role: roleEnum('role').notNull().default('student'),
    imageCldPubId: text('image_cld_pub_id'),
    ...timestamps,
});

export const session = pgTable(
    'session',
    {
        id: text('id').primaryKey(),
        userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
        token: text('token').notNull().unique(),
        expiresAt: timestamp('expires_at').notNull(),
        ipAddress: varchar('ip_address', { length: 255 }),
        userAgent: varchar('user_agent', { length: 1024 }),
        ...timestamps,
    },
    table => ({
        userIdx: index('session_user_id_idx').on(table.userId),
        tokenUnique: uniqueIndex('session_token_idx').on(table.token),
    })
);

export const account = pgTable(
    'account',
    {
        id: text('id').primaryKey(),
        userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
        accountId: text('account_id').notNull(),
        providerId: text('provider_id').notNull(),
        accessToken: text('access_token'),
        refreshToken: text('refresh_token'),
        accessTokenExpiresAt: timestamp('access_token_expires_at'),
        refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
        scope: text('scope'),
        idToken: text('id_token'),
        password: text('password'),
        ...timestamps,
    },
    table => ({
        userIdx: index('account_user_id_idx').on(table.userId),
        providerAccountUnique: uniqueIndex('account_provider_account_idx').on(
            table.providerId,
            table.accountId
        ),
    })
);

export const verification = pgTable(
    'verification',
    {
        id: text('id').primaryKey(),
        identifier: text('identifier').notNull(),
        value: text('value').notNull(),
        expiresAt: timestamp('expires_at').notNull(),
        ...timestamps,
    },
    table => ({
        identifierIdx: index('verification_identifier_idx').on(table.identifier),
    })
);

// ---- relations helpful for experimental joins ----
export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

// types exported for convenience
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
