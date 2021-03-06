import { parseEntryType } from "./utils";
import axios from "axios";

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
    console.log("gogo");

    try {
      const postPerformanceResoponse = await axios.post(
        `${API}/project/${dsn}/performance`,
        {
          parsedEntry,
          entryType,
        },
      );
    } catch (err) {
      console.log(err);
    }
  }
}
