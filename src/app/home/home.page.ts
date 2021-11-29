import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/domain/entities/city';
import { SearchCityService } from 'src/domain/services/search-city.service';
import { SearchHistoryService } from 'src/domain/services/search-history.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cities: City[];
  hasError: boolean = false;
  errorMessage: string;
  searchHistory: City[];

  constructor(
    private readonly searchService: SearchCityService,
    private readonly router: Router,
    private readonly searchHistoryService: SearchHistoryService
  ) {}

  async onSearch(query: string) {
    try {
      this.hasError = false;
      this.cities = await this.searchService.search(query);
    } catch (error) {
      this.hasError = true;
      this.errorMessage = error.message;
    }
  }

  async ngOnInit() {
    this.searchHistory = await this.searchHistoryService.initSearchHistory();
  }

  async onHistoryClear() {
    this.searchHistory = await this.searchHistoryService.clearSearchHistory();
  }

  async onSelectCity(cityId: string) {
    this.searchHistory = await this.searchHistoryService.addSearchHistory(parseInt(cityId));
    this.router.navigateByUrl(`/weather/${cityId}`);
  }
}
