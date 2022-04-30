import fetch from "node-fetch";
import * as cheerio from "cheerio";

import { getUrl, isAllowedUrl, logStatus } from "./Utils";
import { ANCHOR_TAG } from "./Constants";
import { IVisitor, MODULES, URL_STATUS, VisitorCallBack } from "./Types";

export class Visitor implements IVisitor {
  private MODULE: MODULES = MODULES.VISITOR;
  private rootUrl;

  constructor(rootUrl: string) {
    this.rootUrl = rootUrl;
  }

  /**
   * check if the url is allowed to crawl and get the response and extract the links and submit to handleLinks
   * @param url
   */
  async visit(
    url: string,
    callback: VisitorCallBack
  ) {
    logStatus(URL_STATUS.VISITING, url, this.MODULE);
    let error;
    let links;
    if (isAllowedUrl(url)) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        links = this.extractLinks(html);
        this.printLinksOnPage(links, url);
      } catch (err) {
        error = err;
      }
    }
    callback(url, links, error);
  }

  extractLinks(html: string) {
    const $ = cheerio.load(html);
    const rootUrl = new URL(this.rootUrl);
    return $(ANCHOR_TAG)
      .map((i, link) => link.attribs.href)
      .get()
      .map((link) => getUrl(link, rootUrl.host, rootUrl.protocol));
  }

  printLinksOnPage(links: string[], url: string) {
    const foundedLinks = links.map((link) => `|----> ${link}`).join("\n");
    logStatus(URL_STATUS.FOUND, `${url} Links \n${foundedLinks}\n`, this.MODULE);
  }
}
