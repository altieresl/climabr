import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { IonicStorageModule, Storage } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SearchCityService } from 'src/domain/services/search-city.service';
import { LoadWeatherService } from 'src/domain/services/load-weather.service';
import { LocalCityRepository } from 'src/data/local-city-repository';
import { ApiWeatherRepository } from 'src/data/api-weather-repository';
import { SearchHistoryService } from 'src/domain/services/search-history.service';

const initSearchHistoryService = () => {
  return new SearchHistoryService(new LocalCityRepository(), new Storage());
};

const createSearchCityService = () => {
  return new SearchCityService(new LocalCityRepository());
};

const createLoadWeatherService = (http: HttpClient) => {
  return new LoadWeatherService(
    new LocalCityRepository(),
    new ApiWeatherRepository(http)
  );
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: SearchCityService,
      useFactory: createSearchCityService,
    },
    {
      provide: LoadWeatherService,
      useFactory: createLoadWeatherService,
      deps: [HttpClient],
    },
    {
      provide: SearchHistoryService,
      useFactory: initSearchHistoryService,
      deps: [Storage],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
