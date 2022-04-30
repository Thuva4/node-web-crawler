import fs from "fs";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Visitor } from "../src/Visitor.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Utils from "../src/Utils.ts";

jest.mock("node-fetch", () => jest.fn());

const { Response, Headers } = jest.requireActual("node-fetch");

import fetch from "node-fetch";

describe("Visitor", () => {
  let visitor: Visitor;

  beforeEach(() => {
    jest.clearAllMocks();
    visitor = new Visitor("http://example.com");
  });

  describe("extractLinks", () => {
    it("should extract links from html", () => {
      const html = fs
        .readFileSync(__dirname + "/__mocks__/index.html")
        .toString();
      const links = visitor.extractLinks(html);
      expect(links).toEqual([
        "http://example.com/navigation.html",
        "http://example.com/about.html",
        "https://google.com",
      ]);
    });
  });
  describe("visit", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it("should process for the valid urls", async () => {
      const meta = {
        "Content-Type": "application/html",
        Accept: "*/*",
      };
      const headers = new Headers(meta);

      const ResponseInit = {
        status: 200,
        statusText: "success",
        headers: headers,
      };

      const indexHtml = fs
        .readFileSync(__dirname + "/__mocks__/index.html")
        .toString();

      const extractLinksSpy = jest
        .spyOn(visitor, "extractLinks")
        .mockImplementation(() => ["http://example.com/about"]);

      const printLinksOnPageSpy = jest
        .spyOn(visitor, "printLinksOnPage")
        .mockImplementation(jest.fn());

      const getHtml = new Response(indexHtml, ResponseInit);
      (fetch as unknown as jest.Mock).mockResolvedValueOnce(
        Promise.resolve(getHtml)
      );

      const mockCallback = jest.fn();
      await visitor.visit("http://example.com/navigation.html", mockCallback);
      expect(extractLinksSpy).toHaveBeenCalledTimes(1);
      expect(printLinksOnPageSpy).toHaveBeenCalledTimes(1);

      expect(mockCallback).toHaveBeenCalledTimes(1);

      expect(mockCallback).toHaveBeenCalledWith(
        "http://example.com/navigation.html",
        ["http://example.com/about"],
        undefined
      );
    });

    it("should not process for the invalid urls", async () => {
      const meta = {
        "Content-Type": "application/html",
        Accept: "*/*",
      };
      const headers = new Headers(meta);

      const ResponseInit = {
        status: 200,
        statusText: "success",
        headers: headers,
      };

      const indexHtml = fs
        .readFileSync(__dirname + "/__mocks__/index.html")
        .toString();

      const extractLinksSpy = jest
        .spyOn(visitor, "extractLinks")
        .mockImplementation(() => ["http://example.com/about"]);

      const printLinksOnPageSpy = jest
        .spyOn(visitor, "printLinksOnPage")
        .mockImplementation(jest.fn());
      const mockCallback = jest.fn();
      const getHtml = new Response(indexHtml, ResponseInit);

      (fetch as unknown as jest.Mock).mockResolvedValueOnce(
        Promise.resolve(getHtml)
      );
      await visitor.visit("http://example.com/navigation.pdf", mockCallback);
      expect(extractLinksSpy).toHaveBeenCalledTimes(0);
      expect(printLinksOnPageSpy).toHaveBeenCalledTimes(0);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        "http://example.com/navigation.pdf",
        undefined,
        undefined
      );
    });

    it("should call error if there is a fetch error", async () => {
      const extractLinksSpy = jest
        .spyOn(visitor, "extractLinks")
        .mockImplementation(() => ["http://example.com/about"]);

      const printLinksOnPageSpy = jest
        .spyOn(visitor, "printLinksOnPage")
        .mockImplementation(jest.fn());
      const mockCallback = jest.fn();

      const error = new Error();
      (fetch as unknown as jest.Mock).mockRejectedValue(error);
      await visitor.visit("http://example.com/navigation.html", mockCallback);
      expect(extractLinksSpy).toHaveBeenCalledTimes(0);
      expect(printLinksOnPageSpy).toHaveBeenCalledTimes(0);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenLastCalledWith(
        "http://example.com/navigation.html",
        undefined,
        error
      );
    });
  });

  describe("printLinksOnPage", () => {
    it("should print the links on the page", () => {
      const logStatusSpy = jest
        .spyOn(Utils, "logStatus")
        .mockImplementation(jest.fn());
      visitor.printLinksOnPage(
        ["http://example.com/about", "http://example.com/career"],
        "http://example.com"
      );
      expect(logStatusSpy).toHaveBeenCalledTimes(1);
      expect(logStatusSpy).toHaveBeenCalledWith(
        "Found on",
        "http://example.com Links \n|----> http://example.com/about\n|----> http://example.com/career\n",
        "Visitor"
      );
    });
  });
});
