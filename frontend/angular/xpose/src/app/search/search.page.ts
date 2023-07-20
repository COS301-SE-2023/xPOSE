// search.page.ts
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSearchbar, NavController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage {
  items = [
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' },
    // Add more items as needed
  ];

  filteredItems = this.items;
  searchQuery = '';

  @ViewChild('searchBar', { static: false }) searchBar: IonSearchbar | undefined;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  ionViewDidEnter() {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['query'] || '';
      this.onSearch();
    });
  }

  onSearch() {
    const searchQuery = this.searchQuery.toLowerCase();

    if (!searchQuery) {
      this.filteredItems = this.items;
      return;
    }

    this.filteredItems = this.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );
  }

  closeSearchBar() {
    if (this.searchBar) {
      this.searchBar.value = '';
      this.searchBar.getInputElement().then((input: HTMLInputElement) => {
        input.blur();
      });
    }
  }

  closeSearchPage() {
    this.closeSearchBar();
    this.navCtrl.pop();
  }
}
