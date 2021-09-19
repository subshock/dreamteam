import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SeasonStatePipe } from './pipes/season-state.pipe';
import { PlayerMultiplierPipe } from './pipes/player-multiplier.pipe';
import { SquarePayComponent } from './components/square-pay/square-pay.component';
import { RoundStatePipe } from './pipes/round-state.pipe';

@NgModule({
  declarations: [
    SeasonStatePipe,
    PlayerMultiplierPipe,
    SquarePayComponent,
    RoundStatePipe
  ],
  imports: [
    CommonModule,
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot()
  ],
  exports: [
    ButtonsModule,
    BsDropdownModule,
    BsDatepickerModule,
    ModalModule,
    PopoverModule,
    SeasonStatePipe,
    PlayerMultiplierPipe,
    SquarePayComponent,
    RoundStatePipe
  ]
})
export class SharedModule { }
