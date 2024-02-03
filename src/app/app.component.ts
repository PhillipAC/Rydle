import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ResultsComponent } from './components/results/results.component';
import { HelpComponent } from './components/help/help.component';
import { GuessComponent } from './components/guess/guess.component';
import { ShareComponent } from './components/share/share.component';
import { CommonModule, NgIf } from '@angular/common';
import { GameService } from './services/game.service';
import { GuessResult } from './models/guessResult';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
            RouterOutlet, 
            CommonModule,
            RouterLink,
            RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Rydle';

}
