import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, max} from 'rxjs/operators';
import {rejects} from 'assert';
import {error} from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(
    private http: HttpClient,
  ) {
  }

  private serverUrl: string = '';
  private username: string = 'user2';
  public posts: Post[] = [];

  fetchPosts(username: string): Promise<Post[]>{
    return new Promise<Post[]>((resolve,reject) => {
      fetch(this.serverUrl + '/api/' + username)
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
          console.error('Error:', error);
          reject(error);
      })
    });
  }

  getPosts(username:string, postid: number):Promise<Post>{
    return new Promise<Post>((resolve,reject) => {
      fetch(this.serverUrl + '/api/' + username + '/' + postid)
        .then(response => response.json())
        .then(json=> {
          console.log('sucessful fetchPost!');
          let post:Post = new Post(json);
          resolve(post);
        }).catch((error) => {
          console.log('Error: ', error);
          reject(error);
      })
    })
  }

  newPost(username: string, post: Post): Promise<void>{
    const new_post =  new Post();
    const maxId : number = Math.max(...this.posts.map((p: Post) => p.postid));
    const new_postId = maxId + 1;
    new_post.postid = new_postId;
    this.posts.push(new_post);
    return new Promise<void>((resolve, reject) => {
      fetch(this.serverUrl + '/api/' + username + '/' + new_postId, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: "", body: ""})
      })
        .then(response => {
          if(response.status == 201){//sucess!
            resolve();
          }else{
            this.posts.pop();
            console.log('Fail to create a new post!')
            reject(response.status);
          }
        }).catch(error => {
          console.log('Error: ', error);
          reject(error);
      })
    })
  }

  updataPost(username:string, post:Post): Promise<void>{
    const target_index = this.posts.map((p: Post) => p.postid).indexOf(post.postid);
    if (target_index !== -1){ // find the target post
      let targetPost = this.posts[target_index];
      targetPost.body = post.body;
      targetPost.title = post.title;
      targetPost.modified = Date.now();
      return new Promise<void>((resolve,reject)=>{
        fetch(this.serverUrl + '/api/' + username + '/' + post.postid, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(post)
        })
          .then(response => {
            if(response.status == 200){// update sucess
              resolve()
            }else{
              reject(404);
            }
          })
      }).catch(error=>{
        console.error('Error: ', error);
      })
    }else{
      return null;
    }
  }

  deletePost(username: string, postid: number): Promise<void>{
    const target_index = this.posts.map((p: Post) => p.postid).indexOf(postid);
    if (target_index !== -1) { // find the target post
      return new Promise<void>((resolve, reject) => {
        fetch(this.serverUrl + '/api/' + username + '/' + postid, {
          method: 'DELETE',
          credentials: 'include',
        })
      })
    }
  }


}


export class Post {
  postid: number;
  created: number;
  modified: number;
  title: string;
  body: string;
  constructor(p?: Post) {
    this.postid = p && p.postid || 0;
    this.created = p && p.created ||  Date.now();  // Date(value/Date)
    this.modified = p && p.modified || Date.now();
    this.title = p && p.title || '';
    this.body = p && p.body || '';
  }
}
