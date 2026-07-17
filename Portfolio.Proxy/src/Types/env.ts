declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
      API_USERNAME: string;
      API_PASSWORD: string;
      API_PHRASE: string;
      SESSION_SECRET: string;
      CLIENT_ORIGIN: string;
      PORT: number;
      MEDIA_PATH: string;
      MEDIA_DOMAIN: string;
      MEDIA_SITE_PATH: string;
    }
  }
};

export {};