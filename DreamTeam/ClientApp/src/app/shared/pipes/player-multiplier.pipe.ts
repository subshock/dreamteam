import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playerMultiplier'
})
export class PlayerMultiplierPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return `${value}x`;
  }

}
