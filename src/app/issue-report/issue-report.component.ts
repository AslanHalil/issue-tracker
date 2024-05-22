import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IssuesService} from "../issues.service";
import {Issue} from "../issue";
import {FormControl, FormGroup, Validators} from "@angular/forms";

interface IssueForm {
  title: FormControl<string>;
  description: FormControl<string>;
  priority: FormControl<string>;
  type: FormControl<string>;
}

@Component({
  selector: 'app-issue-report',
  templateUrl: './issue-report.component.html',
  styleUrls: ['./issue-report.component.css']
})
export class IssueReportComponent implements OnInit {

  @Output() formClose = new EventEmitter();
  suggestions: Issue[]= [];

  issueForm = new FormGroup<IssueForm>({
    title: new FormControl('', {nonNullable: true, validators: Validators.required}),
    description: new FormControl('', {nonNullable: true}),
    priority: new FormControl('', {nonNullable: true, validators: Validators.required}),
    type: new FormControl('', {nonNullable: true, validators: Validators.required})
  });

  constructor(private issueService: IssuesService) {
  }

  ngOnInit() {
    this.issueForm.controls.title.valueChanges.subscribe(title => {
      this.suggestions = this.issueService.getSuggestions(title);
    })
  }

  addIssue() {
    if (this.issueForm && this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }
    this.issueService.createIssue(this.issueForm.getRawValue() as
      Issue);
    this.formClose.emit();
  }
}
