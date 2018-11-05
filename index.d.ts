import "egg";

declare module "egg" {
  interface Application {
    whistle?: {
      host: string;
      port: string;
      proxyUri: string;
      proxyAgent: any;
    };
  }
}
