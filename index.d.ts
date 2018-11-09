import "egg";
import { EventEmitter } from 'events';

class Whistle extends EventEmitter {
  host: string;
  port: string;
  proxyUri: string;
  proxyAgent: any;
}

declare module "egg" {
  interface Application {
    whistle: Whistle;
  }

  interface EggAppConfig {
    whistle: {
      route: string;
      ignore: RegExp | RegExp[];
      [key: string]: any;
    }
  }
}
