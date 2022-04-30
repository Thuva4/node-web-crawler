export interface CrawlerOption {
  concurrent: number;
  rootUrl: string;
  onDone(url: string, links: string[]): void;
}

export enum URL_STATUS {
  VISITING = "Visiting",
  FOUND = "Found on",
  ERROR = "Error",
  NOT_ACTIVE = "Not active",
}

export enum MODULES {
  CRAWLER = "Crawler",
  VISITOR = "Visitor",
}

export declare type VisitorCallBack = (url: string, links?: string[], error?: Error) => void;

export interface ICrawler {
  full(): void;
  getActive(): Set<string>;
  getPending(): Set<string>;
  start(): void;
  addToPending(url: string): void;
  addToActive(url: string): void;
  shiftPending(): string | undefined;
  removeFromActive(url: string): void;  
  handleLinks(links: string[]): void;
  queue(url: string): void;
  onError(err: Error, url: string): void;
  dequeue(referrer: string): void;
  onFinished(url: string): void;
  createVisitor(url: string): IVisitor;
  visitorCallBack: VisitorCallBack
}

export interface IVisitor {
  visit(
    url: string,
    callback: VisitorCallBack
  ): void;

  extractLinks(html: string): string[];

  printLinksOnPage(links: string[], url: string): void;
}
