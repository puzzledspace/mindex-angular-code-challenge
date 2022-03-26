import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { of } from 'rxjs';
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
  employeeWithDirectReports: Employee;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {
  }

  getAllEmployees() {
    return this.employeeService.getAll()
      .pipe(
        reduce((emps, e: Employee) => emps.concat(e), []),
        map(emps => this.employees = emps),
        catchError(this.handleError.bind(this))
      );
  }

  deleteFromDirectReports(employee: Employee, employeeIdToDelete: number) {
    const updatedListOfDirectReports = employee?.directReports.filter(directReport => directReport !== employeeIdToDelete);
    return of({...employee, directReports: updatedListOfDirectReports});
  }

  promptToEditDirectReport(employeeId: number) {
    const dialogRef = this.dialog.open(DirectReportEditingDialogComponent, {
      data: {action: 'edit', employeeId: employeeId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result !== undefined) {
        // save the change to compensation for the employee
        this.employeeService.get(employeeId).subscribe(employee =>
          this.employeeService.save({...employee, compensation: result}).subscribe(e =>
            this.getAllEmployees().subscribe()
        ));
      }
    });
  }

  promptToDeleteDirectReport({directReportEmployeeId, employeeId}) {
    const dialogRef = this.dialog.open(DirectReportEditingDialogComponent, {
      data: {action: 'delete', directReportEmployeeId: directReportEmployeeId, employeeId: employeeId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result !== undefined) {
        // delete the direct report from employee and update the employees list
        this.employeeService.get(employeeId).subscribe(employee =>
          this.deleteFromDirectReports(employee, directReportEmployeeId).subscribe(
            employeeWithUpdatedDirectReports => this.employeeService.save(employeeWithUpdatedDirectReports).subscribe(e => this.getAllEmployees().subscribe())
        ));
      }
    });
  }

  ngOnInit(): void {
    this.getAllEmployees().subscribe();
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }
}
