import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  random: string = '';
  isDarkMode = true;

  constructor(private themeService: ThemeService){
      this.isDarkMode = this.themeService.isDarkMode();
    }

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      this.themeService.setDarkMode(this.isDarkMode);
      this.themeService.saveMode();
    }
}
