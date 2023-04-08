import { Registry, AccountArgs } from "./registry";

type Config = {
  provider: string;
  registry?: string;
};

export class TokenBoundRequest {
  registry: Registry;
  constructor(private readonly args: AccountArgs) {
    this.registry = new Registry(this.args);
  }
}
