
// Simple error collector to store and manage errors
class ErrorCollector {
  private errors: Map<string, any> = new Map();
  private maxErrors = 50;
  
  public captureError(error: Error, details: any = {}): string {
    // Generate a unique ID for this error
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Store the error with metadata
    this.errors.set(errorId, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString(),
      details,
    });
    
    // Trim old errors if we have too many
    if (this.errors.size > this.maxErrors) {
      const oldestKey = this.errors.keys().next().value;
      this.errors.delete(oldestKey);
    }
    
    // Log the error to console for debugging
    console.error(`[ErrorCollector] Captured error (${errorId}):`, error.message);
    
    return errorId;
  }
  
  public getError(id: string) {
    return this.errors.get(id);
  }
  
  public getAllErrors() {
    return Array.from(this.errors.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
  }
  
  public clearErrors() {
    this.errors.clear();
  }
}

// Singleton instance
export const errorCollector = new ErrorCollector();
