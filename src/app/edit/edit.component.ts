import { Component, OnInit } from '@angular/core';
import {BlogService, Post} from '../blog.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  post: Post = new Post();
  username: string;
  id: number;

  constructor(
    private blogService: BlogService,
    public activeRouter: ActivatedRoute,
    public router: Router
  ) {
    this.activeRouter.paramMap.subscribe(() => this.ngOnInit());
  }

  ngOnInit(): void {
    this.id = parseInt(this.activeRouter.snapshot.paramMap.get('id'), 10);
    console.log(this.id);
    this.username = this.blogService.username;
    this.getPost(this.username, this.id);
  }

  getPost(username: string, id: number): void {
    const promise1 = this.blogService.getPost(username, id);
    promise1.then(post => {
      this.post = post;
    });
  }

  updatePost(){
    const promise1 = this.blogService.updataPost(this.username, this.post);
    promise1.then(() => {
      console.log('Updated a post!');
    }).catch(error => {
      console.error(error);
    });
  }

  deletePost(){
    const promise1 = this.blogService.deletePost(this.username, this.id);
    promise1.then(() => {
      console.log('Delete a post!');
    }).catch(error => {
      console.error(error);
    });
  }

  preview(){
    this.router.navigate(['/preview/' + this.id]);
  }


}
