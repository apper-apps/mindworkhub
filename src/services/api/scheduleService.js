import { toast } from 'react-toastify';

class ScheduleService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'schedule_event_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "attendees_c" } }
        ],
        orderBy: [{ fieldName: "start_time_c", sorttype: "ASC" }]
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
      return response.data.map(event => ({
        Id: event.Id,
        title: event.title_c || '',
        type: event.type_c || 'meeting',
        startTime: event.start_time_c || null,
        endTime: event.end_time_c || null,
        location: event.location_c || '',
        attendees: event.attendees_c ? event.attendees_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching schedule events:", error?.response?.data?.message);
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
          { field: { Name: "type_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "attendees_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, recordId, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const event = response.data;
      return {
        Id: event.Id,
        title: event.title_c || '',
        type: event.type_c || 'meeting',
        startTime: event.start_time_c || null,
        endTime: event.end_time_c || null,
        location: event.location_c || '',
        attendees: event.attendees_c ? event.attendees_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching schedule event with ID ${recordId}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(eventData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: eventData.title || 'New Event',
          title_c: eventData.title || '',
          type_c: eventData.type || 'meeting',
          start_time_c: eventData.startTime || new Date().toISOString(),
          end_time_c: eventData.endTime || new Date().toISOString(),
          location_c: eventData.location || '',
          attendees_c: Array.isArray(eventData.attendees) ? eventData.attendees.join(',') : ''
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
          console.error(`Failed to create schedule events ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
            type: created.type_c || 'meeting',
            startTime: created.start_time_c || null,
            endTime: created.end_time_c || null,
            location: created.location_c || '',
            attendees: created.attendees_c ? created.attendees_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating schedule event:", error?.response?.data?.message);
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
          ...(updateData.type !== undefined && { type_c: updateData.type }),
          ...(updateData.startTime !== undefined && { start_time_c: updateData.startTime }),
          ...(updateData.endTime !== undefined && { end_time_c: updateData.endTime }),
          ...(updateData.location !== undefined && { location_c: updateData.location }),
          ...(updateData.attendees !== undefined && { 
            attendees_c: Array.isArray(updateData.attendees) ? updateData.attendees.join(',') : updateData.attendees 
          })
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
          console.error(`Failed to update schedule events ${failedUpdates.length} records:${failedUpdates}`);
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
            type: updated.type_c || 'meeting',
            startTime: updated.start_time_c || null,
            endTime: updated.end_time_c || null,
            location: updated.location_c || '',
            attendees: updated.attendees_c ? updated.attendees_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating schedule event:", error?.response?.data?.message);
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
          console.error(`Failed to delete Schedule Events ${failedDeletions.length} records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === ids.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting schedule events:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return false;
  }

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "attendees_c" } }
        ],
        where: [
          {
            FieldName: "start_time_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          },
          {
            FieldName: "start_time_c",
            Operator: "LessThanOrEqualTo",
            Values: [endDate]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(event => ({
        Id: event.Id,
        title: event.title_c || '',
        type: event.type_c || 'meeting',
        startTime: event.start_time_c || null,
        endTime: event.end_time_c || null,
        location: event.location_c || '',
        attendees: event.attendees_c ? event.attendees_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      })) || [];
    } catch (error) {
      console.error("Error fetching events by date range:", error);
      return [];
    }
  }

  async getByType(type) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "attendees_c" } }
        ],
        where: [
          {
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: [type]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(event => ({
        Id: event.Id,
        title: event.title_c || '',
        type: event.type_c || 'meeting',
        startTime: event.start_time_c || null,
        endTime: event.end_time_c || null,
        location: event.location_c || '',
        attendees: event.attendees_c ? event.attendees_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      })) || [];
    } catch (error) {
      console.error("Error fetching events by type:", error);
      return [];
    }
  }
}

export default new ScheduleService();