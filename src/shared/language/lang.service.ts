import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  selected = '';

  constructor(private translateService: TranslateService,
    private storage: Storage,) { }

  setDefaultLanguage() {
    let language = this.translateService.getBrowserLang();
    this.translateService.setDefaultLang(language);

    this.storage.get(LNG_KEY).then(val => {
      if (val) {
        this.setLanguage(val);
        this.selected = val;
      }
    });
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en' },
      { text: 'Español', value: 'es' },
      { text: 'Русский', value: 'ru' },

    ]
  }

  setLanguage(lng) {
    this.translateService.use(lng);
    this.selected = lng;
    this.storage.set(LNG_KEY, lng);
  }
}
