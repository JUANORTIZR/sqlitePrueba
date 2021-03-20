import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';

export class Person {
  name: string;
  firstName: string;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private storag: SQLiteObject;
  persons: Person[] = [];
  constructor(private sqlite: SQLite, private platform: Platform) {
    this.OpenDataBase();
  }

  OpenDataBase() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          db.executeSql('create table if not exists Persons(name VARCHAR(32), firstName VARCHAR(32))', [])
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log(e));

            this.storag = db
            this.getPersons(this.storag);
        })
        .catch(e => console.log(e));
        
    })
  }

  updatePublicacion(person: Person){
    let data = [person];
    this.storag.executeSql(`UPDATE Persons SET person.firsName=?, person.name=? WHERE person.firstName=${person.firstName}`, data);
    this.getPersons(this.storag);
    return of(person);
  }



  insertPerson(person: Person) {
    let data = [person.name, person.firstName];
    this.storag.executeSql('INSERT INTO Persons(name,firstName) VALUES(?,?)', data)
    .then(e => console.log("INSERT EXISTOSO: "+ e))
    .catch(e => console.log(JSON.stringify(e)));
    this.getPersons(this.storag);
    return of(person);
  }


  getPersons(sqlObject:SQLiteObject) {
    this.persons = [];
    sqlObject.executeSql('SELECT * FROM Persons', []).then(r => {
      console.log(r.rows.length);
      if (r.rows.length > 0) {
        for (var i = 0; i < r.rows.length; i++) {
          var person = {
            name: r.rows.item(i).name,
            firstName: r.rows.item(i).firstName
          }
         
          this.persons.push(person);
        }
      }
    });
    return this.persons;
  }
}
