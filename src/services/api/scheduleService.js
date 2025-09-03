import scheduleData from "@/services/mockData/scheduleEvents.json";

class ScheduleService {
  constructor() {
    this.events = [...scheduleData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.events];
  }

  async getById(id) {
    await this.delay();
    const event = this.events.find(e => e.Id === parseInt(id));
    if (!event) {
      throw new Error("Event not found");
    }
    return { ...event };
  }

  async create(eventData) {
    await this.delay();
    const maxId = Math.max(...this.events.map(e => e.Id), 0);
    const newEvent = {
      Id: maxId + 1,
      ...eventData,
      attendees: eventData.attendees || []
    };
    this.events.push(newEvent);
    return { ...newEvent };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Event not found");
    }
    this.events[index] = { ...this.events[index], ...updateData };
    return { ...this.events[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Event not found");
    }
    const deleted = this.events.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByDateRange(startDate, endDate) {
    await this.delay();
    return this.events.filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= new Date(startDate) && eventStart <= new Date(endDate);
    }).map(e => ({ ...e }));
  }

  async getByType(type) {
    await this.delay();
    return this.events.filter(e => e.type === type).map(e => ({ ...e }));
  }
}

export default new ScheduleService();