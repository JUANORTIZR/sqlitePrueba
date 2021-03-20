import { Component, OnInit } from '@angular/core';
import { DataService, Person } from '../services/data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  person: Person
  persons: Person[] = [];
  constructor(private dataService: DataService) { }
  ngOnInit() {
    this.person = new Person();
    this.consult();
  }

  save() {
    this.dataService.insertPerson(this.person).subscribe(p => {
      this.person = p
    });
    this.consult();
  }

  consult() {
    this.persons = this.dataService.persons;
  }
}
