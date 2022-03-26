import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialogModule} from '@angular/material/dialog';

import { DirectReportEditingDialogComponent } from './direct-report-editing-dialog.component';
import {EmployeeService} from '../employee.service';

const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getAll', 'get', 'save', 'remove']);

describe('DirectReportEditingDialogComponent', () => {
  let component: DirectReportEditingDialogComponent;
  let fixture: ComponentFixture<DirectReportEditingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectReportEditingDialogComponent ],
      imports: [
        MatDialogModule
      ],
      providers: [
        {provide: EmployeeService, useValue: employeeServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectReportEditingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
