import fs from "fs";
import * as cheerio from "cheerio";
import { Crawler } from "../src/Crawler";
import * as Utils from "../src/Utils";

jest.mock("node-fetch", () => jest.fn());

import { getUrl } from "../src/utils";
import { Visitor } from "../src/Visitor";

const mockOnDone = jest.fn();

describe("Crawler", () => {
  let crawler: Crawler;

  beforeEach(() => {
    jest.clearAllMocks();
    crawler = new Crawler({
      concurrent: 10,
      onDone: mockOnDone,
      rootUrl: "http://example.com/",
    });
  });
  describe("handleLinks", () => {
    it("should queue only the links from same sub domain as root url", () => {
      let queueSpy = jest.spyOn(crawler, "queue").mockImplementation(jest.fn());

      const html = fs.readFileSync(__dirname + "/__mocks__/index.html", "utf8");
      const $ = cheerio.load(html.toString());
      let links = $("a")
        .map((i, link) => link.attribs.href)
        .get()
        .map((link) => getUrl(link, "example.com", "http:"));
      crawler.handleLinks(links);

      expect(queueSpy).toHaveBeenCalledTimes(2);
      expect(queueSpy).toHaveBeenNthCalledWith(
        1,
        "http://example.com/navigation.html"
      );
      expect(queueSpy).toHaveBeenNthCalledWith(
        2,
        "http://example.com/about.html"
      );

      crawler = new Crawler({
        concurrent: 10,
        onDone: mockOnDone,
        rootUrl: "https://google.com/",
      });

      links = $("a")
        .map((i, link) => link.attribs.href)
        .get()
        .map((link) => getUrl(link, "google.com", "https:"));

      crawler.handleLinks(links);

      queueSpy = jest.spyOn(crawler, "queue").mockImplementation(jest.fn());

      crawler.handleLinks(links);
      expect(queueSpy).toHaveBeenCalledTimes(3);
      expect(queueSpy).toHaveBeenNthCalledWith(
        1,
        "https://google.com/navigation.html"
      );
      expect(queueSpy).toHaveBeenNthCalledWith(
        2,
        "https://google.com/about.html"
      );

      expect(queueSpy).toHaveBeenNthCalledWith(3, "https://google.com");
    });
  });

  describe("full", () => {
    it("should return true if active queue is full", () => {
      Reflect.set(crawler, "active", new Set([
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
      ]));
      expect(crawler.full()).toBe(true);
    });

    it("should return false if active queue is not full", () => {
      Reflect.set(crawler, "active", new Set([
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
      ]));
      expect(crawler.full()).toBe(false);
    });
  });

  describe("queue", () => {
    it("should return immediately if url is visited already", () => {
      Reflect.set(crawler, "visited", {
        "http://example.com/navigation.html": true,
      });

      const fullSpy = jest
        .spyOn(crawler, "full")
        .mockImplementation(() => true);

      crawler.queue("http://example.com/navigation.html");
      expect(fullSpy).toHaveBeenCalledTimes(0);
    });

    it("should add the url to pending and not trigger dequeue if the queue is full", () => {
      const fullSpy = jest
        .spyOn(crawler, "full")
        .mockImplementation(() => true);
      const addToPendingSpy = jest
        .spyOn(crawler, "addToPending")
        .mockImplementation(jest.fn());

      const dequeueSpy = jest
        .spyOn(crawler, "dequeue")
        .mockImplementation(jest.fn());

      crawler.queue("http://example.com/navigation.html");
      expect(fullSpy).toHaveBeenCalledTimes(1);
      expect(addToPendingSpy).toHaveBeenCalledTimes(1);
      expect(addToPendingSpy).toHaveBeenLastCalledWith(
        "http://example.com/navigation.html"
      );
      expect(dequeueSpy).toHaveBeenCalledTimes(0);
    });

    it("should add the url to pending  and trigger dequeue if the queue is not full", () => {
      const fullSpy = jest
        .spyOn(crawler, "full")
        .mockImplementation(() => false);
      const addToPendingSpy = jest
        .spyOn(crawler, "addToPending")
        .mockImplementation(jest.fn());

      const dequeueSpy = jest
        .spyOn(crawler, "dequeue")
        .mockImplementation(jest.fn());

      crawler.queue("http://example.com/navigation.html");
      expect(fullSpy).toHaveBeenCalledTimes(1);
      expect(addToPendingSpy).toHaveBeenCalledTimes(1);
      expect(addToPendingSpy).toHaveBeenCalledWith(
        "http://example.com/navigation.html"
      );
      expect(dequeueSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("error", () => {
    it("it should call onError function", () => {
      const logErrorSpy = jest
        .spyOn(Utils, "logError")
        .mockImplementation(jest.fn());
      crawler.onError(new Error("error"), "http://example.com/navigation.html");
      expect(logErrorSpy).toHaveBeenCalledTimes(1);
      expect(logErrorSpy).toHaveBeenLastCalledWith(
        "Error",
        "http://example.com/navigation.html",
        "Crawler",
        "error"
      );
    });
  });

  describe("dequeue", () => {
    it("should call the visit if there are pending urls", () => {
      Reflect.set(
        crawler,
        "pending",
        new Set(["http://example.com/navigation.html"])
      );

      const mockVisitor: jest.Mocked<Partial<Visitor>> = {
        visit: jest.fn(),
        extractLinks: jest.fn(),
        printLinksOnPage: jest.fn(),
      };

      const createVisitorSpy = jest
        .spyOn(crawler, "createVisitor")
        .mockImplementationOnce(() => mockVisitor as unknown as Visitor);
      crawler.dequeue();
      expect(createVisitorSpy).toHaveBeenCalledTimes(1);
      expect(mockVisitor.visit).toHaveBeenCalledWith(
        "http://example.com/navigation.html",
        expect.any(Function)
      );
    });

    it("should call the done if pending and active urls are empty", () => {
      const createVisitorSpy = jest
        .spyOn(crawler, "createVisitor")
        .mockImplementation();

      Reflect.set(crawler, "visited", {
        "http://example.com/navigation.html": true,
      });

      crawler.dequeue();
      expect(createVisitorSpy).toHaveBeenCalledTimes(0);
      expect(mockOnDone).toHaveBeenCalledTimes(1);
      expect(mockOnDone).toHaveBeenLastCalledWith("http://example.com/", [
        "http://example.com/navigation.html",
      ]);
    });

    it("should not call the done if pending is empty but active is not empty", () => {
      const createVisitorSpy = jest
        .spyOn(crawler, "createVisitor")
        .mockImplementation();

      Reflect.set(crawler, "active", ["http://example.com/navigation.html"]);

      crawler.dequeue();
      expect(createVisitorSpy).toHaveBeenCalledTimes(0);
      expect(mockOnDone).toHaveBeenCalledTimes(0);
    });
  });

  describe("onFinished", () => {
    it("should not call dequeue if active is not full", () => {
      const removeFromActiveSpy = jest
        .spyOn(crawler, "removeFromActive")
        .mockImplementation(jest.fn());

      const fullSpy = jest
        .spyOn(crawler, "full")
        .mockImplementation(() => true);
      const dequeueSpy = jest
        .spyOn(crawler, "dequeue")
        .mockImplementation(jest.fn());

      Reflect.set(crawler, "active", new Set([
        "http://example.com/",
        "http://example.com/navigation.html",
      ]));

      crawler.onFinished("http://example.com/navigation.html");
      expect(removeFromActiveSpy).toHaveBeenCalledTimes(1);

      expect(removeFromActiveSpy).toHaveBeenLastCalledWith("http://example.com/navigation.html");

      expect(fullSpy).toHaveBeenCalledTimes(1);

      expect(dequeueSpy).toHaveBeenCalledTimes(0);
    });

    it("should call dequeue if active is not full", () => {
      const removeFromActiveSpy = jest
        .spyOn(crawler, "removeFromActive")
        .mockImplementation(jest.fn());

      const fullSpy = jest
        .spyOn(crawler, "full")
        .mockImplementation(() => false);
      const dequeueSpy = jest
        .spyOn(crawler, "dequeue")
        .mockImplementation(jest.fn());

      Reflect.set(crawler, "active", new Set([
        "http://example.com/",
        "http://example.com/navigation.html",
      ]));

      crawler.onFinished("http://example.com/navigation.html");
      expect(removeFromActiveSpy).toHaveBeenCalledTimes(1);
      expect(removeFromActiveSpy).toHaveBeenLastCalledWith("http://example.com/navigation.html");

      expect(fullSpy).toHaveBeenCalledTimes(1);

      expect(dequeueSpy).toHaveBeenCalledTimes(1);
    });

    it("should not call removeFromActive if url is not found in active", () => {
      const removeFromActiveSpy = jest
        .spyOn(crawler, "removeFromActive")
        .mockImplementation(jest.fn());

      const fullSpy = jest
        .spyOn(crawler, "full")
        .mockImplementation(() => false);
      const dequeueSpy = jest
        .spyOn(crawler, "dequeue")
        .mockImplementation(jest.fn());

      Reflect.set(crawler, "active", new Set(["http://example.com/"]));

      crawler.onFinished("http://example.com/navigation.html");
      expect(removeFromActiveSpy).toHaveBeenCalledTimes(0);
      expect(fullSpy).toHaveBeenCalledTimes(1);
      expect(dequeueSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("start", () => {
    it("should call queue", () => {
      const queueSpy = jest
        .spyOn(crawler, "queue")
        .mockImplementation(jest.fn());

      crawler.start();
      expect(queueSpy).toHaveBeenCalledTimes(1);
      expect(queueSpy).toHaveBeenLastCalledWith("http://example.com/");
    });
  });

  describe("addToActive", () => {
    it("should add url to active", () => {
      expect(crawler.getActive()).toEqual(new Set());
      crawler.addToActive("http://example.com/navigation.html");
      expect(crawler.getActive()).toEqual(new Set([
        "http://example.com/navigation.html",
      ]));
    });
  });

  describe("addToPending", () => {
    it("should add url to pending", () => {
      expect(crawler.getPending()).toEqual(new Set());
      crawler.addToPending("http://example.com/navigation.html");
      expect(crawler.getPending()).toEqual(
        new Set(["http://example.com/navigation.html"])
      );
    });
  });

  describe("removeFromActive", () => {
    it("should splice the given index", () => {
      Reflect.set(
        crawler,
        "active",
        new Set(["http://example.com/", "http://example.com/navigation.html"])
      );

      crawler.removeFromActive("http://example.com/navigation.html");
      expect(crawler.getActive()).toEqual(new Set(["http://example.com/"]));
    });
  });

  describe("visitorCallback", () => {
    it("should call handleLinks and onFinished if there is not any error", () => {
      const handleLinksSpy = jest
        .spyOn(crawler, "handleLinks")
        .mockImplementation(jest.fn());

      const onFinishedSpy = jest
        .spyOn(crawler, "onFinished")
        .mockImplementation(jest.fn());

      crawler.visitorCallBack(
        "http://example.com",
        ["http://example.com/navigation.html"],
        undefined
      );
      expect(handleLinksSpy).toHaveBeenCalledTimes(1);
      expect(handleLinksSpy).toHaveBeenLastCalledWith([
        "http://example.com/navigation.html",
      ]);

      expect(onFinishedSpy).toHaveBeenCalledTimes(1);
      expect(onFinishedSpy).toHaveBeenLastCalledWith("http://example.com");
    });

    it("should call onError and onFinished if there is an error", () => {
      const onErrorSpy = jest
        .spyOn(crawler, "onError")
        .mockImplementation(jest.fn());

      const onFinishedSpy = jest
        .spyOn(crawler, "onFinished")
        .mockImplementation(jest.fn());

      const error = new Error("Error");
      crawler.visitorCallBack("http://example.com/navigation.html", [], error);
      expect(onErrorSpy).toHaveBeenCalledTimes(1);
      expect(onErrorSpy).toHaveBeenLastCalledWith(
        error,
        "http://example.com/navigation.html"
      );

      expect(onFinishedSpy).toHaveBeenCalledTimes(1);
      expect(onFinishedSpy).toHaveBeenLastCalledWith(
        "http://example.com/navigation.html"
      );
    });
  });
});
