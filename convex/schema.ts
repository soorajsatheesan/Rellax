import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  employers: defineTable({
    companyName: v.string(),
    companyLogoUrl: v.optional(v.string()),
    companyWebsite: v.optional(v.string()),
    industry: v.optional(v.string()),
    companySize: v.optional(v.string()),
    headquarters: v.optional(v.string()),
    aboutCompany: v.optional(v.string()),
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
  role_requirements: defineTable({
    employerId: v.id("employers"),
    roleTitle: v.string(),
    roleId: v.optional(v.string()),
    roleKey: v.optional(v.string()),
    requiredSkills: v.array(v.string()),
    preferredSkills: v.optional(v.array(v.string())),
    responsibilities: v.optional(v.array(v.string())),
    qualifications: v.optional(v.array(v.string())),
    toolsAndTechnologies: v.optional(v.array(v.string())),
    roleSummary: v.optional(v.string()),
    seniority: v.optional(v.string()),
    sourceJdText: v.optional(v.string()),
    jdText: v.optional(v.string()),
    jdFileUrl: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_employer_role_id", ["employerId", "roleId"])
    .index("by_employer_role_key", ["employerId", "roleKey"]),
  employee_progress: defineTable({
    employeeId: v.id("employees"),
    employerId: v.id("employers"),
    progressPercentage: v.number(),
    updatedAt: v.number(),
  })
    .index("by_employer_id", ["employerId"])
    .index("by_employee_id", ["employeeId"]),
  employees: defineTable({
    employerId: v.id("employers"),
    employerWorkOSUserId: v.string(),
    employeeId: v.string(),
    workOSUserId: v.string(),
    email: v.string(),
    fullName: v.string(),
    roleId: v.optional(v.string()),
    roleTitle: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    status: v.union(v.literal("active")),
  })
    .index("by_employer_id", ["employerId"])
    .index("by_employee_id", ["employeeId"])
    .index("by_workos_user_id", ["workOSUserId"])
    .index("by_employer_owner_id", ["employerWorkOSUserId"]),

  // Employee learning (employee-owned; employer does not write)
  employee_resumes: defineTable({
    employeeId: v.id("employees"),
    employerId: v.id("employers"),
    resumeText: v.string(),
    extractedSkills: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_employee_id", ["employeeId"])
    .index("by_employer_id", ["employerId"]),

  learning_paths: defineTable({
    employeeId: v.id("employees"),
    employerId: v.id("employers"),
    sourceResumeId: v.optional(v.id("employee_resumes")),
    createdAt: v.number(),
  })
    .index("by_employee_id", ["employeeId"])
    .index("by_employer_id", ["employerId"]),

  learning_path_modules: defineTable({
    learningPathId: v.id("learning_paths"),
    title: v.string(),
    category: v.string(),
    duration: v.string(),
    lessons: v.number(),
    orderIndex: v.number(),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
    ),
    completedAt: v.optional(v.number()),
  })
    .index("by_learning_path_id", ["learningPathId"]),
});
