import announcementsData from "@/services/mockData/announcements.json";

class AnnouncementService {
  constructor() {
    this.announcements = [...announcementsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.announcements];
  }

  async getById(id) {
    await this.delay();
    const announcement = this.announcements.find(a => a.Id === parseInt(id));
    if (!announcement) {
      throw new Error("Announcement not found");
    }
    return { ...announcement };
  }

  async create(announcementData) {
    await this.delay();
    const maxId = Math.max(...this.announcements.map(a => a.Id), 0);
    const newAnnouncement = {
      Id: maxId + 1,
      ...announcementData,
      date: new Date().toISOString(),
      isRead: false
    };
    this.announcements.push(newAnnouncement);
    return { ...newAnnouncement };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.announcements.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Announcement not found");
    }
    this.announcements[index] = { ...this.announcements[index], ...updateData };
    return { ...this.announcements[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.announcements.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Announcement not found");
    }
    const deleted = this.announcements.splice(index, 1)[0];
    return { ...deleted };
  }

  async markAsRead(id) {
    await this.delay();
    return this.update(id, { isRead: true });
  }

  async getUnread() {
    await this.delay();
    return this.announcements.filter(a => !a.isRead).map(a => ({ ...a }));
  }

  async getByCategory(category) {
    await this.delay();
    return this.announcements.filter(a => a.category === category).map(a => ({ ...a }));
  }
}

export default new AnnouncementService();