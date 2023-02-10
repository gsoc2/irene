export class NfNsreqstd1Context {
  namespace_id: number;
  namespace_created_on: string;
  namespace_value: string;
  platform: string;
  platform_display: string;
  requester_username: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(input_json: any) {
    this.namespace_id = input_json.namespace_id;
    this.namespace_created_on = input_json.namespace_created_on;
    this.namespace_value = input_json.namespace_value;
    this.platform = input_json.platform;
    this.platform_display = input_json.platform_display;
    this.requester_username = input_json.requester_username;
  }
}