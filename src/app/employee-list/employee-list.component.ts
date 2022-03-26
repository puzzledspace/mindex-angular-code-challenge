import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {catchError, map, reduce} from 'rxjs/operators';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';
import {DirectReportEditingDialogComponent} from '../direct-report-editing-dialog/direct-report-editing-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {
  }

  promptToEditDirectReport(employeeId: number) {
    console.log(`Editing direct report: ${employeeId}`);
    const dialogRef = this.dialog.open(DirectReportEditingDialogComponent, {
      data: {action: 'edit', employeeId: employeeId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result !== undefined) {
        console.log(`Saving update to compensation for ${employeeId}: ${result}`);
      }
    });
  }

  promptToDeleteDirectReport({directReportEmployeeId, employeeId}) {
    console.log(`Seeking confirmation before deleting direct report: ${directReportEmployeeId} from ${employeeId}`);
    const dialogRef = this.dialog.open(DirectReportEditingDialogComponent, {
      data: {action: 'delete', directReportEmployeeId: directReportEmployeeId, employeeId: employeeId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result !== undefined) {
        console.log(`Deleting ${directReportEmployeeId} from list of direct reports for ${employeeId}`);
      }
    });
  }

  ngOnInit(): void {
    this.employeeService.getAll()
      .pipe(
        reduce((emps, e: Employee) => emps.concat(e), []),
        map(emps => this.employees = emps),
        catchError(this.handleError.bind(this))
      ).subscribe();
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }
}
