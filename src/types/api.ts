
/**
 * Types for API related functionality
 */

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  active: boolean;
  description?: string;
  category?: string;
  lastChecked?: Date;
  created?: Date;
  updated?: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  active: boolean;
  expiresAt?: Date;
  lastUsed?: Date;
  created: Date;
}

export interface ApiKeyCreateRequest {
  name: string;
  expiresIn?: number; // In days
}

export interface ApiKeyResponse {
  id: string;
  name: string;
  key: string;
  expiresAt?: string;
}

export interface ApiEndpointCreateRequest {
  name: string;
  url: string;
  apiKey?: string;
  description?: string;
  category?: string;
  active?: boolean;
}

export interface ApiEndpointUpdateRequest {
  id: string;
  name?: string;
  url?: string;
  apiKey?: string;
  description?: string;
  category?: string;
  active?: boolean;
}

export interface ApiStatistics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
}
