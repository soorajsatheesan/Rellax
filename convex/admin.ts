import { mutation, query } from "./_generated/server";

export const listAllEmployeesForReset = query({
  args: {},
  handler: async (ctx) => {
    const employees = await ctx.db.query("employees").collect();

    return employees.map((employee) => ({
      _id: employee._id,
      email: employee.email,
      fullName: employee.fullName,
      workOSUserId: employee.workOSUserId,
    }));
  },
});

export const wipeAllEmployeeData = mutation({
  args: {},
  handler: async (ctx) => {
    const learningModules = await ctx.db.query("learning_path_modules").collect();
    for (const learningModule of learningModules) {
      await ctx.db.delete(learningModule._id);
    }

    const learningPaths = await ctx.db.query("learning_paths").collect();
    for (const learningPath of learningPaths) {
      await ctx.db.delete(learningPath._id);
    }

    const resumes = await ctx.db.query("employee_resumes").collect();
    for (const resume of resumes) {
      await ctx.db.delete(resume._id);
    }

    const progressRecords = await ctx.db.query("employee_progress").collect();
    for (const progress of progressRecords) {
      await ctx.db.delete(progress._id);
    }

    const employees = await ctx.db.query("employees").collect();
    for (const employee of employees) {
      await ctx.db.delete(employee._id);
    }

    return {
      deletedLearningModules: learningModules.length,
      deletedLearningPaths: learningPaths.length,
      deletedResumes: resumes.length,
      deletedProgressRecords: progressRecords.length,
      deletedEmployees: employees.length,
    };
  },
});
