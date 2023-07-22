import { Component, OnInit } from '@angular/core';

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
  users: any[] = [
    { name: 'User 1' },
    { name: 'User 2' },
    { name: 'User 3' },
    // Add more users as needed
  ];
  suggestedItems: any[] = [];
  searchQuery: string = '';
  filteredItems: any[] = [];
  showSuggestions: boolean = true;

  constructor() {}

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
      this.showSuggestions = false;
      if (this.searchType === 'events') {
        // Filter the events based on the searchQuery
        this.filteredItems = this.events.filter(event =>
          event.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else if (this.searchType === 'users') {
        // Filter the users based on the searchQuery
        this.filteredItems = this.users.filter(user =>
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
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
  }
}
