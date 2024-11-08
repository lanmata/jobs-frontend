/**
 * Model class for Offer
 */
export class Offer {
    id!: string;
    mount!: number;
    createdDate!: Date;
    lastModifiedDate!: Date;
    status!: string;
    company!: string;
    position!: string;
    term!: string;
    mode!: string;
    source!: string;
}

export class OfferEdit {
    id!: string;
    title!: string;
    description!: string;
    reference!: string;
    statusId!: string;
    status!: string;
    companyId!: string;
    company!: string;
    positionId!: string;
    position!: string;
    termId!: string;
    term!: string;
    modeId!: string;
    mode!: string;
    sourceId!: string
    source!: string;
    postDetailList!: OfferDetail[];
}

export class OfferUpdateRequest {
    statusId!: string;
    description!: string;
    createdDateTime!: string | null;
    mountRate: number = 0;
}

export class OfferDetail {
    id!: string;
    description!: string;
    datetime!: Date;
    mountRate!: number;
    jobOfferId!: string;
    statusId!: string;
    status!: string;
}

export class NewOfferRequest {
    id!: string;
    title!: string;
    description!: string;
    reference!: string;
    dateTime!: string;
    statusId!: string;
    companyId!: string;
    positionId!: string;
    termId!: string;
    modeId!: string;
    sourceId!: string
    mountRate!: number;
}

export const UNIT_TEST_MOCK_NEW_OFFER_REQUEST: NewOfferRequest = new NewOfferRequest();
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.title = 'Test Title';
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.description = 'Test Description';
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.reference = 'Test Reference';
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.dateTime = '2022-01-01 12:00:00';
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.statusId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.companyId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.positionId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.termId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.modeId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.sourceId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_NEW_OFFER_REQUEST.mountRate = 0;

export const UNIT_TEST_MOCK_OFFER_UPDATE_REQUEST: OfferUpdateRequest = new OfferUpdateRequest();
UNIT_TEST_MOCK_OFFER_UPDATE_REQUEST.mountRate = 0;
UNIT_TEST_MOCK_OFFER_UPDATE_REQUEST.statusId = 'ca792661-27d8-4b95-b7b0-e72ccc143aef';
UNIT_TEST_MOCK_OFFER_UPDATE_REQUEST.description = 'Test Comment';
UNIT_TEST_MOCK_OFFER_UPDATE_REQUEST.createdDateTime = '2022-01-01 12:00:00';

export const UNIT_TEST_MOCK_OFFER_EDIT: OfferEdit = new OfferEdit();
UNIT_TEST_MOCK_OFFER_EDIT.id = '0645d0de-fe0d-488c-920b-91145ac35387';
UNIT_TEST_MOCK_OFFER_EDIT.status = 'Test Status';
UNIT_TEST_MOCK_OFFER_EDIT.statusId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_OFFER_EDIT.description = 'Test Description';
UNIT_TEST_MOCK_OFFER_EDIT.companyId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_OFFER_EDIT.company = 'Test Company';
UNIT_TEST_MOCK_OFFER_EDIT.modeId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_OFFER_EDIT.mode = 'Test Mode';
UNIT_TEST_MOCK_OFFER_EDIT.positionId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_OFFER_EDIT.position = 'Test Position';
UNIT_TEST_MOCK_OFFER_EDIT.sourceId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_OFFER_EDIT.source = 'Test Source';
UNIT_TEST_MOCK_OFFER_EDIT.termId = 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb';
UNIT_TEST_MOCK_OFFER_EDIT.term = 'Test Term';
UNIT_TEST_MOCK_OFFER_EDIT.title = 'Test Title';
UNIT_TEST_MOCK_OFFER_EDIT.reference = 'Test Reference';
UNIT_TEST_MOCK_OFFER_EDIT.postDetailList = [
    {
        datetime: new Date(),
        id: 'fe948d66-d14b-4aee-8e82-445ffade7f47',
        description: 'Test Description',
        mountRate: 0,
        jobOfferId: '0645d0de-fe0d-488c-920b-91145ac35387',
        statusId: '2c7c9f5f-11b8-414d-b07d-cf82652cf31f',
        status: 'Test Status',
    },
    {
        datetime: new Date(),
        id: '04e7da3d-7445-4299-9c8e-f26331857739',
        description: 'Test Description',
        mountRate: 0,
        jobOfferId: '0645d0de-fe0d-488c-920b-91145ac35387',
        statusId: 'c93a1ea9-bcd6-4e58-b9ae-979facb286eb',
        status: 'Test Status B'
    }
];

export const UNIT_TEST_MOCK_GET_OFFER_RESPONSE =
    {
        "list":
            [
                {
                    "id": "041a585a-b73f-494c-8dfe-425d020f15ec",
                    "mount": 365000.00,
                    "createdDate": "2024-01-24 15:02:22",
                    "lastModifiedDate": "2024-02-05 11:55:12",
                    "status": "Rejected",
                    "company": "NTT Data Canada Inc.",
                    "position": "Senior Full Stack Developer",
                    "term": "Full-time",
                    "mode": "Remote",
                    "source": "Indeed"
                },
                {
                    "id": "09e827e8-7957-41df-b114-605440144070",
                    "mount": 60.00,
                    "createdDate": "2024-02-15 11:21:34",
                    "lastModifiedDate": "2024-02-17 10:15:22",
                    "status": "On Interview",
                    "company": "Aira",
                    "position": "Senior Developer",
                    "term": "T4",
                    "mode": "On-site",
                    "source": "Wellfound"
                },
                {
                    "id": "0bdf1fe9-d184-4947-b009-c4f6b3e829cb",
                    "mount": 150000.00,
                    "createdDate": "2024-01-23 10:25:33",
                    "lastModifiedDate": "2024-03-11 14:07:25",
                    "status": "Rejected",
                    "company": "DeleteMe",
                    "position": "Software Development Senior Specialist",
                    "term": "Contract",
                    "mode": "Hybrid",
                    "source": "LinkedIn"
                }
            ]
    };

export const UNIT_TEST_MOCK_ALL_DATA =
    [
        {
            "id": "041a585a-b73f-494c-8dfe-425d020f15ec",
            "mount": 365000.00,
            "createdDate": "2024-01-24 15:02:22",
            "lastModifiedDate": "2024-02-05 11:55:12",
            "status": "Rejected",
            "company": "NTT Data Canada Inc.",
            "position": "Senior Full Stack Developer",
            "term": "Full-time",
            "mode": "Remote",
            "source": "Indeed"
        },
        {
            "id": "09e827e8-7957-41df-b114-605440144070",
            "mount": 60.00,
            "createdDate": "2024-02-15 11:21:34",
            "lastModifiedDate": "2024-02-17 10:15:22",
            "status": "On Interview",
            "company": "Aira",
            "position": "Senior Developer",
            "term": "T4",
            "mode": "On-site",
            "source": "Wellfound"
        },
        {
            "id": "0bdf1fe9-d184-4947-b009-c4f6b3e829cb",
            "mount": 150000.00,
            "createdDate": "2024-01-23 10:25:33",
            "lastModifiedDate": "2024-03-11 14:07:25",
            "status": "Rejected",
            "company": "DeleteMe",
            "position": "Software Development Senior Specialist",
            "term": "Contract",
            "mode": "Hybrid",
            "source": "LinkedIn"
        }
    ];