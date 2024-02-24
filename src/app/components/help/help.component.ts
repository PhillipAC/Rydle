import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent implements OnInit {
  random: string = '';
  isDarkMode = true;
  isRandomGame = false;

  constructor(private themeService: ThemeService,
      private router: Router, 
      private activatedRoute: ActivatedRoute,
      private gameService: GameService){
      this.isDarkMode = this.themeService.isDarkMode();
    }

  ngOnInit(): void {
    let randomId = this.activatedRoute.snapshot.queryParamMap.get("random");
    this.isRandomGame = randomId === "";
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
    this.themeService.saveMode();
  }

  loadRandom() {
    this.gameService.reset();
    //Since the router will not reload components by default for the same path
    //This function will load a temp url that is different and then reload the
    //path with the random query added.
    this.router.navigateByUrl('/temp', { skipLocationChange: true }).then(() => {
      this.router.navigate([''],
      { queryParams: { random: '' } });
    });
  }

  loadDaily() {
    this.gameService.reset();
    //Since the router will not reload components by default for the same path
    //This function will load a temp url that is different and then reload the
    //path with the random query added.
    this.router.navigateByUrl('/temp', { skipLocationChange: true }).then(() => {
      this.router.navigate(['']);
    });
  }
}
