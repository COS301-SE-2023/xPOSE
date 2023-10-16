import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../service/api.service';
import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  // Define the search types (tabs)

  searchType: 'events' | 'users' = 'events';
  events: any[] = [];

  user: any =[];  // store user query result
  loading: boolean = true; // Initial loading state
  search_result = "";
  found = true;

  suggestedItems: any[] = [];
  searchQuery: string = '';
  filteredItems: any[] = [];
  showSuggestions: boolean = true;
  searchClicked: boolean = false;
  currentUserId: string = "";

  constructor(private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private authService: AuthService
    ) {}

  ngOnInit() {
        this.authService.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        this.currentUserId = uid;
        console.log("Testing viewing profile:::", this.currentUserId);
      }
      else {
        console.log("user id not found at all");
      }
    });

    // get id of user searching


    // Initialize the filteredItems with all events on page load
    this.filteredItems = this.events;
    // Initialize suggestedItems with some suggested data
    this.suggestedItems = [
      { name: 'Suggested Item 1' },
      { name: 'Suggested Item 2' },
      { name: 'Suggested Item 3' },
      // Add more suggested items as needed
    ];
  }

  onSearch() {
    if (this.searchQuery.trim() !== '') {
      this.searchClicked = true;
      this.found = true;

      if (this.searchType === 'events') {
        const search_endpoint = `${this.api.apiUrl}/e/search?q=${this.searchQuery}`;
        this.loading = true;

        this.http.get<any[]>(search_endpoint).subscribe(
          (response) => {
            this.loading = false;
            this.searchClicked = false;
            this.events = response;
            this.search_result = "Search results:";
            console.log(this.events);
          },
          (error:any) => {
            console.log(error.error.message);
            this.found = false;
            this.searchClicked = false;
          });
      } else if (this.searchType === 'users') {

        const search_endpoint = `${this.api.apiUrl}/u/users/search?field=uniq_username&value=${this.searchQuery}`;
         this.loading = true;

        this.http.get<any[]>(search_endpoint).subscribe(
          (response) => {
            this.user = response
            this.loading = false;
            this.searchClicked = false;
            
            this.user = response;
            this.search_result = " Search history results:";
            
          },
          (error:any) => {
            console.log(error.error.message);
            this.found = false;
            this.searchClicked = false;
            
          }
        )
      }
    } 
  }

  onSearchTypeChange() {
    // Clear the search query and show suggestions when search type changes
    this.searchQuery = '';
    this.showSuggestions = true;
    this.user = [];
    this.events = [];
    // this.search_result = '';
  }

  closeSearchPage() {
    // Implement the function to close the search page if needed
    this.router.navigate(['/home']);
  }

  viewUser(userItem: any){
    console.log("Testing viewed profile:::", userItem);
    this.router.navigate(['/user-profile', userItem.uid, this.currentUserId]);
  }

  viewEvent(eventItem: any){
    this.router.navigate(['/view-event', eventItem.code]);
  }
}
