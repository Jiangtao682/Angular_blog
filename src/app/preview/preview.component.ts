import { Component, OnInit } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import {BlogService, Post} from '../blog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  post: Post;
  username: string;
  titleHtml: string;
  bodyHtml: string;
  reader = new Parser();
  writer = new HtmlRenderer();

  constructor(
    private blogService: BlogService,
    public router: ActivatedRoute
  ) {
    this.username = this.blogService.username;
    this.router.params.subscribe(params => {
      const promise1 = this.blogService.getPost(this.username, params.id);
      promise1.then(post => {
        this.post = post;
        console.log('preview get a post: ', post);
        this.titleHtml = this.writer.render(this.reader.parse(this.post.title));
        this.bodyHtml = this.writer.render(this.reader.parse(this.post.body));
      });
    });
  }

  ngOnInit(): void { }

}
