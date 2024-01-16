import { User } from "../models/User.js"

const UserList = async (req, res)=>{
    const users = await User.findAll();
    res.json(users);
}

const UserDelete = async (req, res)=>{
    const id = req.params.id;
    const users = await User.findAll({where:{id:id}});
    const user = users[0];
    await user.destroy();
    res.json({result:"deleted"});
}

const UserCreate = async (req, res) => {
    const validationErrors = validateUserData(req.body);
    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    const user = await User.create(req.body);
    res.json(user);
};

const UserUpdate = async (req, res) => {
    const validationErrors = validateUserData(req.body);
    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    const id = req.params.id;
    const users = await User.findAll({ where: { id: id } });
    const user = users[0];
    await user.update(req.body);
    await user.save();
    res.json(user);
};

const UserSelect = async (req, res)=>{
    const id = req.params.id;
    const users = await User.findAll({where:{id:id}});
    const user = users[0];
    res.json(user);
}

export { UserList, UserDelete, UserCreate, UserUpdate, UserSelect };