import { describe, it, expect } from "vitest";
import apiClient from "@/lib/apiClient";

describe("Smoke test", () => {
  it("resolves the @/ path alias and imports modules successfully", () => {
    expect(apiClient).toBeDefined();
    expect(typeof apiClient.get).toBe("function");
  });

  it("handles basic DOM assertions with jsdom environment", () => {
    const el = document.createElement("div");
    el.textContent = "Test Harness Running";
    document.body.appendChild(el);

    expect(el).toHaveTextContent("Test Harness Running");
    expect(document.body).toContainElement(el);

    el.remove();
  });
});
