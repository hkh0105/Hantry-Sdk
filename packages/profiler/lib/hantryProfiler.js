import { parseEntryType } from "./utils";

export class Profiler {
  constructor(dsn, options) {
    this.dsn = dsn;
    this.options = options;
  }

  observerStart() {
    const observer = new PerformanceObserver((list, obj) => {
      list.getEntries().forEach(async entry => {
        console.log(entry);
        const parsedEntry = parseEntryType(entry);
        console.log(parsedEntry);
        this.sendPerformance(entry.entryType, parsedEntry, this.dsn);
      });
    });

    observer.observe({
      entryTypes: [
        "first-input",
        "largest-contentful-paint",
        "layout-shift",
        "longtask",
        "mark",
        "measure",
        "navigation",
        "paint",
      ],
    });
  }

  async sendPerformance(entryType, parsedEntry, dsn) {
    const API = "https://hantry.click/users";
    const url = `${API}/project/${dsn}/performance`;
    const option = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parsedEntry: parsedEntry,
        entryType: entryType,
      }),
    };

    try {
      const postPerformanceResoponse = await fetch(url, option);
    } catch (err) {
      console.log(err);
    }
  }
}
