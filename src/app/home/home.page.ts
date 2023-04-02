import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit, inject } from '@angular/core';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { MessageComponent } from '../message/message.component';

import { DataService, Message } from '../services/data.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo, TodoService } from '../services/todo.service';
import { throws } from 'assert';
import { TodoComponentModule } from '../todo/todo.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MessageComponent, ReactiveFormsModule, TodoComponentModule],
})
export class HomePage implements OnInit{
  todos$!: Todo[];
  validateForm!: FormGroup;
  
  private data = inject(DataService);
  private todoService = inject(TodoService);
  private fb = inject(FormBuilder)

  constructor() {}
  ngOnInit(): void {
    this.todoService.findAll().then( (res) => {
      this.todos$ = res.data;
    });
    this.validateForm = this.fb.group({
      title: [null, Validators.required]
    });
  }

  submitForm(value : {title : string, completed :false}): void {
    for(const key  in this.validateForm.controls){
      if(this.validateForm.controls.hasOwnProperty(key)){
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    value.completed = false;
    console.log("Submitted", value);
    this.todoService.create(value).then( () =>{
      this.todoService.findAll().then( (res) => {
        this.todos$ = res.data;
      });
    } );
    this.validateForm.reset();
  }

  update = (todo : Todo) => {
    const updateTodo = Object.assign({}, todo);
    updateTodo.completed = !updateTodo.completed;
    console.log('Todo Updated', todo);
    this.todoService.update(updateTodo).then( () => {
      this.todoService.findAll().then( (res) => {
        this.todos$ = res.data;
      });
    });
  }

  delete = (todo : Todo) => {
    console.log('Delete', todo);
    this.todoService.delete(todo.id).then( () => {
      this.todoService.findAll().then( (res) => {
        this.todos$ = res.data;
      });
    });
  }

  refresh(ev: any) {
    this.todoService.findAll().then( (res) => {
      this.todos$ = res.data;
      ev.detail.complete;
    });
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }
}
