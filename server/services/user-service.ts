import { UserModel } from "../models/user-model";
import { User } from "../types";

class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async createUser(data: User): Promise<User> {
    return this.userModel.createUser(data);
  }

  async getUser(id: string): Promise<User | null> {
    return this.userModel.getUser(id);
  }
}

export default UserService;

