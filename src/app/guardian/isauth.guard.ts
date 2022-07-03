import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class IsauthGuard implements CanActivate {
  constructor(private firebase: AngularFireAuth, private router : Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      var logged = true;
        this.firebase.authState.subscribe(auth =>{
          if(!auth){
            this.router.navigate(['/']);
            logged = false;
          }else{
            logged = true;
          }
        })
    return logged;
  }
  
}
