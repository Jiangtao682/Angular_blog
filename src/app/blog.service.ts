import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(
    private http: HttpClient,
  ) {
  }

  private serverUrl: string = 'http://localhost:4200';
  private username: string = 'user2';
  public posts: Post[] = [];

  fetch2(username: string): Promise<Post[]>{
    return new Promise((resolve,reject) => {
      fetch(this.serverUrl + '/api/' + this.username)
        .then(response => response.json())
        .then(json => {
          console.log('sucessful fetch!');
          // console.log('result:' + json);
          for (const post of  json) {
            this.posts.push(new Post(post));
          }
          console.log('posts: ' , this.posts);
          resolve(this.posts)
        }).catch((error)=>{
        console.error('Error: ', error);
      })
    });
  }

}


export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
  constructor(p?: Post) {
    this.postid = p && p.postid || 0;
    this.created = p && new Date(p.created) || new Date();  // Date(value/Date)
    this.modified = p && new Date(p.modified) || new Date();
    this.title = p && p.title || '';
    this.body = p && p.body || '';
  }
}
