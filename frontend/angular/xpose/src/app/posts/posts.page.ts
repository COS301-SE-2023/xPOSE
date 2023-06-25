import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage {
  posts: any[] = []; // Replace with your actual posts data

  slideOptions = {
    initialSlide: 0,
    speed: 400,
  };

  constructor(private navCtrl: NavController) {
    // Initialize your posts data or fetch it from an API
    this.posts = [
      {
        images: ['post1.jpg', 'post2.jpg', 'post3.jpg', 'post4.jpg', 'post5.jpg'],
        likes: 10,
      },
    
    ];
  }
  openImage(imageUrl: string) {
    // Implement your logic to open the image or navigate to a new page
    console.log('Image clicked:', imageUrl);
  }
  openPost(post: any) {
    // Implement your logic to handle opening the post
    console.log('Post clicked:', post);
  }
}
