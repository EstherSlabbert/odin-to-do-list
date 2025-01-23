import { createTask } from "./task.js";
//Utility
function generateId() {
  const projects = projectManager.getProjects();
  const existingIds = projects.map((project) =>
    parseInt(project.id.split("_")[1], 10)
  );
  const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  return "Project_" + String(nextId).padStart(3, "0");
}

//Centralised Project Manager
const projectManager = {
  //Project Management
  getProjects() {
    return JSON.parse(localStorage.getItem("projects")) || [];
  },
  getProject(id) {
    const projects = this.getProjects();
    return projects.find((project) => project.id === id);
  },
  saveProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
    console.log("Projects saved successfully!");
  },
  ensureAProjectExists() {
    let projects = this.getProjects();
    if (projects.length === 0) {
      this.addProject(
        "Hero's Routine: Saitama's To-Do List",
        "This project is a daily planner inspired by Saitama, the unbeatable hero from One Punch Man. It combines heroic tasks like fighting monsters with everyday activities like grocery shopping and maintaining a balanced lifestyle. Perfect for anyone striving to stay disciplined, focused, and ready to save the day—whether you're training to be a hero or just tackling your own to-do list."
      );
      sessionStorage.setItem("defaultTasksAdded", "false");
    }
    return projects;
  },
  addsTasksToDefaultProject() {
    let defaultProject = this.getProject("Project_001");
    if (!defaultProject) {
      return;
    }
    const defaultTasksAdded = sessionStorage.getItem("defaultTasksAdded");
    if (defaultProject.tasks.length === 0 && defaultTasksAdded === "false") {
      let tasks = [
        createTask({
          title: "Morning 10K Run",
          description:
            "Start the day strong with a 10-kilometer run. Remember, consistency is key to becoming stronger.",
          dueDate: new Date().toISOString().slice(0, 16),
          priority: "priority-3",
        }),
        createTask({
          title: "Daily 100 Push-Ups, Sit-Ups, and Squats",
          description:
            "Complete 100 reps of each exercise today. It's simple, effective, and the foundation of hero-level fitness.",
          dueDate: new Date().toISOString().slice(0, 16),
          priority: "priority-4",
        }),
        createTask({
          title: "Stock Up on Groceries",
          description:
            "Make sure the fridge is full with healthy food and bargain items. Keep an eye out for discounts!",
          dueDate: new Date().toISOString().slice(0, 16),
          priority: "priority-2",
        }),
        createTask({
          title: "Watch TV or Play Games",
          description:
            "After all the training and hero work, relax with some TV shows or video games. Balance is important, even for a hero.",
          dueDate: new Date().toISOString().slice(0, 16),
          priority: "priority-3",
        }),
        createTask({
          title: "Fight a Monster",
          description:
            "If a threat arises, make sure to eliminate it in one punch. Quick, efficient, and heroic!",
          dueDate: new Date().toISOString().slice(0, 16),
          priority: "priority-2",
        }),
      ];

      tasks.forEach((task) => {
        this.addTaskToProject("Project_001", task);
      });

      sessionStorage.setItem("defaultTasksAdded", "true");
    }
  },
  addProject(title, description) {
    const projects = this.getProjects();
    const newProject = createProject({ title, description });
    projects.push(newProject);
    this.saveProjects(projects);
  },
  editProject(id, updatedData) {
    let projects = this.getProjects();
    projects = projects.map((project) => {
      if (project.id === id) return { ...project, ...updatedData };
      return project;
    });
    this.saveProjects(projects);
  },
  deleteAllProjects() {
    localStorage.removeItem("projects");
  },
  deleteProject(id, title) {
    let projects = this.getProjects();

    projects = projects.filter((project) => {
      const match = !(project.id === id && project.title === title);
      if (!match) console.log("Deleting Project: ", project);
      return match;
    });

    this.saveProjects(projects);
  },
  //Task Management
  getTaskFromProject(projectId, taskId) {
    let project = this.getProject(projectId);
    let task = project.tasks.find((task) => task.id === taskId);
    return task;
  },
  addTaskToProject(projectId, task) {
    let projects = this.getProjects();
    projects = projects.map((project) => {
      if (project.id === projectId) {
        project.tasks.push(task);
      }
      return project;
    });
    this.saveProjects(projects);
  },
  editTaskInProject(projectId, taskId, updatedData) {
    let projects = this.getProjects();
    projects = projects.map((project) => {
      if (project.id === projectId) {
        project.tasks = project.tasks.map((task) => {
          if (task.id === taskId) return { ...task, ...updatedData };
          return task;
        });
      }
      return project;
    });
    this.saveProjects(projects);
  },
  deleteTaskFromProject(projectId, taskId) {
    let projects = this.getProjects();
    projects = projects.map((project) => {
      if (project.id === projectId) {
        project.tasks = project.tasks.filter((task) => task.id !== taskId);
      }
      return project;
    });
    this.saveProjects(projects);
  },
};

// Project factory
const createProject = ({ title, description }) => ({
  id: generateId(),
  title: title,
  description: description,
  createdAt: new Date(),
  tasks: [],
  saveProject() {
    let projects = projectManager.getProjects();
    projects.push({
      id: this.id,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      tasks: this.tasks,
    });
    projectManager.saveProjects(projects);
  },
  getProject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      tasks: this.tasks,
    };
  },
});

export { projectManager };
