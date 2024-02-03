function isValid(stale, latest, otjson) {
    // Parse the JSON string containing operations
    const operations = JSON.parse(otjson);
  
    // Initialize cursor position and the current document
    let cursorPosition = 0;
    let currentDocument = stale;
  
    // Iterate through each operation
    for (const operation of operations) {
      switch (operation.op) {
        case "insert":
          // Insert operation: Add characters at the cursor position
          if (cursorPosition <= currentDocument.length) {
            currentDocument =
              currentDocument.slice(0, cursorPosition) +
              operation.chars +
              currentDocument.slice(cursorPosition);
            cursorPosition += operation.chars.length;
          } else {
            return false; // Inserting past the end of the string
          }
          break;
  
        case "delete":
          // Delete operation: Remove characters at the cursor position
          if (cursorPosition + operation.count <= currentDocument.length) {
            currentDocument =
              currentDocument.slice(0, cursorPosition) +
              currentDocument.slice(cursorPosition + operation.count);
          } else {
            return false; // Deleting past the end of the string
          }
          break;
  
        case "skip":
          // Skip operation: Move the cursor forward
          cursorPosition += operation.count;
          if (cursorPosition > currentDocument.length) {
            return false; // Skipping past the end of the string
          }
          break;
  
        default:
          return false; // Invalid operation
      }
    }
  
    // Check if the final document matches the latest document
    return currentDocument === latest;
  }
  
  // Test cases
  console.log(
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'Repl.it uses operational transformations.',
      '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}]'
    )
  ); // true
  
  console.log(
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'Repl.it uses operational transformations.',
      '[{"op": "skip", "count": 45}, {"op": "delete", "count": 47}]'
    )
  ); // false, delete past end
  
  console.log(
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'Repl.it uses operational transformations.',
      '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}, {"op": "skip", "count": 2}]'
    )
  ); // false, skip past end
  
  console.log(
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'We use operational transformations to keep everyone in a multiplayer repl in sync.',
      '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
    )
  ); // true
  
  console.log(
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'We can use operational transformations to keep everyone in a multiplayer repl in sync.',
      '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
    )
  ); // false
  
  console.log(
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      '[]'
    )
  ); // true
  