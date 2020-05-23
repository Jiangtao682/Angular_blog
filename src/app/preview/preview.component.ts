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
  titleHtml: string;
  bodyHtml: string;
  reader = new Parser();
  writer = new HtmlRenderer();

  constructor(
    private blogService: BlogService,
    public router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.post = this.blogService.getCurrentDraft();
    console.log('preview get a post: ', this.post);
    this.bodyHtml = this.writer.render(this.reader.parse(this.post.body));
    this.titleHtml = this.writer.render(this.reader.parse(this.post.title));
  }
}
