export class customerProfileInterface {
  customer_id: string;
  customer_name: string;
  reg_mobileno: string;
  reg_email: string;
  customer_panno: string;
  mobile_verified: string;
  curr_gymid: string;
  account_status: string;
  shortname: string;
  bill_addr_area_street: string;
  bill_addr_landmark: string;
  bill_addr_city_dist: string;
  bill_addr_state: string;
  bill_addr_pincode: string;
  bill_addr_country: string;
  del_addr_type: string;
  del_addr_area_street: string;
  del_addr_landmark: string;
  del_addr_city_dist: string;
  del_addr_state: string;
  del_addr_pincode: string;
  del_addr_country;
  constructor(
    customer_id: string,
    customer_name: string,
    reg_mobileno: string,
    reg_email: string,
    customer_panno: string,
    mobile_verified: string,
    curr_gymid: string,
    account_status: string,
    shortname: string,
    bill_addr_area_street: string,
    bill_addr_landmark: string,
    bill_addr_city_dist: string,
    bill_addr_state: string,
    bill_addr_pincode: string,
    bill_addr_country: string,
    del_addr_type: string,
    del_addr_area_street: string,
    del_addr_landmark: string,
    del_addr_city_dist: string,
    del_addr_state: string,
    del_addr_pincode: string,
    del_addr_country: string
  ) {
    this.customer_id = customer_id;
    this.customer_name = customer_name;
    this.reg_mobileno = reg_mobileno;
    this.reg_email = reg_email;
    this.customer_panno = customer_panno;
    this.mobile_verified = mobile_verified;
    this.curr_gymid = curr_gymid;
    this.account_status = account_status;
    this.shortname = shortname;
    this.bill_addr_area_street = bill_addr_area_street;
    this.bill_addr_landmark = bill_addr_landmark;
    this.bill_addr_city_dist = bill_addr_city_dist;
    this.bill_addr_state = bill_addr_state;
    this.bill_addr_pincode = bill_addr_pincode;
    this.bill_addr_country = bill_addr_country;
    this.del_addr_type = del_addr_type;
    this.del_addr_area_street = del_addr_area_street;
    this.del_addr_landmark = del_addr_landmark;
    this.del_addr_city_dist = del_addr_city_dist;
    this.del_addr_state = del_addr_state;
    this.del_addr_pincode = del_addr_pincode;
    this.del_addr_country = del_addr_country;
  }
}
