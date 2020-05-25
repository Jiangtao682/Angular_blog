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
  id: number;
  username: string;
  titleHtml: string;
  bodyHtml: string;
  reader = new Parser();
  writer = new HtmlRenderer();

  constructor(
    private blogService: BlogService,
    public router: ActivatedRoute
  ) {
    this.router.paramMap.subscribe(() => this.getCurrentDraft());
  }

  ngOnInit(): void { }

  getPost(): void {
    this.username = this.blogService.username;
    this.id = parseInt(this.router.snapshot.paramMap.get('id'), 10);
    const promise1 = this.blogService.getPost(this.username, this.id);
    promise1.then(post => {
      this.post = post;
      this.bodyHtml = this.writer.render(this.reader.parse(this.post.body));
      this.titleHtml = this.writer.render(this.reader.parse(this.post.title));
    });
  }

  getCurrentDraft(){
    this.post = this.blogService.getCurrentDraft();
    this.id = parseInt(this.router.snapshot.paramMap.get('id'), 10);
    if (this.post == null || this.post.postid !== this.id){
      this.getPost();
    }else{
      console.log('preview get a post: ', this.post);
      this.bodyHtml = this.writer.render(this.reader.parse(this.post.body));
      this.titleHtml = this.writer.render(this.reader.parse(this.post.title));
    }
  }
}
