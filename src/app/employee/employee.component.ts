import {Component, Input, OnInit} from '@angular/core';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';

import {forkJoin, of} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  constructor(private employeeService: EmployeeService) {
    this.totalCountOfDirectReports = 0;
  }

  @Input() employee: Employee;
  totalCountOfDirectReports: number;

  processDirectReports(employee: Employee) {
    return employee.directReports && employee.directReports.length > 0 ?
      forkJoin(
        employee.directReports.map(directReportEmployeeId => this.getDirectReports(directReportEmployeeId))
      )
      : of([]);
  }

  getDirectReports(directReportEmployeeId: number) {
    return this.employeeService.get(directReportEmployeeId).pipe(
      flatMap((employee: Employee) => this.processDirectReports(employee)),
      map((employees: Employee[]) => this.totalCountOfDirectReports++),
     );
  };

  ngOnInit(): void {
    this.processDirectReports(this.employee).subscribe();
  }
}
