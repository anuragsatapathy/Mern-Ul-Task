import User from "../../models/auth.model";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface JwtPayload {
  id: string;
  role: string;
}

const register = async (data: RegisterData) => {
  const { name, email, password, role } = data;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
    role: role || "user",
  });

  const userObj = user.toObject() as any;
  delete userObj.password;

  return userObj;
};

const login = async (data: LoginData) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

 const options: SignOptions = {
  expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as jwt.SignOptions["expiresIn"],
};


  const token = jwt.sign(
    { id: user._id.toString(), role: user.role } as JwtPayload,
    process.env.JWT_SECRET as string,
    options
  );

  const userObj = user.toObject() as any;
  delete userObj.password;

  return {
    user: userObj,
    token,
  };
};

export { register, login };
