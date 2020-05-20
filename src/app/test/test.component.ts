import { Component, OnInit } from '@angular/core';
import {BlogService, Post} from '../blog.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  posts: Post[];

  constructor(
    private blogService: BlogService
  ) { }

  ngOnInit() {
    const promise1 = this.blogService.fetch2('user2');
    promise1.then(() => {
        this.posts = this.blogService.posts;
        console.log('function run');
      });
  }

}
