import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CodeReviewRequest {
  code: string;
  language?: string;
  focus?: 'comprehensive' | 'security' | 'performance' | 'style';
  use_ai?: boolean;
}

export interface IssueFix {
  issue: string;
  fix: string;
}

export interface CodeSummary {
  total_lines: number;
  code_lines: number;
  functions: number;
  classes: number;
  tokens: number;
  needs_chunking: boolean;
}

export interface CodeReviewResponse {
  language: string;
  issues: string[];
  suggestions: string[];
  issue_fixes?: IssueFix[];
  rating: string;
  assessment: string;
  static_analysis: {
    issues: string[];
    suggestions: string[];
    issue_fixes?: IssueFix[];
  };
  ai_analysis?: {
    issues: string[];
    suggestions: string[];
    rating: string;
    assessment: string;
    raw_review: string;
  };
  code_summary: CodeSummary;
}

export interface HealthResponse {
  status: string;
  ai_enabled: boolean;
  supported_languages: string[];
}

class CodeReviewAPI {
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    const response = await this.client.post<CodeReviewResponse>('/review', request);
    return response.data;
  }

  async healthCheck(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>('/health');
    return response.data;
  }
}

export const api = new CodeReviewAPI();
