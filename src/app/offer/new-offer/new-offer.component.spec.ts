import {NewOfferComponent} from "./new-offer.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {OfferService} from "../offer.service";
import {StatusService} from "../../status/status.service";
import {ActivatedRoute} from "@angular/router";
import {DebugElement} from "@angular/core";
import {CompanyService} from "../../company/company.service";
import {ModeService} from "../../mode/mode.service";
import {PositionService} from "../../position/position.service";
import {SourceService} from "../../source/source.service";
import {TermService} from "../../term/term.service";
import {AlertService} from "@shared/services/alert.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";
import {DatePipe} from "@angular/common";
import {UNIT_TEST_MOCK_GET_COMPANY_RESPONSE} from "../../company/company.model";
import {UNIT_TEST_MOCK_GET_MODE_RESPONSE} from "../../mode/mode.model";
import {UNIT_TEST_MOCK_GET_POSITION_RESPONSE} from "../../position/position.model";
import {UNIT_TEST_MOCK_GET_SOURCE_RESPONSE} from "../../source/source.model";
import {UNIT_TEST_MOCK_GET_STATUS_RESPONSE} from "../../status/status.model";
import {UNIT_TEST_MOCK_GET_TERM_RESPONSE} from "../../term/term.model";

describe('NewOfferComponent', () => {
  let component: NewOfferComponent;
  let fixture: ComponentFixture<NewOfferComponent>;
  let companyService: CompanyService;
  let positionService: PositionService;
  let sourceService: SourceService;
  let statusService: StatusService;
  let modeService: ModeService;
  let offerService: OfferService;
  let termService: TermService;
  let alertService: AlertService;
  let activatedRoute: ActivatedRoute;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewOfferComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(
          {
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          }
        )
      ],
      providers: [
        DatePipe,
        TranslateService,
        CompanyService,
        PositionService,
        SourceService,
        StatusService,
        ModeService,
        OfferService,
        TermService,
        AlertService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot:
              {
                params: of({offerId: '0645d0de-fe0d-488c-920b-91145ac35387'})
              }
          }
        },
        {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewOfferComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    debugElement = fixture.debugElement;
    offerService = debugElement.injector.get(OfferService);
    statusService = debugElement.injector.get(StatusService);
    companyService = debugElement.injector.get(CompanyService);
    modeService = debugElement.injector.get(ModeService);
    positionService = debugElement.injector.get(PositionService);
    offerService = debugElement.injector.get(OfferService);
    sourceService = debugElement.injector.get(SourceService);
    termService = debugElement.injector.get(TermService);
    alertService = debugElement.injector.get(AlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on creation', () => {
    expect(component.newOfferForm).toBeDefined();
  });

  it('should set isErrorFound to false on creation', () => {
    expect(component.isErrorFound).toBeFalse();
  });

  it('should set isErrorFound to true when setErrorFound is called', () => {
    component.setErrorFound('test', new Error('Test error'));
    expect(component.isErrorFound).toBeTrue();
  });

  it('should call postOffer when saveOffer is called', () => {
    spyOn(offerService, 'postOffer').and.returnValue(of({id: 'fff34d8a-70ed-46dc-8444-1968b8ef3483'}));
    spyOn(companyService, 'getCompanies').and.returnValue(of(UNIT_TEST_MOCK_GET_COMPANY_RESPONSE));
    spyOn(modeService, 'getModes').and.returnValue(of(UNIT_TEST_MOCK_GET_MODE_RESPONSE));
    spyOn(positionService, 'getPositions').and.returnValue(of(UNIT_TEST_MOCK_GET_POSITION_RESPONSE));
    spyOn(sourceService, 'getSources').and.returnValue(of(UNIT_TEST_MOCK_GET_SOURCE_RESPONSE));
    spyOn(statusService, 'getStatus').and.returnValue(of(UNIT_TEST_MOCK_GET_STATUS_RESPONSE));
    spyOn(termService, 'getTerm').and.returnValue(of(UNIT_TEST_MOCK_GET_TERM_RESPONSE));

    component.ngOnInit();
    component.newOfferForm.controls['company'].setValue('fff34d8a-70ed-46dc-8444-1968b8ef3483');
    component.newOfferForm.controls['position'].setValue('fff34d8a-70ed-46dc-8444-1968b8ef3483');
    component.newOfferForm.controls['source'].setValue('fff34d8a-70ed-46dc-8444-1968b8ef3483');
    component.newOfferForm.controls['term'].setValue('fff34d8a-70ed-46dc-8444-1968b8ef3483');
    component.newOfferForm.controls['mode'].setValue('fff34d8a-70ed-46dc-8444-1968b8ef3483');
    component.newOfferForm.controls['status'].setValue('fff34d8a-70ed-46dc-8444-1968b8ef3483');
    component.newOfferForm.controls['createdDate'].setValue('2021-12-12 12:01:03');
    component.newOfferForm.controls['mountRate'].setValue('1000');



    component.saveOffer();
    expect(offerService.postOffer).toHaveBeenCalled();
  });
});
