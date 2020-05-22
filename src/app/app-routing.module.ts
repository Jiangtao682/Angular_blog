import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestComponent} from './test/test.component';
import {ListComponent} from './list/list.component';
import {EditComponent} from './edit/edit.component';
import {PreviewComponent} from './preview/preview.component';


const routes: Routes = [
  {path: 'test', component:  TestComponent},
  // {path: 'list', component: ListComponent},
  {path: 'edit/:id', component: EditComponent},
  {path: 'preview/:id', component: PreviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
