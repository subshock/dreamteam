import { Injectable } from '@angular/core';

export interface IScript {
  name: string;
  src: string;
}

export interface IScriptLoadResult {
  script: string;
  loaded: boolean;
  status: string;
}

interface Scripts extends IScript {
  name: string;
  src: string;
  loaded: boolean;
}

declare var document: any;

@Injectable({
  providedIn: 'root'
})
export class DynamicScriptLoaderService {

  private scripts: { [key: string]: Scripts } = {};

  constructor() { }

  loadScript(script: IScript): Promise<IScriptLoadResult> {
    return new Promise((resolve, reject) => {
      if (!this.scripts[script.name]) {
        this.scripts[script.name] = { ...script, loaded: false };
        // load script
        const scriptEl = document.createElement('script');
        scriptEl.type = 'text/javascript';
        scriptEl.src = this.scripts[script.name].src;
        if (scriptEl.readyState) {  // IE
          scriptEl.onreadystatechange = () => {
            if (scriptEl.readyState === 'loaded' || scriptEl.readyState === 'complete') {
              scriptEl.onreadystatechange = null;
              this.scripts[script.name].loaded = true;
              resolve({ script: script.name, loaded: true, status: 'Loaded' });
            }
          };
        } else {  // Others
          scriptEl.onload = () => {
            this.scripts[script.name].loaded = true;
            resolve({ script: script.name, loaded: true, status: 'Loaded' });
          };
        }
        scriptEl.onerror = (error: any) => resolve({ script: script.name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(scriptEl);
      } else {
        resolve({ script: script.name, loaded: true, status: 'Already Loaded' });
      }
    });
  }
}
