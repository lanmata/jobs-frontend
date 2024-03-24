import {HttpHeaders} from "@angular/common/http";

export class AppConst {
  public static readonly STATUS_TYPE = {
    ENABLE_STATUS: {key: 'E', value: 'ENABLED'},
    DISABLE_STATUS : {key: 'D', value: 'DISABLED'}
  }
  public static readonly NAVIGATOR = {
    FEATURES_PATH : 'crm/features',
    USERS_PATH : 'crm/users',
    ROLES_PATH : 'crm/roles',
    PEOPLE_PATH : 'crm/people',
    PERSON_EDITOR_PATH : 'crm/person-editor',
    CONTACT_EDITOR_PATH : 'crm/contact-editor',
    CONTACT_TYPES_EDITOR_PATH : 'crm/contact-types',
    CONTACT_TYPE_PATH: 'crm/contact-type',
    CREDENTIALS_PATH : 'crm/credentials'
  }

  public static readonly JOBS_NAVIGATOR = {
    OFFER_PATH : 'offer',
    JOB_EDITOR_PATH : 'jobs/job-editor',
    JOB_TYPES_PATH : 'jobs/job-types',
    JOB_TYPE_PATH : 'jobs/job-type',
    JOB_STATUSES_PATH : 'jobs/job-statuses',
    JOB_STATUS_PATH : 'jobs/job-status',
    COMPANIES_PATH : 'jobs/companies',
    COMPANY_PATH : 'jobs/company',
    COMPANY_EDITOR_PATH : 'jobs/company-editor',
    COMPANY_TYPES_PATH : 'jobs/company-types',
    COMPANY_TYPE_PATH : 'jobs/company-type',
    COMPANY_STATUSES_PATH : 'jobs/company-statuses',
    COMPANY_STATUS_PATH : 'jobs/company-status',
    JOB_APPLICATIONS_PATH : 'jobs/job-applications',
    JOB_APPLICATION_PATH : 'jobs/job-application',
    JOB_APPLICATION_EDITOR_PATH : 'jobs/job-application-editor',
    JOB_APPLICATION_STATUSES_PATH : 'jobs/job-application-statuses',
    JOB_APPLICATION_STATUS_PATH : 'jobs/job-application-status',
    JOB_APPLICATION_STATUSES_EDITOR_PATH : 'jobs/job-application-statuses-editor',
    JOB_APPLICATION_STATUS_EDITOR_PATH : 'jobs/job-application-status-editor'
  }

  public static readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

}
