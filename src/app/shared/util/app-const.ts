import {HttpHeaders} from "@angular/common/http";

export class AppConst {
  public static readonly STATUS_TYPE = {
    ENABLE_STATUS: {key: 'E', value: 'ENABLED'},
    DISABLE_STATUS : {key: 'D', value: 'DISABLED'}
  }

  public static readonly JOBS_NAVIGATOR = {
    JOB_EDITOR_PATH : 'job-editor',
    JOB_TYPES_PATH : 'job-types',
    JOB_TYPE_PATH : 'job-type',
    JOB_STATUSES_PATH : 'job-statuses',
    JOB_STATUS_PATH : 'job-status',
    COMPANY_PATH : 'company',
    COMPANY_EDITOR_PATH : 'company-editor',
    COMPANY_TYPES_PATH : 'company-types',
    COMPANY_TYPE_PATH : 'company-type',
    COMPANY_STATUSES_PATH : 'company-statuses',
    COMPANY_STATUS_PATH : 'company-status',
    JOB_APPLICATIONS_PATH : 'job-applications',
    JOB_APPLICATION_PATH : 'job-application',
    JOB_APPLICATION_EDITOR_PATH : 'job-application-editor',
    JOB_APPLICATION_STATUSES_PATH : 'job-application-statuses',
    JOB_APPLICATION_STATUS_PATH : 'job-application-status',
    JOB_APPLICATION_STATUSES_EDITOR_PATH : 'job-application-statuses-editor',
    JOB_APPLICATION_STATUS_EDITOR_PATH : 'job-application-status-editor',
    COMPANIES_PATH : 'companies',
    MODE_PATH : 'mode',
    OFFER_PATH : 'offer',
    POSITION_PATH : 'position',
    SOURCE_PATH: "source",
    STATUS_PATH: "status"

  }

  public static readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

}
