import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/services/profile.service';
import { ToolService } from 'src/services/tool.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  contantUs = {
    subject: '',
    message: '',
    email: '',
    userId: 0,
  };
  loading = false;
  constructor(
    public proflie: ProfileService,
    public tool: ToolService,
    public router: Router,
    public translateService: TranslateService,
    ) {
      translateService.get('dataSuccess').subscribe((resp: any) => {
        this.dataSuccess = resp;
      });
      translateService.get('dataError').subscribe((resp: any) => {
        this.dataError = resp;
      });
    }
    dataSuccess: any;
    dataError: any;
  

  ngOnInit() {}

  async send() {
    if ((this.contantUs.subject && this.contantUs.message) == '') {
        this.tool.presentToast(this.dataError.PleaseFillTheAllFields, 'danger', 'bottom');
      } else {
        this.loading = true
      let id = JSON.parse(localStorage.getItem('userId'));
      this.contantUs.userId = id;        
      await this.proflie.contactUs(this.contantUs).subscribe((resp: any) => {
       this.loading =false;
       this.contantUs = {
         subject: '',
         message: '',
         email:'',
         userId: 0,
        };
        this.tool.presentToast(this.dataError.MessageSuccessfullySend, 'success', 'top');
      },(err)=>{
        this.loading =false;
      } );
    }
  }
}
