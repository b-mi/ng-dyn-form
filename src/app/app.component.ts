import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormSampleComponent } from './form-sample/form-sample.component';
import { TypographyComponent } from './typography/typography.component';
import { ThemeSwitchComponent } from './theme/theme-switch.component';
import { ThemeService } from './theme/theme.service';
import { MatTabsModule } from '@angular/material/tabs';
import { NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormSampleComponent, TypographyComponent,
    ThemeSwitchComponent, NgClass, MatTabsModule, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dyn-form';
  themeService: ThemeService = inject(ThemeService);
}