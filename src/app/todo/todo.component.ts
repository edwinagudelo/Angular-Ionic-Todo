import { Component, Input, OnInit } from "@angular/core";
import { Todo } from "../services/todo.service";

@Component({
    selector: 'app-todo',
    templateUrl : './todo.component.html',
    styleUrls : ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
    @Input() todo!:Todo;
    @Input() update!: (todo:Todo) => void;
    @Input() delete!: (todo:Todo) => void;

    ngOnInit(): void {
        
    }

}