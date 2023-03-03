import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clean'
})
export class CleanPipe implements PipeTransform {

  transform(value: string): unknown {
    return value.replace(/[^A-Z0-9-]/ig, '').toLowerCase();
  }

}
