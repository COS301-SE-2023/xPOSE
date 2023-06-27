import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage {
  posts: any[] = []; // Replace with your actual posts data
  selectedImage: string = ''; // Assign initial value of an empty string

  slideOptions = {
    initialSlide: 0,
    speed: 400,
  };

  constructor(private navCtrl: NavController) {
    // Initialize your posts data or fetch it from an API
    this.posts = [
      {
        images: ['./assets/images/download.jpg', './assets/images/download.jpg', './assets/images/download.jpg'],
        likes: 10,
      },
      // Add more posts if needed
    ];
  }

  openImageModal(imageUrl: string) {
    // Implement your logic to open the image modal or perform any other action
    console.log('Image clicked:', imageUrl);
    this.selectedImage = imageUrl;
  }

  closeImageModal() {
    // Implement your logic to close the image modal or perform any other action
    console.log('Close clicked');
    this.selectedImage = '';
  }

  openPost(post: any) {
    // Implement your logic to handle opening the post
    console.log('Post clicked:', post);
    // Example: Navigate to a post details page
    // You can replace this with your own implementation
    this.navCtrl.navigateForward('post-details', { state: { post } });
  }

  masonryOptions = {
    // Specify your masonry options here
    // For example, columnWidth, gutter, etc.
  };
}
