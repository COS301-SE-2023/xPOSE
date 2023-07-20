import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-search",
  templateUrl: "search.page.html",
  styleUrls: ["search.page.scss"]
})
export class SearchPage {
  searchQuery: string = "";

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  applySearch() {
    this.modalController.dismiss({ searchQuery: this.searchQuery });
  }
}
