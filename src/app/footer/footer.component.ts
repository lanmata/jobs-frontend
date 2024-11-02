import {Component} from '@angular/core'
import {MaterialModule} from "@shared/material/material.module";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-footer',
  imports: [CommonModule, MaterialModule],
  templateUrl: 'footer.component.html',
  styleUrl: 'footer.component.css',
  standalone: true
})
export class FooterComponent {
  public autor: any = {nombre: 'Luis', apellido: 'Mata', company: 'PRX Innova'};
}
