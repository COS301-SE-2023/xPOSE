import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  // Define the search types (tabs)
  searchType: 'events' | 'users' = 'events';
  events: any[] = [
    { name: 'Event 1' },
    { name: 'Event 2' },
    { name: 'Event 3' },
    // Add more events as needed
  ];

  user: any  = {} // store user query result
  loading: boolean = true; // Initial loading state
  
  suggestedItems: any[] = [];
  searchQuery: string = '';
  filteredItems: any[] = [];
  showSuggestions: boolean = true;
  searchIconClicked: boolean = false;

  constructor(private router: Router,
    private http: HttpClient
    ) {}

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
      // this.showSuggestions = false;
      if (this.searchType === 'events') {

      } else if (this.searchType === 'users') {
        console.log("Searched for " + this.searchQuery);
        // http://localhost:8002/users/search?field=displayName&value=sov
        const search_endpoint = `http://localhost:8000/u/users/search?field=displayName&value=${this.searchQuery}`;
         this.loading = true;
        this.http.get<any[]>(search_endpoint).subscribe(
          (response) => {
            this.user =response
            this.loading = false;
          }
        )



        // // Filter the users based on the searchQuery
        // this.filteredItems = this.users.filter(user =>
        //   user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        // );
      }
    } else {
      this.showSuggestions = true;
      this.filteredItems = [];
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
}
