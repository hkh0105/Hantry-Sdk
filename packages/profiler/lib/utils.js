export function parseEntryType(entry) {
  if (!entry.entryType) return;

  if (entry.entryType === "navigation") {
    const navigation = {};
    navigation.type = entry.type;
    navigation.domLoad = entry.domComplete - entry.domContentLoadedEventEnd;
    navigation.url = entry.name;
    navigation.domInteractive = entry.domInteractive;
    navigation.responseTime = entry.responseEnd - entry.responseStart;
    navigation.duration = entry.duration;

    return navigation;
  }

  if (entry.entryType === "resource") {
    const resource = {};
    resource.type = entry.type;
    resource.serverConnectTime = entry.connectEnd - entry.connectStart;
    resource.resourceName = entry.name;
    resource.resourceType = entry.initiatorType;
    resource.responseTime = entry.responseEnd - entry.responseStart;
    resource.size = entry.transferSize;
    resource.duration = entry.duration;

    return resource;
  }

  if (entry.entryType === "paint") {
    const paint = {};
    paint.type = entry.name;
    paint.startTime = entry.startTime;

    return paint;
  }

  if (entry.entryType === "largest-contentful-paint") {
    const largestPaint = {};
    largestPaint.startTime = entry.startTime;
    largestPaint.element = entry.element;
    largestPaint.size = entry.size;

    return largestPaint;
  }

  if (entry.entryType === "longtask") {
    const longtask = {};
    longtask.startTime = entry.startTime;
    longtask.name = entry.name;
    longtask.duration = entry.duration;

    return longtask;
  }

  if (entry.entryType === "layout-shift") {
    const layoutShift = {};
    layoutShift.startTime = entry.startTime;
    layoutShift.name = entry.name;
    layoutShift.duration = entry.startTime - entry.lastInputTime;
    layoutShift.sources = entry.sources;
    layoutShift.url = window.location.href;

    return layoutShift;
  }

  if (entry.entryType === "first-input") {
    console.log(entry);
    const firstInput = {};
    firstInput.name = entry.name;
    firstInput.delay = entry.processingStart - entry.startTime;
    firstInput.target = entry.target ? entry.target.id : "unknown-target";
    firstInput.duration = entry.duration;

    return firstInput;
  }
}
