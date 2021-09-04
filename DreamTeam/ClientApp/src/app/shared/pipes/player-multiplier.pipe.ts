import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playerMultiplier'
})
export class PlayerMultiplierPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    switch (value) {
      case 1: return 'Male Player';
      case 2: return 'Female Player';
    }
    return value;
  }

}
