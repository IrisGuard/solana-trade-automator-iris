interface ErrorDetails {
  [key: string]: any;
}

interface ErrorData {
  message: string;
  source: 'client' | 'server' | 'network';
  stack?: string;
  details?: ErrorDetails;
  timestamp?: string;
}

class ErrorCollector {
  private errors: ErrorData[] = [];
  private readonly maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  addError(error: ErrorData): void {
    // Add timestamp to the error
    error.timestamp = new Date().toISOString();

    // If the collector is full, remove the oldest error
    if (this.errors.length >= this.maxSize) {
      this.errors.shift();
    }

    this.errors.push(error);
    console.warn('Error collected:', error); // Log the error for immediate visibility
  }

  getErrors(): ErrorData[] {
    return this.errors;
  }

  clearErrors(): void {
    this.errors = [];
  }

  // Method to filter errors by source
  filterErrorsBySource(source: 'client' | 'server' | 'network'): ErrorData[] {
    return this.errors.filter(error => error.source === source);
  }

  // Method to search errors by message
  searchErrorsByMessage(message: string): ErrorData[] {
    const searchTerm = message.toLowerCase();
    return this.errors.filter(error =>
      error.message.toLowerCase().includes(searchTerm)
    );
  }
}

const errorCollector = new ErrorCollector();

export { errorCollector, ErrorCollector };
