const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });

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

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscriptionUser: ctrlWrapper(
    updateSubscriptionUser
  ),
};
