import { getUrl, hasSameSubDomain, isAllowedUrl } from "../src/utils";

describe("utils", () => {

  describe("getUrl", () => {
    const host = "example.com"
    const protocol = "https:"
    it("should return link as it is if the link start with http/https/javascript/data", () => {


      expect(getUrl("mailto:example.com", host, protocol)).toBe("mailto:example.com");
      expect(getUrl("tel:+001456789", host, protocol)).toBe("tel:+001456789");
      expect(getUrl("javascript:example.com", host, protocol)).toBe("javascript:example.com");
      expect(getUrl("data:example.com", host, protocol)).toBe("data:example.com");
    });

    it("should return link as it is if the link start with mailto/tel/", () => {
      expect(getUrl("https://example.com", host, protocol)).toBe("https://example.com");
      expect(getUrl("http://example.com", host, protocol)).toBe("http://example.com");
    });

    it("should return link with host and protocol if link is relative", () => {
      expect(getUrl("/test", host, "https:")).toBe("https://example.com/test");
      expect(getUrl("test", host, 'http:')).toBe("http://example.com/test");
    });
  });

  describe("hasSameSubDomain", () => {
    it("should return true if both urls are from sameSubdomain", () => {
      expect(hasSameSubDomain("https://example.com", "https://example.com/test")).toBeTruthy()
    });

    it("should return false if urls are from different Subdomain", () => {
      expect(hasSameSubDomain("https://doc.example.com", "https://example.com")).toBeFalsy()
    });
  });  

  describe("isAllowedUrl", () => {
    it("should return false if url has blocked extension", () => {
      expect(isAllowedUrl("https://example.com/test.jpg")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.pdf")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.png")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.tar")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.deb")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.bin")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.zip")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.rpm")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.xz")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.gz")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.sha1")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.tar")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.md5")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.jar")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.asc")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.mp3")).toBeFalsy()
      expect(isAllowedUrl("https://example.com/test.m4a")).toBeFalsy()
    });

    it("should return false if url has different scheme", () => {
      expect(isAllowedUrl("tel:doc.example.com")).toBeFalsy()
      expect(isAllowedUrl("mailto:doc.example.com")).toBeFalsy()
    });

    it("should return true if url satisfy valid criteria", () => {
      expect(isAllowedUrl("http://doc.example.com")).toBeTruthy()
      expect(isAllowedUrl("https://doc.example.com")).toBeTruthy()
    });
  });  
});