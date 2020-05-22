import { Component, OnInit } from '@angular/core';
import {BlogService, Post} from '../blog.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  posts: Post[];
  post: Post;
  username: string;

  constructor(
    private blogService: BlogService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.username = this.blogService.username;
    console.log('list ngOnInit executed');
    this.fetchPosts(this.username);
  }

  fetchPosts(username: string): void {
    const promise1 = this.blogService.fetchPosts(username);
    promise1.then(posts => {
      this.posts = posts;
    });
  }

  newPost(){
    const promise1 = this.blogService.newPost(this.username, null);
    promise1.then(() => {
      console.log('Created a new post!');
      this.blogService.setCurrentDraft(this.posts[-1]);
    }).catch(error => {
      console.error(error);
    });
  }

  setCurrentDraft(post){
    this.blogService.setCurrentDraft(post);
  }
}
