import { CityRepository } from './protocols/city-repository';
import { Storage } from '@ionic/storage-angular';
import { City } from '../entities/city';

const STORAGE_NAME = 'searchHistory';

export class SearchHistoryService {
  constructor(
    private readonly cityRepo: CityRepository,
    private storage: Storage
  ) {}

  /*
  Verify if a storage named STORAGE_NAME exists, if doesn't, creates a new  storage
  */
  async initSearchHistory(): Promise<City[]> {
    await this.storage.create();
    const searchHistory = await this.storage.get(STORAGE_NAME);
    if (searchHistory !== null) {
        return await this.storage.get(STORAGE_NAME);
    }
    return await this.clearSearchHistory();
  }

  /*
  Get city object by id and verify if this city already is on history, if already is, remove, if isn't, nothing happens, then add the city to history
  */
  async addSearchHistory(id: number): Promise<City[]> {
    const newCity = await this.cityRepo.getById(id);
    let history = await this.storage.get(STORAGE_NAME);

    history = history.filter((entry, index, arr) => entry.id !== id);

    history.unshift(newCity);
    return await this.storage.set(STORAGE_NAME, history);
  }

  /*
  Clear the search history by initializing the history array as empty
  */
  async clearSearchHistory(): Promise<City[]> {
    await this.storage.set(STORAGE_NAME, []);
    return await this.storage.get(STORAGE_NAME);
  }
}
