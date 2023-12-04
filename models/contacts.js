const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(
  __dirname,
  "./contacts.json"
);

const listContacts = async () => {
  const contactsList = await fs.readFile(contactsPath);
  return JSON.parse(contactsList);
};

const getContactById = async (contactId) => {
  const contactsList = await listContacts();

  const finedContact = contactsList.find(
    ({ id }) => id === contactId
  );

  return finedContact || null;
};

const removeContact = async (contactId) => {
  const contactsList = await listContacts();
  const finedIndexContact = contactsList.findIndex(
    ({ id }) => id === contactId
  );

  if (finedIndexContact === -1) return null;
  const [removedContact] = contactsList.splice(
    finedIndexContact,
    1
  );

  await fs.writeFile(
    contactsPath,
    JSON.stringify(contactsList, null, 2)
  );

  return removedContact;
};

const addContact = async (body) => {
  const contactsList = await listContacts();
  const newContact = { id: nanoid(), ...body };

  contactsList.push(newContact);
  await fs.writeFile(
    contactsPath,
    JSON.stringify(contactsList, null, 2)
  );

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contactsList = await listContacts();
  const finedIndexContact = contactsList.findIndex(
    ({ id }) => id === contactId
  );

  if (finedIndexContact === -1) return null;
  const updatedContact = {
    id: contactId,
    ...body,
  };
  await fs.writeFile(
    contactsPath,
    JSON.stringify(contactsList, null, 2)
  );

  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
