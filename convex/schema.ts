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
    sourceRoleTitle: v.optional(v.string()),
    learnerPersonaSummary: v.optional(v.string()),
    requiredSkills: v.optional(v.array(v.string())),
    gapSkills: v.optional(v.array(v.string())),
    generationVersion: v.optional(v.string()),
    generationStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("roadmap_ready"),
        v.literal("generating"),
        v.literal("ready"),
        v.literal("failed"),
      ),
    ),
    generationError: v.optional(v.string()),
    currentGeneratingModuleId: v.optional(v.id("learning_path_modules")),
    createdAt: v.number(),
  })
    .index("by_employee_id", ["employeeId"])
    .index("by_employer_id", ["employerId"]),

  learning_path_modules: defineTable({
    learningPathId: v.id("learning_paths"),
    title: v.string(),
    category: v.string(),
    summary: v.optional(v.string()),
    targetSkill: v.optional(v.string()),
    personalizationNote: v.optional(v.string()),
    notesContent: v.optional(v.string()),
    videoStyle: v.optional(v.string()),
    learningObjectives: v.optional(v.array(v.string())),
    duration: v.string(),
    lessons: v.number(),
    sceneCount: v.optional(v.number()),
    difficulty: v.optional(
      v.union(
        v.literal("foundation"),
        v.literal("intermediate"),
        v.literal("advanced"),
      ),
    ),
    estimatedMinutes: v.optional(v.number()),
    slides: v.optional(
      v.array(
        v.object({
          title: v.string(),
          focus: v.optional(v.string()),
          bullets: v.array(v.string()),
          speakerNotes: v.string(),
          narration: v.string(),
          takeaway: v.optional(v.string()),
          visualCue: v.optional(v.string()),
          imageUrl: v.optional(v.string()),
          imageSourceUrl: v.optional(v.string()),
          imageCaption: v.optional(v.string()),
          layoutVariant: v.optional(v.string()),
          approxDurationSec: v.number(),
          audioUrl: v.optional(v.string()),
          audioChunks: v.optional(v.array(v.string())),
        }),
      ),
    ),
    narrationScript: v.optional(v.string()),
    knowledgeChecks: v.optional(v.array(v.string())),
    qaPairs: v.optional(
      v.array(
        v.object({
          question: v.string(),
          answer: v.optional(v.string()),
          options: v.optional(v.array(v.string())),
          correctAnswer: v.optional(v.string()),
          explanation: v.optional(v.string()),
        }),
      ),
    ),
    voiceoverAudioUrl: v.optional(v.string()),
    slideDeckUrl: v.optional(v.string()),
    transcriptUrl: v.optional(v.string()),
    artifactManifestUrl: v.optional(v.string()),
    generationProvider: v.optional(v.string()),
    generationStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("partial"),
        v.literal("ready"),
        v.literal("failed"),
      ),
    ),
    notesStatus: v.optional(
      v.union(v.literal("pending"), v.literal("processing"), v.literal("ready"), v.literal("failed")),
    ),
    videoStatus: v.optional(
      v.union(v.literal("pending"), v.literal("processing"), v.literal("ready"), v.literal("failed")),
    ),
    qaStatus: v.optional(
      v.union(v.literal("pending"), v.literal("processing"), v.literal("ready"), v.literal("failed")),
    ),
    generationError: v.optional(v.string()),
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
