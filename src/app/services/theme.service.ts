import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = true;
  private mode = "Dark";
  private readonly ThemeKey = "Rydle.Theme";

  constructor() { }

  isDarkMode() {
    return this.darkMode;
  }

  setDarkMode(isDarkMode: boolean) {
    this.darkMode = isDarkMode;
    if (isDarkMode) {
      document.body.classList.add('dark');
      this.mode = "Dark";
    } else {
      document.body.classList.remove('dark');
      this.mode = "Light";
    }
  }

  saveMode(): void{
    localStorage.setItem(this.ThemeKey, this.mode)
  }

  loadMode(): boolean{
    let theme = localStorage.getItem(this.ThemeKey);
    if (theme != null) {
      if (theme == "Light") {
        this.setDarkMode(false);
        return false;
      }
      else {
        this.setDarkMode(true);
        return true;
      }
    }
    return true;
  }
}
