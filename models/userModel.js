const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Appointment = require("./appointmentModel");

const userSchema = mongoose.Schema(
  {
    profilePicture: {
      type: String,
      default: `default${Math.floor(Math.random() * 4) + 1}.jpg`,
    },
    firstName: {
      type: String,
      required: [true, "Veuillez fournir votre prénom !"],
    },
    lastName: {
      type: String,
      required: [true, "Veuillez fournir votre nom de famille !"],
    },
    email: {
      type: String,
      required: [true, "Veuillez fournir votre email !"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail],
    },
    numTel: {
      type: String,
      required: [true, "Veuillez fournir votre numéro de téléphone !"],
      unique: true,
    },
    adresse: {
      type: String,
      required: [true, "Veuillez fournir votre adresse !"],
    },
    password: {
      type: String,
      required: [true, "Veuillez fournir votre mot de passe !"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Veuillez confirmer votre mot de passe !"],
      validate: function (el) {
        return this.password === el;
      },
      message: "Veuillez confirmer votre mot de passe",
    },
    role: {
      type: String,
      enum: [
        "Patient",
        "Sage femme",
        "Infirmière",
        "Medecin",
        "Aide soignant",
        "Kinesitherapeute",
      ],
      default: "Patient",
    },
    dob: {
      type: Date,
      required: [true, "Veuillez fournir votre date de naissance !"],
    },
    gender: {
      type: String,
      enum: ["H", "F"],
      required: [true, "Veuillez fournir votre genre !"],
      default: "H",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    workingTime: {
      type: [
        {
          day: Number,
          start: Date,
          end: Date,
        },
      ],
    },
    appointments: [{ type: mongoose.Schema.ObjectId, ref: "Appointment" }],
    rating: [Number],
    passwordResetCode: { type: String, select: true },
    passwordResetExpires: { type: Date, select: true },
    accountStatus: {
      type: Boolean,
      default: false,
    },
    activeAccountToken: { type: String, select: true },
    activeAccountTokenExpires: { type: Date, select: true },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.index({ location: "2dsphere" });

//--------------- MIDDLEWERE -----------------------
/// ta3mel error hathi
// userSchema.pre(/^find/, async function (next) {
//   this.find({ accountStatus: { $ne: false } });
//   next();
// });
// userSchema.pre("save", async function (next) {
//   setTimeout(async () => {
//     const user = await user.findById(this._id);
//     console.log("Function triggered after 60 second");
//     console.log(user.firstName);
//   }, [180000]);

//   console.log("Going to the next middleware !");

//   next();
// });

userSchema.virtual("ratingAverage").get(function () {
  if (Array.isArray(this.rating)) {
    const ratingSum = this.rating.reduce((a, b) => a + b, 0);
    return this.rating.length > 0 ? ratingSum / this.rating.length : 0;
  }
  return 0;
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

//----------- METHODS -----------
// 1 ) correctPassword
userSchema.methods.correctPassword = async function (userpassword, password) {
  console.log(userpassword, password);
  return await bcrypt.compare(userpassword, password);
};
// 2 ) changePasswordAfter

// userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
//   if (this.changedTimepassword) {
//     const changedTimepassword = parseInt(
//       this.modifypassword.getTime() / 1000,
//       10
//     );
//     return JWTTimeStamp < changedTimepassword;
//   }
//   //False means no change
//   return false;
// };
// 3 ) createPasswordResetCode
userSchema.methods.createPasswordResetCode = function () {
  const code = Math.floor(1000 + Math.random() * 9000);
  this.passwordResetCode = code.toString();
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  return code.toString();
};
// 4 ) Active user Token :
userSchema.methods.createActiveUserToken = function () {
  const Token = crypto.randomBytes(32).toString("hex");
  activeuserToken = crypto.createHash("sha256").update(Token).digest("hex");
  return activeuserToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
