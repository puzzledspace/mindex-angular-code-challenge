import {Component, Optional, Inject, OnInit} from '@angular/core';
import {MatDialogRef,  MAT_DIALOG_DATA} from '@angular/material/dialog';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';

@Component({
  selector: 'app-direct-report-editing-dialog',
  templateUrl: './direct-report-editing-dialog.component.html',
  styleUrls: ['./direct-report-editing-dialog.component.css']
})
export class DirectReportEditingDialogComponent implements OnInit {
  employee: Employee;
  compensation: number;

  constructor(
    private employeeService: EmployeeService,
    @Optional() public dialogRef: MatDialogRef<DirectReportEditingDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data && this.data.action === 'edit') {
      this.employeeService.get(this.data.employeeId).subscribe(employee => {
        this.employee = employee;
        this.compensation = employee.compensation || 0;
      });
    } else if(this.data && this.data.action === 'delete') {
      this.employeeService.get(this.data.directReportEmployeeId).subscribe(employee => {
        this.employee = employee;
      });
    }
  }
}
