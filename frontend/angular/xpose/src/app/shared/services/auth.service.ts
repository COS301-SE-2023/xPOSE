import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../services/user";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { map } from "rxjs";
import { Observable } from "rxjs";
import { Location } from "@angular/common";
import { environment } from "src/environments/environment";
// import User from '../data-access/models/user.table.js';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  userData: any;
  isLoggedIn: boolean = false;
  apiUrl: string;

  constructor(
      public afs: AngularFirestore,  // inject firestore
      public afAuth: AngularFireAuth, // inject firebase Auth services
      public router: Router,
      public ngZone: NgZone, // remove outside scope warning
      private http: HttpClient, // inject HttpClient for making HTTP requests
      private location: Location
  ) {

    this.isLoggedIn = localStorage.getItem('user') === 'true';
    this.apiUrl = environment.apiUrl;
  }

  // sign in with email/password
  signIn(email: string, password: string): Promise<void> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            // console.log("User has been logged in successfuly");
            this.isLoggedIn = true;
            localStorage.setItem('user', 'true');
            this.router.navigate(['/home']);
          }
        });
        
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Sign up with email/password
  async signUp(email: string, password: string, username: string): Promise<any> {
    const signUpData = {
      displayName: username,
      uniq_username:"",
      email: email,
      password: password,
      emailVerified: false,
      privacy:false,
      bio:" Default bio",
      photoURL:{},
      visibility: true
    };
   
    const requestBody = JSON.stringify(signUpData);
    
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/u/users`, requestBody, {headers})
    .toPromise()
    .then((response) => {
      console.log("signed up successfully",response);
    })
    .catch((error) => {
      // Handle error response here
      window.alert(error.message);
      console.log("Error:", error);
      // console.log("Response body:", error.error);
      return Promise.reject(error);
    });
  }

  // Send email verification when a new user signs up
  sendVerificationMail(): Promise<void> {
    return this.afAuth.currentUser
        .then((u: any) => u.sendEmailVerification())
        .then(() => {
          console.log("Email verification sent");
        });
  }

  // Reset Forgot password
  forgotPassword(passwordResetEmail: string): Promise<void> {
    return this.afAuth
        .sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
          window.alert('Password reset email sent, check your inbox.');
        })
        .catch((error) => {
          window.alert(error);
        });
  }

  // Sign in with Google
  signInWithGoogle(): Promise<void> {
    return this.authLogin(new GoogleAuthProvider()).then((res: any) => {
      this.isLoggedIn = true;
      this.router.navigate(['/home']);
    });
  }

  // Sign in with Facebook
  signInWithFacebook(): Promise<void> {
    return this.authLogin(new FacebookAuthProvider()).then((res: any) => {
      this.router.navigate(['/home']);
    });
  }

  // Authentication login to run auth providers
  authLogin(provider: any): Promise<void> {
    return this.afAuth
        .signInWithPopup(provider)
        .then((result) => {
          this.setUserData(result.user);

          this.isLoggedIn = true;
          localStorage.setItem('user', 'true');

        })
        .catch((error) => {
          window.alert(error);
        });
  }

  setUserData(user: any): Promise<void> {
        // generate unique username
      const alph = this.generateRandomAlphanumeric(6);  
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Users/${user.uid}`);
      const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      uniq_username: `${user.displayName}${alph}`,
      visibility: true
    };
    // add userId to sql table
    
    return userRef.set(userData, { merge: true });
  }

   generateRandomAlphanumeric(length: number) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  };

  getCurrentUserId(): Observable<string> {
		return this.afAuth.authState.pipe(
		  map((user) => {
			if (user) {
			  return user.uid;
			} else {
				// throw error
				// some extra stuff
			  console.log('No user is currently logged in.');
			  return '';
			}
		  })
		);
	}

  // Sign out
  signOut(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      this.isLoggedIn = false;
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }
}