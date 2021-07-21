import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from 'src/shared/language/lang.service';

@Component({
  selector: 'app-lang-popover',
  templateUrl: './lang-popover.page.html',
  styleUrls: ['./lang-popover.page.scss'],
})
export class LangPopoverPage implements OnInit {


  languages = [];
  selected = '';

  constructor(
    private popoverCtrl: PopoverController,
    private langSevice: LangService,
  ) { }

  ngOnInit() {
    this.languages = this.langSevice.getLanguages();
    this.selected = this.langSevice.selected;
  }

  public languageChange(lng) {
    this.langSevice.setLanguage(lng);
    this.popoverCtrl.dismiss();
    //this.translateService.use(this.language);
    //this.storage.set("myConfig", this.language);
  }

}
