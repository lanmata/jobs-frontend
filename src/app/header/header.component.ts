import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {RouterLink} from "@angular/router";
import {AppConst} from "@shared/util/app-const";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@shared/material/material.module";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly appConst = AppConst;

}
