import { Response } from "@fastly/as-compute";

/**
 * AssemblyScript does not support join types yet, so here
 * is a join type that returns either a value or a response.
 * The response is generally meant for error handling.
 */
export class MaybeResponse<T> {
  private value: T | null;
  private response: Response | null;

  withValue(value: T): MaybeResponse<T> {
    this.value = value;
    return this;
  }

  withResponse(response: Response): MaybeResponse<T> {
    this.response = response;
    return this;
  }

  hasValue(): boolean {
    return this.value != null;
  }

  hasResponse(): boolean {
    return this.response != null;
  }

  getValue(): T {
    return <T>this.value;
  }

  getResponse(): Response {
    return <Response>this.response;
  }
}