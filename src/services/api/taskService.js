import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async create(taskData) {
    await this.delay();
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      status: taskData.status || "todo",
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks[index] = { ...this.tasks[index], ...updateData };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    const deleted = this.tasks.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByAssignee(assigneeId) {
    await this.delay();
    return this.tasks.filter(t => t.assigneeId === assigneeId).map(t => ({ ...t }));
  }

  async getByStatus(status) {
    await this.delay();
    return this.tasks.filter(t => t.status === status).map(t => ({ ...t }));
  }

  async getByPriority(priority) {
    await this.delay();
    return this.tasks.filter(t => t.priority === priority).map(t => ({ ...t }));
  }
}

export default new TaskService();