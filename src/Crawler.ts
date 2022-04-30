import { ICrawler, CrawlerOption, URL_STATUS, MODULES } from "./Types";
import { hasSameSubDomain, logError } from "./utils";
import { Visitor } from "./Visitor";

export class Crawler implements ICrawler {
  private MODULE: MODULES = MODULES.CRAWLER;

  private pending: Set<string> = new Set();
  private active: Set<string> = new Set();

  private visited: { [key: string]: boolean } = {};

  public opts: CrawlerOption;

  constructor(opts: CrawlerOption) {
    this.opts = opts;
  }

  full() {
    return this.active.size >= this.opts.concurrent;
  }

  getActive() {
    return this.active;
  }

  getPending() {
    return this.pending;
  }

  start() {
    this.queue(this.opts.rootUrl);
  }

  addToPending(url: string) {
    this.pending.add(url);
  }

  addToActive(url: string) {
    this.active.add(url);
  }

  shiftPending() {
    const first = Array.from(this.pending).shift();
    if (first) {
      this.pending.delete(first);
    }
    return first;
  }

  removeFromActive(url: string) {
    this.active.delete(url);
  }

  /**
   * Filter the external subdomains from the links and add them to the queue
   * @param links
   */
  handleLinks(links: string[]): void {
    links
      .filter((link) => hasSameSubDomain(link, this.opts.rootUrl))
      .forEach((link) => this.queue(link));
  }

  queue(url: string): void {
    if (this.visited[url]) {
      return;
    }
    this.visited[url] = true;
    this.addToPending(url);
    if (!this.full()) {
      this.dequeue();
    }
  }

  onError(err: Error, url: string) {
    logError(URL_STATUS.ERROR, url, this.MODULE, err.message);
  }

  dequeue() {
    const next = this.shiftPending();
    if (next != undefined) {
      this.addToActive(next);
      const visitor = this.createVisitor();
      visitor.visit(next, this.visitorCallBack.bind(this));
    } else if (this.active.size === 0) {
      this.opts.onDone(this.opts.rootUrl, Object.keys(this.visited));
    }
  }

  visitorCallBack(url: string, links?: string[], error?: Error): void {
    if (error) {
      this.onError(error, url);
    } else if (links) {
      this.handleLinks(links);
    }
    this.onFinished(url);
  }

  onFinished(url: string) {
    if (this.active.has(url)) {
      this.removeFromActive(url);
    }

    if (!this.full()) {
      this.dequeue();
    }
  }

  createVisitor() {
    return new Visitor(this.opts.rootUrl);
  }
}
