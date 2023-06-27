// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-post-details',
//   templateUrl: './post-details.page.html',
//   styleUrls: ['./post-details.page.scss'],
// })
// export class PostDetailsPage implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {
  selectedPost: any; // Declare the selectedPost property

  constructor(private navCtrl: NavController, private navParams: NavParams) {}

  ngOnInit() {
    // Retrieve the selected post from the navigation parameters
    this.selectedPost = this.navParams.get('posts');
  }

  goBack() {
    this.navCtrl.back();
  }
}
