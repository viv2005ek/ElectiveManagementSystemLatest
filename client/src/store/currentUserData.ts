export type ElectiveHistoryEntry = {
  OEName: string;
  courseCode: string;
  status: "assigned" | "pending" | "rejected" | "cancelled";
  date: string;
};
export const currentUser = {
  name: "John Doe",
  registrationNo: "Btech742",
  mobileNo1: "+1234567890",
  mobileNo2: "+0987654321",
  courseName:"B.Tech",
  departmentName: "Computer Science",
  branchName: "CSE",
  semester: "6th",
  classCoordinator: true,
  profilePic: "./User.png",
  classCoordinatorName: "Dr. Jane Smith",
  mailId: "john.doe@example.com",
  OE:{OEName:"",courseCode:""}, //OE ->{OE Name:"Course name", Course Code: "Course Code"}
  changeOE:{OEName:"",courseCode:""},
  section: "A",
  batchNo: "2021",
  gender: "Male",
  password: "initialPassword",
  electiveHistory: []  as ElectiveHistoryEntry[], //status: assigned/pending/rejected//cancelled
};

export default currentUser;
