import { ServiceTemplate } from './service-template';
import { HttpErrorResponse } from '@angular/common/http';

describe('ServiceTemplate', () => {
  let service: ServiceTemplate;

  beforeEach(() => {
    service = new ServiceTemplate();
  });

  it('should handle ErrorEvent', () => {
    const errorEvent = new ErrorEvent('test error');
    spyOn(console, 'error');
    service.handlerError(errorEvent);
    expect(console.error).toHaveBeenCalledWith(errorEvent);
  });

  it('should handle HttpErrorResponse', () => {
    const httpErrorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: 'test error',
    });
    spyOn(console, 'error');
    service.handlerError(httpErrorResponse);
    expect(console.error).toHaveBeenCalledWith(`Code: ${httpErrorResponse.status}, Message: Error: ${httpErrorResponse.message}`);
  });

});
