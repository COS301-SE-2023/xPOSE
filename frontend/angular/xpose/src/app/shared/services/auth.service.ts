import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../services/user";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import {getMessaging, getToken} from "firebase/messaging";
import { environment } from "../../../environments/environment";



@Injectable({
  providedIn: "root"
})
export class AuthService {

  userData: any;
  isLoggedIn: boolean = false;
  constructor(
      public afs: AngularFirestore,  // inject firestore
      public afAuth: AngularFireAuth, // inject firebase Auth services
      public router: Router,
      public ngZone: NgZone // remove outside scope warning
  ) {
    // save user data in local storage
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userData = {
          uid: user.uid
        };
        this.userData = userData;
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(this.userData));
        console.log(JSON.parse(localStorage.getItem('user')!));
      } else {
        this.isLoggedIn = false;
        localStorage.setItem('user', 'null');
        console.log(JSON.parse(localStorage.getItem('user')!));
      }
    });
  }

  // sign in with email/password
  /*signIn(email: string, password: string): Promise<void> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            console.log("User has been logged in");
            
            this.router.navigate(['/home']);
          }
        });
        
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }*/

  // sign in with email/password
  signIn(email: string, password: string): Promise<void> {
    return this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.setUserData(result.user);

          // Obtain the current FCM token
          const messaging = getMessaging();
          getToken(messaging, { vapidKey: environment.firebase.vapidKey })
              .then((currentToken) => {
                if (currentToken) {
                  // Check if the token has changed
                  const userRef = this.afs.collection('Users').doc(result.user!.uid);
                  userRef.get().subscribe((userSnapshot) => {
                    const userData = userSnapshot.data() as any;
                    const storedToken = userData?.fcmToken;

                    if (storedToken !== currentToken) {
                      // Update the token in the database
                      userRef.set({ fcmToken: currentToken }, { merge: true })
                          .then(() => {
                            console.log('FCM token updated for user: ', result.user!.uid);
                          })
                          .catch((error) => {
                            console.log('Error updating FCM token: ', error);
                          });
                    }
                  });
                } else {
                  console.log('No registration token available. Request permission to generate one.');
                }

                this.afAuth.authState.subscribe((user) => {
                  if (user) {
                    console.log("User has been logged in");
                    this.router.navigate(['/home']);
                  }
                });
              })
              .catch((error) => {
                console.log('An error occurred while retrieving token. ', error);
              });
        })
        .catch((error) => {
          window.alert(error.message);
        });
  }



  // Sign up with email/password
  signUp(email: string, password: string, username: string): Promise<void> {

    return this.afAuth
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          if (result.user) {
            return result.user.updateProfile({ displayName: username })
                .then(() => {
                  this.setUserData(result.user);
                  console.log(email + " signed up successfully");

                  // Obtain FCM token for pushe notifications
                  const messaging = getMessaging();
                  return getToken(messaging, { vapidKey: environment.firebase.vapidKey })

                      .then((currentToken) => {
                        if (currentToken) {
                          // Save the FCM token in your database
                          const userRef = this.afs.collection('Users').doc(result.user!.uid);
                          userRef.set({ fcmToken: currentToken }, { merge: true })
                              .then(() => {
                                console.log('FCM token saved for user: ', result.user!.uid);
                              })
                              .catch((error) => {
                                console.log('Error saving FCM token: ', error);
                              });
                        } else {
                          console.log('No registration token available. Request permission to generate one.');
                        }
                      })
                      .catch((error) => {
                        console.log('An error occurred while retrieving token. ', error);
                      });
                })
                .catch((error) => {
                  window.alert(error.message);
                  // this.router.navigate(['/signup']);
                  return Promise.reject(error); // Return a rejected promise in case of error
                });
          } else {
            return Promise.reject(new Error("User object not available")); // Return a rejected promise if user object is not available
          }
        })
        .catch((error) => {
          window.alert(error.message);
          // this.router.navigate(['/signup']);
          return Promise.reject(error); // Return a rejected promise for any other error
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

  // Returns true if the user is logged in and verified
  // get isLoggedIn(): boolean {
  //   const user = JSON.parse(localStorage.getItem('user')!);
  //   return (user !== null)?true:false; //&& user.emailVerified !== false;
  // }

  // Sign in with Google
  signInWithGoogle(): Promise<void> {
    return this.authLogin(new GoogleAuthProvider()).then((res: any) => {
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
          this.router.navigate(['/home']);

        })
        .catch((error) => {
          window.alert(error);
        });
  }

  setUserData(user: any): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      friendIds: []
    };
    return userRef.set(userData, { merge: true });
  }

  // Sign out
  signOut(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }
}
