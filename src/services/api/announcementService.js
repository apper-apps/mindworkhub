import { toast } from "react-toastify";
import React from "react";

class AnnouncementService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'announcement_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "is_read_c" } }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database fields to UI expected format
      return response.data.map(announcement => ({
        Id: announcement.Id,
        title: announcement.title_c || '',
        content: announcement.content_c || '',
        author: announcement.author_c || '',
        date: announcement.date_c || announcement.CreatedOn,
        category: announcement.category_c || 'general',
        isRead: announcement.is_read_c || false
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching announcements:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(recordId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "is_read_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, recordId, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const announcement = response.data;
      return {
        Id: announcement.Id,
        title: announcement.title_c || '',
        content: announcement.content_c || '',
        author: announcement.author_c || '',
        date: announcement.date_c || announcement.CreatedOn,
        category: announcement.category_c || 'general',
        isRead: announcement.is_read_c || false
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching announcement with ID ${recordId}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(announcementData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: announcementData.title || 'New Announcement',
          title_c: announcementData.title || '',
          content_c: announcementData.content || '',
          author_c: announcementData.author || '',
          date_c: announcementData.date || new Date().toISOString(),
          category_c: announcementData.category || 'general',
          is_read_c: announcementData.isRead || false
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create announcements ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const created = successfulRecords[0].data;
          return {
            Id: created.Id,
            title: created.title_c || '',
            content: created.content_c || '',
            author: created.author_c || '',
            date: created.date_c || created.CreatedOn,
            category: created.category_c || 'general',
            isRead: created.is_read_c || false
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating announcement:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return null;
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          // Only include Updateable fields
          ...(updateData.title !== undefined && { Name: updateData.title, title_c: updateData.title }),
          ...(updateData.content !== undefined && { content_c: updateData.content }),
          ...(updateData.author !== undefined && { author_c: updateData.author }),
          ...(updateData.date !== undefined && { date_c: updateData.date }),
          ...(updateData.category !== undefined && { category_c: updateData.category }),
          ...(updateData.isRead !== undefined && { is_read_c: updateData.isRead })
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update announcements ${failedUpdates.length} records:${failedUpdates}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updated = successfulUpdates[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c || '',
            content: updated.content_c || '',
            author: updated.author_c || '',
            date: updated.date_c || updated.CreatedOn,
            category: updated.category_c || 'general',
            isRead: updated.is_read_c || false
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating announcement:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return null;
  }

  async delete(recordIds) {
    try {
      const ids = Array.isArray(recordIds) ? recordIds : [recordIds];
      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete Announcements ${failedDeletions.length} records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === ids.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting announcements:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return false;
  }

  async markAsRead(id) {
    return this.update(id, { isRead: true });
  }

  async getUnread() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "is_read_c" } }
        ],
        where: [
          {
            FieldName: "is_read_c",
            Operator: "EqualTo",
            Values: [false]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(announcement => ({
        Id: announcement.Id,
        title: announcement.title_c || '',
        content: announcement.content_c || '',
        author: announcement.author_c || '',
        date: announcement.date_c || announcement.CreatedOn,
        category: announcement.category_c || 'general',
        isRead: announcement.is_read_c || false
      })) || [];
    } catch (error) {
      console.error("Error fetching unread announcements:", error);
      return [];
    }
  }

  async getByCategory(category) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "is_read_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(announcement => ({
        Id: announcement.Id,
        title: announcement.title_c || '',
        content: announcement.content_c || '',
        author: announcement.author_c || '',
        date: announcement.date_c || announcement.CreatedOn,
        category: announcement.category_c || 'general',
        isRead: announcement.is_read_c || false
      })) || [];
    } catch (error) {
      console.error("Error fetching announcements by category:", error);
      return [];
}
  }
}

export default new AnnouncementService();