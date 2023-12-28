const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const User = require("../models/user");
const {
  HttpError,
  ctrlWrapper,
  sendEmail,
} = require("../helpers");
const { SECRET_KEY, BASE_URL } = process.env;
const avatarDir = path.join(
  __dirname,
  "../",
  "public",
  "avatars"
);

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verification email",
    html: `<a target="_blank"  href='${BASE_URL}/users/verify/${verificationToken}' >Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(400, "Your email is not verified");
  }

  const passwordCompare = await bcrypt.compare(
    password,
    user.password
  );
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "12h",
  });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { id } = req.user;

  const user = await User.findByIdAndUpdate(id, {
    token: "",
  });
  if (!user) {
    throw HttpError(401);
  }

  res.status(204).json();
};

const getCurrent = async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};

const updateSubscriptionUser = async (req, res) => {
  const { id } = req.user;
  const { subscription } = req.body;

  const updatedSubscriptionUser =
    await User.findByIdAndUpdate(
      id,
      { subscription },
      { new: true }
    );
  if (!updateSubscriptionUser) {
    throw HttpError(404, "Not found");
  }

  res.json({
    email: updatedSubscriptionUser.email,
    subscription: updatedSubscriptionUser.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${id}_${originalname}`;
  const resultUpdate = path.join(avatarDir, filename);
  await fs.rename(tempUpload, resultUpdate);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(id, { avatarURL });

  res.json({ avatarURL });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user.id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (user.verify) {
    throw HttpError(
      400,
      "Verification has already been passed"
    );
  }

  const verifyEmail = {
    to: email,
    subject: "Verification email",
    html: `<a target="_blank"  href='${BASE_URL}/users/verify/${user.verificationToken}' >Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscriptionUser: ctrlWrapper(
    updateSubscriptionUser
  ),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
