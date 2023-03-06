import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SquarePayComponent } from './components/square-pay/square-pay.component';
import { RegisterDoneComponent } from './register/register-done.component';
import { IconDirective } from './directives/icon.directive';
import { CleanPipe } from './pipes/clean.pipe';
import { LadderComponent } from './ladder/ladder.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    SquarePayComponent,
    RegisterDoneComponent,
    IconDirective,
    CleanPipe,
    LadderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
