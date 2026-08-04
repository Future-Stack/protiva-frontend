export interface AppVersionConfig {
  id: string;
  appConfigKey: string;
  androidLatestVersion: string;
  androidMinRequiredVersion: string;
  androidForceUpdate: boolean;
  iosLatestVersion: string;
  iosMinRequiredVersion: string;
  iosForceUpdate: boolean;
  androidStoreUrl: string;
  iosStoreUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppVersionConfigResponse {
  data: {
    success: boolean;
    data: AppVersionConfig;
  };
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface UpdateAppVersionConfigPayload {
  androidLatestVersion: string;
  androidMinRequiredVersion: string;
  androidForceUpdate: boolean;
  iosLatestVersion: string;
  iosMinRequiredVersion: string;
  iosForceUpdate: boolean;
  androidStoreUrl: string;
  iosStoreUrl: string;
}
