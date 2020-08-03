export class Person {
  constructor(data) {
    this.root = data.root || false;
    this.id = data.id;
    this.gender = data.gender;
    this.name = data.name;
    this.key = data.key;
    this.profilePic = data.profilePic;
    this.partner = data.partner;
    this.partnerId = data.partnerId;
    this.partnerProfilePic = data.partnerProfilePic;
    this.partnerGender = data.partnerGender;
    this.uniqueId = this.randomStr(20, "12345abcde");
  }
  randomStr(len, arr) {
    let ans = "";
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  }
}
