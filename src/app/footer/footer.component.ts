import {Component} from '@angular/core'
import {MaterialModule} from "@shared/material/material.module";
import {CommonModule} from "@angular/common";

let componentName = 'footer.component';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, MaterialModule],
  templateUrl: `${componentName}.html`,
  styleUrl: `${componentName}.css`,
  standalone: true
})
export class FooterComponent {
  public autor: any = {nombre: 'Luis', apellido: 'Mata', company: 'PRX Innova'};
}
