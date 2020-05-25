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
    public router: Router,
  ) {
    this.activeRouter.paramMap.subscribe(() => this.getCurrentDraft());
    // if the url is change within this app, this class would not initiate again.
    // using subscribe to monitor the changes of url make some functionalities possible.
    // Only when this component, it will re-instant as a object.
  }

  ngOnInit(): void { }

  getPost(): void {
    this.username = this.blogService.username;
    this.id = parseInt(this.activeRouter.snapshot.paramMap.get('id'), 10);
    const promise1 = this.blogService.getPost(this.username, this.id);
    promise1.then(post => {
      this.post = post;
    });
  }

  updatePost(){
    this.username = this.blogService.username;
    this.post = this.blogService.getCurrentDraft();
    const promise1 = this.blogService.updataPost(this.username, this.post);
    promise1.then(() => {
      console.log('Updated a post!');
    }).catch(error => {
      console.error(error);
    });
  }

  deletePost(){
    this.username = this.blogService.username;
    this.id = parseInt(this.activeRouter.snapshot.paramMap.get('id'), 10);
    const promise1 = this.blogService.deletePost(this.username, this.id);
    promise1.then(() => {
      console.log('Delete a post!');
      this.router.navigate(['/']);
    }).catch(error => {
      console.error(error);
    });
  }

  preview(){
    this.blogService.setCurrentDraft(this.post);
    this.router.navigate(['/preview/' + this.id]);
  }

  getCurrentDraft(){
    this.post = this.blogService.getCurrentDraft();
    this.id = parseInt(this.activeRouter.snapshot.paramMap.get('id'), 10);
    if (this.post == null || this.post.postid !== this.id){
      this.getPost();
    }else{
      console.log('Edit get current draft success!');
    }
  }


}
