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
  public username: string = null;
  public posts: Post[] = [];
  public draft: Post = new Post();

  constructor(
    private http: HttpClient,
  ) {
    const payload = this.parseJWT(document.cookie);
    this.username = payload.usr;
    this.fetchPosts(this.username); // this line is used to initiate posts;
  }

  fetchPosts(username: string): Promise<Post[]>{
    return new Promise<Post[]>((resolve,reject) => {
      fetch( '/api/' + username)
        .then(response => response.json())
        .then(json => {
          this.posts = [];
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

  getPost(username:string, postid: number):Promise<Post>{
    return new Promise<Post>((resolve,reject) => {
      fetch('/api/' + username + '/' + postid)
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
      fetch('/api/' + username + '/' + new_postId, {
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
    const target_index = this.posts.map((p: Post) => p.postid).indexOf(post.postid); // this line may have bug!!
    if (target_index !== -1){ // find the target post
      let targetPost = this.posts[target_index];
      targetPost.body = post.body;
      targetPost.title = post.title;
      targetPost.modified = Date.now();
      return new Promise<void>((resolve,reject)=>{
        fetch('/api/' + username + '/' + post.postid, {
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
              console.log('update success!')
            }else{
              reject(response.status);
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
        fetch('/api/' + username + '/' + postid, {
          method: 'DELETE',
          credentials: 'include',
        })
          .then(response =>{
            if (response.status == 204){ // sucess!
              this.posts.splice(target_index, 1);
              console.log('Delete success!')
              resolve();
            }else{
              reject(response.status);
              console.log('Error: Fail to Delete')
            }
          }).catch(error=>{
            console.error(error);
        })
      })
    }
  }

  setCurrentDraft(post:Post): void{
    this.draft = post;
    console.log('Set Current Draft!')
  }

  getCurrentDraft(): Post{
    if (this.draft.postid !== Number.NEGATIVE_INFINITY){
      return this.draft;
    }else{
      return null;
    }
  }

  parseJWT(token)
  {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

}


export class Post {
  postid: number;
  created: number;
  modified: number;
  title: string;
  body: string;
  constructor(p?: Post) {
    this.postid = p && p.postid || Number.NEGATIVE_INFINITY;
    this.created = p && p.created ||  Date.now();  // Date(value/Date)
    this.modified = p && p.modified || Date.now();
    this.title = p && p.title || '';
    this.body = p && p.body || '';
  }
}
