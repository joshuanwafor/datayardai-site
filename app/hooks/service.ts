// API service endpoints for DataYard AI trading analyzer

const API_BASE_URL = 'https://api.datayardai.com/v1';

// Types for API responses
export interface AnalyzerInfo {
  status: 'running' | 'paused';
  is_paused: boolean;
  analyzer_running: boolean;
  streamers_count: number;
}

export interface AnalyzersStatus {
  [key: string]: AnalyzerInfo;
}

export interface AnalyzerStatusResponse {
  analyzers: AnalyzersStatus;
}

export interface AnalyzerControlResponse {
  message: string;
  status_info: {
    analyzers: AnalyzersStatus;
  };
}

/**
 * Get the current status of all analyzers
 */
export async function getAnalyzerStatus(): Promise<AnalyzerStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/trading/analyzer/status`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching analyzer status:', error);
    throw error;
  }
}

/**
 * Pause all analyzers
 */
export async function pauseAnalyzer(): Promise<AnalyzerControlResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/trading/analyzer/pause`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: '',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error pausing analyzer:', error);
    throw error;
  }
}

/**
 * Resume all analyzers
 */
export async function resumeAnalyzer(): Promise<AnalyzerControlResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/trading/analyzer/resume`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: '',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error resuming analyzer:', error);
    throw error;
  }
}