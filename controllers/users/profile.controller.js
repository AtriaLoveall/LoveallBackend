import { User } from '../../models/association.js';

const getPersonalInfo = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { user_id: req.user.id },
      attributes: ['first_name', 'last_name', 'email', 'phone_number', 'date_of_birth', 'address']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error('Error fetching personal info', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updatePersonalInfo = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, date_of_birth, address } = req.body;

    const [updatedRows] = await User.update(
      { first_name, last_name, email, phone_number, date_of_birth, address },
      { where: { user_id: req.user.id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    return res.status(200).json({ message: 'Personal information updated successfully' });

  } catch (error) {
    console.error('Error updating personal info', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export { getPersonalInfo, updatePersonalInfo };