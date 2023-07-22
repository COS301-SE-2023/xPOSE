import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  items: any[] = [
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' },
    // Add more items as needed
  ];

  suggestedItems: any[] = []; // Suggested data
  searchQuery: string = '';
  filteredItems: any[] = [];
  showSuggestions: boolean = true; // Show suggested data initially

  constructor() {}

  ngOnInit() {
    // Initialize the filteredItems with all items on page load
    this.filteredItems = this.items;
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
      this.showSuggestions = false; // Hide suggested data when user starts searching
      // Filter the items based on the searchQuery
      this.filteredItems = this.items.filter(item =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.showSuggestions = true; // Show suggested data when search query is empty
      this.filteredItems = this.items; // Reset filtered items to show all items
    }
  }

  closeSearchPage() {
    // Implement the function to close the search page if needed
  }
}
