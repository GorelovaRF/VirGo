import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/shared/client.service';
import { Usuario } from 'src/shared/client.model';
import { Storage } from "@ionic/storage";
import { TranslateService } from '@ngx-translate/core';
import { Platform, PopoverController } from '@ionic/angular';
import { LangService } from 'src/shared/language/lang.service';
import { LangPopoverPage } from './lang-popover/lang-popover.page';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public token: string;
  public usuario: Usuario;

  // public language;


  constructor(private clientService: ClientService,
    private platform: Platform,
    private translateService: TranslateService,
    private popoverCtrl: PopoverController,
    private langSevice: LangService,

    private router: Router, private storage: Storage) {

    this.storage.create();
    this.storage.get('token').then(token => { this.token = token; })
    this.clientService.getLoggedUsuario().then(u => {
      this.usuario = u;
      console.warn("usuario: ", u)
    })
    this.initializeApp();
  }

  ngOnInit() {


  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.translateService.use(this.language);
      this.langSevice.setDefaultLanguage();
    });
  }

  onLogoutClick() {
    this.clientService.logout();
    this.router.navigate(['/home']);
    setInterval(function () { location.reload(); }, 100);
  }

  async openLangPopover(ev) {
    const popover =await this.popoverCtrl.create({
      component: LangPopoverPage,
      event: ev
    });
    await popover.present();
  }


}
