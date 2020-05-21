import { Component, OnInit } from '@angular/core';
import {BlogService, Post} from '../blog.service';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  posts: Post[];
  post: Post;
  updateTtestPost: Post = new Post({postid: 16, title: 'update',
    body: 'update', created: 2, modified: 3});

  constructor(
    private blogService: BlogService
  ) { }

// test for fetchPosts
  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts(): void {
    const promise1 = this.blogService.fetchPosts('user2');
    promise1.then(posts => {
      this.posts = posts;
    });
  }

// test for getPost
  getPost(): void {
    const promise1 = this.blogService.getPosts('user2', 4);
    promise1.then(post => {
      this.post = post;
    });
  }

  newPost(){
    const promise1 = this.blogService.newPost('user2', null);
    promise1.then(() => {
      console.log('Created a new post!');
    }).catch(error => {
      console.error(error);
    });
  }

  updatePost(){
    const promise1 = this.blogService.updataPost('user2', this.updateTtestPost);
    promise1.then(() => {
      console.log('Updated a post!');
    }).catch(error => {
      console.error(error);
    });
  }

  deletePost(){
    const maxPostid = Math.max(...this.posts.map((p: Post) => p.postid));
    const promise1 = this.blogService.deletePost('user2', maxPostid);
    promise1.then(() => {
      console.log('Delete a post!');
    }).catch(error => {
      console.error(error);
    });
  }
}
