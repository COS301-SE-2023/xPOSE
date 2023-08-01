import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-image',
  templateUrl: './search-image.page.html',
  styleUrls: ['./search-image.page.scss'],
})
export class SearchImagePage implements OnInit {


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

  constructor(private router: Router,
    private http: HttpClient,
    private api: ApiService
  ){}

  ngOnInit() {
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
            this.user =response
            this.loading = false;
            this.searchClicked = false;
            
            this.user = response;
            this.search_result = "Search results:";
            
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
  }

  closeSearchPage() {
    // Implement the function to close the search page if needed
    this.router.navigate(['/home']);
  }

  viewUser(userItem: any){
    this.router.navigate(['/user-profile', userItem.uid]);
  }

  viewEvent(eventItem: any){
    this.router.navigate(['/view-event', eventItem.code]);
  }

}
