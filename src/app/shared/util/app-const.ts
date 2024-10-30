import {HttpHeaders} from "@angular/common/http";

export class AppConst {
    public static readonly STATUS_TYPE = {
        ENABLE_STATUS: {key: 'E', value: 'ENABLED'},
        DISABLE_STATUS: {key: 'D', value: 'DISABLED'}
    }

    public static readonly JOBS_NAVIGATOR = {
        JOB_EDITOR_PATH: 'job-editor',
        JOB_TYPES_PATH: 'job-types',
        JOB_TYPE_PATH: 'job-type',
        JOB_STATUSES_PATH: 'job-statuses',
        JOB_STATUS_PATH: 'job-status',
        COMPANY_PATH: 'company',
        COMPANY_EDITOR_PATH: 'company-editor',
        NEW_COMPANY_PATH: "company/new-offer",
        COMPANY_TYPES_PATH: 'company-types',
        COMPANY_TYPE_PATH: 'company-type',
        COMPANY_STATUSES_PATH: 'company-statuses',
        COMPANY_STATUS_PATH: 'company-status',
        JOB_APPLICATIONS_PATH: 'job-applications',
        JOB_APPLICATION_PATH: 'job-application',
        JOB_APPLICATION_EDITOR_PATH: 'job-application-editor',
        JOB_APPLICATION_STATUSES_PATH: 'job-application-statuses',
        JOB_APPLICATION_STATUS_PATH: 'job-application-status',
        JOB_APPLICATION_STATUSES_EDITOR_PATH: 'job-application-statuses-editor',
        JOB_APPLICATION_STATUS_EDITOR_PATH: 'job-application-status-editor',
        COMPANIES_PATH: 'companies',
        EDIT_COMPANY_PATH: "company/edit-offer",
        MODE_PATH: 'mode',
        EDIT_MODE_PATH: 'mode/edit-mode',
        OFFER_PATH: 'offer',
        NEW_OFFER_PATH: "offer/new-offer",
        EDIT_OFFER_PATH: "offer/edit-offer",
        POSITION_PATH: 'position',
        EDIT_POSITION_PATH: "position/edit-position",
        NEW_POSITION_PATH: "position/new-position",
        SOURCE_PATH: "source",
        EDIT_SOURCE_PATH: "source/edit-source",
        NEW_SOURCE_PATH: "source/new-source",
        STATUS_PATH: "status",
        NEW_STATUS_PATH: "status/new-status",
        EDIT_STATUS_PATH: "status/edit-status",
        TERM_PATH: "term",
        EDIT_TERM_PATH: "term/edit-term",
        NEW_TERM_PATH: "term/new-term"

    }

    public static readonly HTTP_OPTIONS = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

}
