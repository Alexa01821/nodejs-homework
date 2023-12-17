const Contact = require("../models/contact");

const { HttpError, ctrlWrapper } = require("../helpers");

const getContactsList = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = "" } = req.query;

  const skip = (page - 1) * limit;

  const result = (await (favorite === ""))
    ? await Contact.find({ owner })
        .skip(skip)
        .limit(limit)
        .populate("owner", "email")
    : await Contact.find({ owner, favorite })
        .skip(skip)
        .limit(limit)
        .populate("owner", "email");

  res.json(result);
};

const getContactById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;

  const contact = await Contact.findById(contactId)
    .where("owner")
    .equals(owner)
    .populate("owner", "email");
  if (!contact) {
    throw HttpError(404, "Not found");
  }

  res.json(contact);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { name, email, phone } = req.body;

  const createdContact = await Contact.create({
    name,
    email,
    phone,
    owner,
  });
  res.status(201).json(createdContact);
};

const removeContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;

  const removedContact = await Contact.findByIdAndDelete(
    contactId
  )
    .where("owner")
    .equals(owner)
    .populate("owner", "email");
  if (!removedContact) {
    throw HttpError(404, "Not found");
  }

  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const { name, email, phone, favorite } = req.body;

  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { name, email, phone, favorite },
    { new: true }
  )
    .where("owner")
    .equals(owner)
    .populate("owner", "email");
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }

  res.json(updatedContact);
};

const updateContactFavorite = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const { favorite } = req.body;

  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  )
    .where("owner")
    .equals(owner)
    .populate("owner", "email");
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }

  res.json(updatedContact);
};

module.exports = {
  getContactsList: ctrlWrapper(getContactsList),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateContactFavorite: ctrlWrapper(updateContactFavorite),
};
