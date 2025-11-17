import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  fullName: string;
  dateOfBirth: string;
  socialSecurityNumber: string;
  address: string;
  email: string;
  phoneNumber: string;
  password: string;
  idFrontPhoto?: string | null;
  idBackPhoto?: string | null;
  selfiePhoto?: string | null;
  compositePhoto?: string | null;
  verificationStatus?: 'pending' | 'verified' | 'failed';
  ipAddress?: string;
  supportMessages?: Array<{
    id: string;
    sender: 'user' | 'support';
    message: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Please provide a date of birth'],
    },
    socialSecurityNumber: {
      type: String,
      required: [true, 'Please provide a social security number'],
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    idFrontPhoto: {
      type: String,
      default: null,
    },
    idBackPhoto: {
      type: String,
      default: null,
    },
    selfiePhoto: {
      type: String,
      default: null,
    },
    compositePhoto: {
      type: String,
      default: null,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'failed'],
      default: 'pending',
    },
    ipAddress: {
      type: String,
      default: null,
    },
    supportMessages: {
      type: [
        {
          id: String,
          sender: {
            type: String,
            enum: ['user', 'support'],
          },
          message: String,
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Store password as cleartext (not encrypted)
userSchema.pre<IUser>('save', function (next) {
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return password === this.password;
};

// Clear any existing cached model
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>('User', userSchema);
