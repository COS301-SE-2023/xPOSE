// posts.page.ts
import { Component } from '@angular/core';
import { GalleryDataService } from './gallery-lightbox/gallery-data.service';

interface Item {
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage {
  data: Item[] = [
    { imageSrc: '../assets/images/download.jpg', imageAlt: '1' },
    { imageSrc: '../assets/images/qrcode.png', imageAlt: '2' },
    { imageSrc: '../assets/images/images.jpg', imageAlt: '3' },
    { imageSrc: '../assets/images/qrcode.png', imageAlt: '4' },
    { imageSrc: '../assets/images/image2.webp', imageAlt: '5' },
    { imageSrc: '../assets/images/image1.webp', imageAlt: '6' },{ imageSrc: '../assets/images/download.jpg', imageAlt: '1' },
    { imageSrc: '../assets/images/youth.jpg', imageAlt: '7' },
    { imageSrc: '../assets/images/images.jpg', imageAlt: '8' },
    { imageSrc: '../assets/images/youth.png', imageAlt: '9' },
    { imageSrc: '../assets/images/qrcode.png', imageAlt: '10' },
    { imageSrc: '../assets/images/image2.webp', imageAlt: '11' },
    
    // Add more items as needed...
  ];
  router: any;

  constructor(private galleryDataService: GalleryDataService) {
    this.galleryDataService.setData(this.data);
  }
  // Other component logic goes here.
  search() {
		this.router.navigateByUrl('/search');
	}
	viewEvent() {
		this.router.navigate(['/event']);
	}
	eventDetails(event_id: string) {
		this.router.navigate(['/view-event', event_id]);
	}
	onEvent(){
		this.router.navigate(['/create-event']);
	}
	onNotifications(){
		this.router.navigate(['/notification']);
	}
	onProfile(){
		this.router.navigate(['/profile']);
	}  
	onJoinedEvent(){
		this.router.navigate(['/joined-event']);
	}
	onHome(){
		this.router.navigate(['/home']);
	}
}
