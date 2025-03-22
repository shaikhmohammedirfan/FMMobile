export class member_mst {
  member_id: string;
  member_name: string;
  mobile_no: string;
  email: string;
  mobile_verified: boolean;
  email_verified: boolean;
  curr_gymid: string;
  account_status: string;

  constructor(
    member_id: string,
    member_name: string,
    mobile_no: string,
    email: string,
    mobile_verified: boolean,
    email_verified: boolean,
    curr_gymid: string,
    account_status: string
  ) {
    this.member_id = member_id;
    this.member_name = member_name;
    this.mobile_no = mobile_no;
    this.email = email;
    this.mobile_verified = mobile_verified;
    this.email_verified = email_verified;
    this.curr_gymid = curr_gymid;
    this.account_status = account_status;
  }
}
