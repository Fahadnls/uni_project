import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {
  constructor(
    private translate: TranslateService,
  ) { }

  getSelectedLanguage() {
    return this.translate.currentLang;
  }

  setLanguage(setLang) {
    this.translate.use(setLang);
  }
}
