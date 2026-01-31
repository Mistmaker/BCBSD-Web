import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroGeneral'
})
export class FiltroGeneralPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchText)
      );
    });
  }

}
