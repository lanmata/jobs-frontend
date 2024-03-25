import {Component} from '@angular/core';
import {HeaderComponent} from "./header/header.component";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";

@Component({
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'jobs-frontend';
}
