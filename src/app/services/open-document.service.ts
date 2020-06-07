import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class OpenDocumentService {
  private portalUrl: string = this.$config.get('global', 'portalUrl');
  private documentUrl: string = this.$config.get('global', 'documentUrl');

  constructor(
    private $config: ConfigService
  ) {
    this.portalUrl = this.portalUrl.endsWith('/') ? this.portalUrl.slice(0, -1) : this.portalUrl;
    this.documentUrl = this.documentUrl.startsWith('/') ? this.documentUrl.slice(1) : this.documentUrl;
    this.documentUrl = this.documentUrl.endsWith('?') ? this.documentUrl.slice(0, -1) : this.documentUrl;
  }

  public openDocument(docGuid: string, docType: string, docTitle: string, docdate: string = null, subSystem: string = ''): void {
    const url: string = `${this.portalUrl}/${this.documentUrl}?type=${docType}&guid=${docGuid}&mode=VIEW&title=&subSystem=${subSystem}`;
    window
      .open(url, '_blank')
      .focus();
  }
}
