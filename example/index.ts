import * as fs from "fs";
import { log, Crawler } from "../index";

/**
 * Write all the links from the url to the file
 * @param url root url
 * @param links founded links
 */
 const onDone = (url: string, links: string[]) => {
  fs.writeFile("output.txt", links.join("\n"), () => {
    log(`Completed ${url} total crawled count: ${links.length}\n`);
  });
};

const crawler = new Crawler({
  concurrent: +process.env.CONCURRENT || 10,
  rootUrl: process.env.ROOT_URL || "https://example.com",
  onDone,
});

// start crawling
crawler.start();