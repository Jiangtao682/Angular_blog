import { Component, OnInit } from '@angular/core';
import {BlogService, Post} from '../blog.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EditComponent} from '../edit/edit.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  posts: Post[];
  post: Post;
  username: string;

  constructor(
    private blogService: BlogService,
    public router: Router,
    public activeRouter: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.username = this.blogService.username;
    console.log('list ngOnInit executed');
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.username = this.blogService.username;
    const promise1 = this.blogService.fetchPosts(this.username);
    promise1.then(posts => {
      this.posts = posts;
      // this.post and posts works similarly as pointer that point to a object,
      // so change either of them will change the original object.
    });
  }

  newPost(){
    const promise1 = this.blogService.newPost(this.username, null);
    promise1.then(() => {
      console.log('Created a new post!');
      this.blogService.setCurrentDraft(this.posts[this.posts.length - 1]);
      this.router.navigate(['/edit/' + this.posts[this.posts.length - 1].postid]);
    }).catch(error => {
      console.error(error);
    });
  }

  setCurrentDraft(post){
    this.blogService.setCurrentDraft(post);
  }
}
