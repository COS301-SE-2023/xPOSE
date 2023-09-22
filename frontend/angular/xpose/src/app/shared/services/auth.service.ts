import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../services/user";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument, } from "@angular/fire/compat/firestore";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { map } from "rxjs";
import { Observable } from "rxjs";
import { Location } from "@angular/common";
import { environment } from "src/environments/environment";
import { LoadingController } from "@ionic/angular";


// import User from '../data-access/models/user.table.js';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  userData: any;
  isLoggedIn: boolean = false;
  apiUrl: string;
  loading!: HTMLIonLoadingElement;

  constructor(
      public afs: AngularFirestore,  // inject firestore
      public afAuth: AngularFireAuth, // inject firebase Auth services
      public router: Router,
      public ngZone: NgZone, // remove outside scope warning
      private http: HttpClient, // inject HttpClient for making HTTP requests
      private location: Location,
      private loadingController: LoadingController
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
  async signInWithGoogle(): Promise<void> {
    try{
      
      const res =  await this.authLogin(new GoogleAuthProvider());
      if(typeof res === 'undefined' || !res){
        throw new Error("Authentication result is undefined");
      }
      console.log("Redirect to home!!!");
      await this.loading.dismiss();
      this.router.navigate(['/home']);

    } catch(error){
      console.log("error in sign in with provider", error);
    }

  }

  // Sign in with Facebook
  async signInWithFacebook(): Promise<void> {
    try{
      const res =  await this.authLogin(new FacebookAuthProvider());
      if(typeof res === 'undefined' || !res){
        throw new Error("Authentication result is undefined");
      }
      console.log("Redirect to home!!!");
      this.router.navigate(['/home']);

    } catch(error){
      console.log("error in sign in with provider", error);
    }
  }


 /*async facebooktAuthLogin(provider: any) {

  try{
    const auth = getAuth();
    console.log("Check auth",auth);
    const res =  await   signInWithPopup(auth, provider);
    this.isLoggedIn = true;
    localStorage.setItem('user', 'true');
    const credential = FacebookAuthProvider.credentialFromResult(res);
    const accessTOken = credential?.accessToken;
    const response = await this.sendUserDataToServer(res.user);
    return response;
  } catch(error){

    console.log("Error in facebook login", error);
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // // The email of the user's account used.
    // const email = error.customData.email;
    // // The AuthCredential type that was used.
    // const credential = FacebookAuthProvider.credentialFromError(error);
  }

  /*const auth = getAuth();
  signInWithPopup(auth, provider)
  .then((result) => {
    // The signed -in user info.
    const user = result.user;

    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessTOken = credential?.accessToken;
  })
  .catch((error) => {
     // Handle Errors here.
     const errorCode = error.code;
     const errorMessage = error.message;
     // The email of the user's account used.
     const email = error.customData.email;
     // The AuthCredential type that was used.
     const credential = FacebookAuthProvider.credentialFromError(error);
  })
 }*/

  // Authentication login to run auth providers
 async authLogin(provider: any): Promise<void> {

  /*try {
    this.loading = await this.loadingController.create({
      message: "Please wait...",
    });

    await this.loading.present();
    await this.authService.signInWithGoogle();
    await this.loading.dismiss();
  } catch(error){
    console.log("Something went wrong");
  }*/
  try {
    const result = await this.afAuth.signInWithPopup(provider)
    this.isLoggedIn = true;
    localStorage.setItem('user', 'true');

    this.loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await this.loading.present();
    // Authentication is usccessful send data to server
    const response = await this.sendUserDataToServer(result.user);
    return response;
    
  } catch(error){
    window.alert("Error signing up with provider");
    console.log(error);
  }
}


  async sendUserDataToServer(user:any) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      visibility: "public"
    }
    const response = await this.executeQuery(userData);
    return response;
  }

  
  async executeQuery(userData: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const requestBody = JSON.stringify(userData);
    // console.log("Request body in execute",userData );
    try{
      const response =  await this.http.patch<any>(`${this.apiUrl}/u/users/${userData.uid}/signInWithProvider`, requestBody, {headers}).toPromise();
      console.log("Response", response);
      return response;
    } catch(error){
      console.log("provider error", error);
    }
   
}

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