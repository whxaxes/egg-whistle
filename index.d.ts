import "egg";

declare module "egg" {
  interface Application {
    whistle?: {
      host: string;
      port: string;
      getProxyUri(protocol: string): string;
      getProxyAgent(protocol: string): any;
    };
  }
}
