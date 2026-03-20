import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  employers: defineTable({
    companyName: v.string(),
    ownerEmail: v.string(),
    ownerName: v.optional(v.string()),
    ownerRole: v.optional(v.string()),
    ownerWorkOSUserId: v.string(),
    authProvider: v.optional(
      v.union(
        v.literal("password"),
        v.literal("google"),
        v.literal("outlook"),
        v.literal("unknown"),
      ),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    onboardingCompletedAt: v.optional(v.number()),
  })
    .index("by_owner_workos_user_id", ["ownerWorkOSUserId"])
    .index("by_owner_email", ["ownerEmail"]),
  employees: defineTable({
    employerId: v.id("employers"),
    employerWorkOSUserId: v.string(),
    employeeId: v.string(),
    workOSUserId: v.string(),
    email: v.string(),
    fullName: v.string(),
    roleTitle: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    status: v.union(v.literal("active")),
  })
    .index("by_employer_id", ["employerId"])
    .index("by_employee_id", ["employeeId"])
    .index("by_workos_user_id", ["workOSUserId"])
    .index("by_employer_owner_id", ["employerWorkOSUserId"]),
});
