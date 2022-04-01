import { Component } from '@angular/core';
import { PrimeNGConfig } from "primeng/api";

@Component({
  selector: 'app-rules-button',
  templateUrl: './rules-button.component.html',
  styleUrls: ['./rules-button.component.scss']
})

export class RulesButtonComponent {

  constructor(private primengConfig: PrimeNGConfig) {
    this.displayRules = false;
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  displayRules: boolean;

  openRulesPopup(): void {
    this.displayRules = true;
  }
}