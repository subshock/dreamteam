import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminNavItemId, IAdminNavItem } from '../admin.types';

@Injectable({
  providedIn: 'root'
})
export class AdminStateService {

  private navListSubject = new BehaviorSubject<IAdminNavItem[]>([]);
  navList$: Observable<IAdminNavItem[]> = this.navListSubject.asObservable();

  constructor() { }

  addNavItem(item: IAdminNavItem) {
    const list = this._createAndRemoveNavItemsInternal(item.id);
    list.push(item);
    this.navListSubject.next(list);
  }

  removeNavItem(id: AdminNavItemId) {
    const list = this._createAndRemoveNavItemsInternal(id);
    this.navListSubject.next(list);
  }

  private _createAndRemoveNavItemsInternal(id: AdminNavItemId): IAdminNavItem[] {
    const newList = [...this.navListSubject.value];
    const idx = newList.findIndex(x => x.id === id);
    if (idx >= 0) {
      newList.splice(idx);
    }

    return newList;
  }
}
