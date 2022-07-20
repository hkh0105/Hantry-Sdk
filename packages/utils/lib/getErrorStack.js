import ErrorStackParser from "error-stack-parser";

export function getErrorStack(error) {
  const parsedError = ErrorStackParser.parse(error);

  if (parsedError) {
    const stack = parsedError.map(stack => {
      try {
        String(stack).replace(/(\\r\\n|\\n|\\r)/gm, "\\n");
        return {
          file: stack.file,
          function: stack.functionName,
          lineno: stack.lineNumber,
          colno: stack.columnNumber,
        };
      } catch (err) {
        return {
          file: stack.file,
          function: stack.functionName,
          lineno: stack.lineNumber,
          colno: stack.columnNumber,
        };
      }
    });

    return stack;
  }
}
