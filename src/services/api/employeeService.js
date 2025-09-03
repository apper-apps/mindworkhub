import { toast } from 'react-toastify';

class EmployeeService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'employee_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "status_c" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
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
      return response.data.map(employee => ({
        Id: employee.Id,
        name: employee.Name || '',
        email: employee.email_c || '',
        role: employee.role_c || '',
        department: employee.department_c || '',
        avatar: employee.avatar_c || '',
        phone: employee.phone_c || '',
        status: employee.status_c || 'active'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees:", error?.response?.data?.message);
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
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "status_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, recordId, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const employee = response.data;
      return {
        Id: employee.Id,
        name: employee.Name || '',
        email: employee.email_c || '',
        role: employee.role_c || '',
        department: employee.department_c || '',
        avatar: employee.avatar_c || '',
        phone: employee.phone_c || '',
        status: employee.status_c || 'active'
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching employee with ID ${recordId}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(employeeData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: employeeData.name || 'New Employee',
          email_c: employeeData.email || '',
          role_c: employeeData.role || '',
          department_c: employeeData.department || '',
          avatar_c: employeeData.avatar || '',
          phone_c: employeeData.phone || '',
          status_c: employeeData.status || 'active'
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
          console.error(`Failed to create employees ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
            name: created.Name || '',
            email: created.email_c || '',
            role: created.role_c || '',
            department: created.department_c || '',
            avatar: created.avatar_c || '',
            phone: created.phone_c || '',
            status: created.status_c || 'active'
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating employee:", error?.response?.data?.message);
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
          ...(updateData.name !== undefined && { Name: updateData.name }),
          ...(updateData.email !== undefined && { email_c: updateData.email }),
          ...(updateData.role !== undefined && { role_c: updateData.role }),
          ...(updateData.department !== undefined && { department_c: updateData.department }),
          ...(updateData.avatar !== undefined && { avatar_c: updateData.avatar }),
          ...(updateData.phone !== undefined && { phone_c: updateData.phone }),
          ...(updateData.status !== undefined && { status_c: updateData.status })
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
          console.error(`Failed to update employees ${failedUpdates.length} records:${failedUpdates}`);
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
            name: updated.Name || '',
            email: updated.email_c || '',
            role: updated.role_c || '',
            department: updated.department_c || '',
            avatar: updated.avatar_c || '',
            phone: updated.phone_c || '',
            status: updated.status_c || 'active'
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating employee:", error?.response?.data?.message);
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
          console.error(`Failed to delete Employees ${failedDeletions.length} records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === ids.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting employees:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return false;
  }

  async getByDepartment(department) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "department_c",
            Operator: "EqualTo",
            Values: [department]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(employee => ({
        Id: employee.Id,
        name: employee.Name || '',
        email: employee.email_c || '',
        role: employee.role_c || '',
        department: employee.department_c || '',
        avatar: employee.avatar_c || '',
        phone: employee.phone_c || '',
        status: employee.status_c || 'active'
      })) || [];
    } catch (error) {
      console.error("Error fetching employees by department:", error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "status_c" } }
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
      
      return response.data?.map(employee => ({
        Id: employee.Id,
        name: employee.Name || '',
        email: employee.email_c || '',
        role: employee.role_c || '',
        department: employee.department_c || '',
        avatar: employee.avatar_c || '',
        phone: employee.phone_c || '',
        status: employee.status_c || 'active'
      })) || [];
    } catch (error) {
      console.error("Error fetching employees by status:", error);
      return [];
    }
  }
}

export default new EmployeeService();