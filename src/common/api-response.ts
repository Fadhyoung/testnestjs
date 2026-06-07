export class ApiResponse {
  static success(data: any, message = 'Success', status = 200) {
    return { status, message, data };
  }

  static created(data: any, message = 'Created successfully') {
    return { status: 201, message, data };
  }

  static deleted(message = 'Deleted successfully') {
    return { status: 200, message };
  }

  static updated(data: any, message = 'Updated successfully') {
    return { status: 200, message, data };
  }
}
