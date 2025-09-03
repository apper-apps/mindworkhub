import employeesData from "@/services/mockData/employees.json";

class EmployeeService {
  constructor() {
    this.employees = [...employeesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.employees];
  }

  async getById(id) {
    await this.delay();
    const employee = this.employees.find(emp => emp.Id === parseInt(id));
    if (!employee) {
      throw new Error("Employee not found");
    }
    return { ...employee };
  }

  async create(employeeData) {
    await this.delay();
    const maxId = Math.max(...this.employees.map(emp => emp.Id), 0);
    const newEmployee = {
      Id: maxId + 1,
      ...employeeData,
      status: employeeData.status || "active"
    };
    this.employees.push(newEmployee);
    return { ...newEmployee };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    this.employees[index] = { ...this.employees[index], ...updateData };
    return { ...this.employees[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    const deleted = this.employees.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByDepartment(department) {
    await this.delay();
    return this.employees.filter(emp => emp.department === department).map(emp => ({ ...emp }));
  }

  async getByStatus(status) {
    await this.delay();
    return this.employees.filter(emp => emp.status === status).map(emp => ({ ...emp }));
  }
}

export default new EmployeeService();