// Utility - todo: revisit and see if perhaps an incrementing integer would be better
function generateId() {
  return "Task_" + Math.random().toString(36);
}

// Task factory
const createTask = ({
  title,
  dueDate,
  description,
  priority,
  completed = false,
}) => ({
  id: generateId(),
  title,
  dueDate,
  description,
  priority,
  completed,
  createdAt: new Date().getUTCDate().toString(),
  getTask() {
    return {
      title: this.title,
      dueDate: this.dueDate,
      description: this.description,
      priority: this.priority,
      completed: this.completed,
      createdAt: this.createdAt,
    };
  },
});

export { createTask };
