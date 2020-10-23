import commondrf from './commondrf';

export default class APIScanOptions extends commondrf {
  urlForQueryRecord(q) {
    const url = `${this.get('namespace')}/profiles/${q.id}/api_scan_options`;
    return this.buildURLFromBase(url);
  }
}
