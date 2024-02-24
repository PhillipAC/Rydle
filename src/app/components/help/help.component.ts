import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private themeService: ThemeService,
      private router: Router){
      this.isDarkMode = this.themeService.isDarkMode();
    }

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      this.themeService.setDarkMode(this.isDarkMode);
      this.themeService.saveMode();
    }

    loadRandom() {
      //Since the router will not reload components by default for the same path
      //This function will load a temp url that is different and then reload the
      //path with the random query added.
      this.router.navigateByUrl('/temp', { skipLocationChange: true }).then(() => {
        this.router.navigate([''],
        { queryParams: { random: '' } });
      });
    }
}
