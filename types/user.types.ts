export interface UserProfile {
  id: string;
  userType: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  profilePicture?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
}
