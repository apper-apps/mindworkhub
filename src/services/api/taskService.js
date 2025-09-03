import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "assignee_id_c" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
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
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        status: task.status_c || 'todo',
        dueDate: task.due_date_c || null,
        createdAt: task.created_at_c || task.CreatedOn,
        assigneeId: task.assignee_id_c?.Id || task.assignee_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
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
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "assignee_id_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, recordId, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        status: task.status_c || 'todo',
        dueDate: task.due_date_c || null,
        createdAt: task.created_at_c || task.CreatedOn,
        assigneeId: task.assignee_id_c?.Id || task.assignee_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${recordId}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: taskData.title || taskData.Name || 'New Task',
          title_c: taskData.title || '',
          description_c: taskData.description || '',
          priority_c: taskData.priority || 'medium',
          status_c: taskData.status || 'todo',
          due_date_c: taskData.dueDate || null,
          created_at_c: new Date().toISOString(),
          assignee_id_c: taskData.assigneeId ? parseInt(taskData.assigneeId) : null
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
          console.error(`Failed to create tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
            description: created.description_c || '',
            priority: created.priority_c || 'medium',
            status: created.status_c || 'todo',
            dueDate: created.due_date_c || null,
            createdAt: created.created_at_c || created.CreatedOn,
            assigneeId: created.assignee_id_c?.Id || created.assignee_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
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
          ...(updateData.description !== undefined && { description_c: updateData.description }),
          ...(updateData.priority !== undefined && { priority_c: updateData.priority }),
          ...(updateData.status !== undefined && { status_c: updateData.status }),
          ...(updateData.dueDate !== undefined && { due_date_c: updateData.dueDate }),
          ...(updateData.assigneeId !== undefined && { assignee_id_c: updateData.assigneeId ? parseInt(updateData.assigneeId) : null })
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
          console.error(`Failed to update tasks ${failedUpdates.length} records:${failedUpdates}`);
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
            description: updated.description_c || '',
            priority: updated.priority_c || 'medium',
            status: updated.status_c || 'todo',
            dueDate: updated.due_date_c || null,
            createdAt: updated.created_at_c || updated.CreatedOn,
            assigneeId: updated.assignee_id_c?.Id || updated.assignee_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
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
          console.error(`Failed to delete Tasks ${failedDeletions.length} records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === ids.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting tasks:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return false;
  }

  async getByAssignee(assigneeId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "assignee_id_c" } }
        ],
        where: [
          {
            FieldName: "assignee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(assigneeId)]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        status: task.status_c || 'todo',
        dueDate: task.due_date_c || null,
        createdAt: task.created_at_c || task.CreatedOn,
        assigneeId: task.assignee_id_c?.Id || task.assignee_id_c
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by assignee:", error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "assignee_id_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        status: task.status_c || 'todo',
        dueDate: task.due_date_c || null,
        createdAt: task.created_at_c || task.CreatedOn,
        assigneeId: task.assignee_id_c?.Id || task.assignee_id_c
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    }
  }

  async getByPriority(priority) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "assignee_id_c" } }
        ],
        where: [
          {
            FieldName: "priority_c",
            Operator: "EqualTo",
            Values: [priority]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        status: task.status_c || 'todo',
        dueDate: task.due_date_c || null,
        createdAt: task.created_at_c || task.CreatedOn,
        assigneeId: task.assignee_id_c?.Id || task.assignee_id_c
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by priority:", error);
      return [];
    }
  }
}

export default new TaskService();