import User from '../models/user';

// READ
export const getUsers = async (req, res) => {
    try{
       const { id } = req.params;
       const user = await User.findById(id);
       res.status(200).json(user);
    }
    catch(err){
        res.status(404).json({error: err.message});
    }
}

export const getUserFriends = async (req, res) => {
try{
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
        user.friends.map ((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath }
        }
    );
    res.status(200).json(formattedFriends);
}
catch(err){
    res.status(404).json({error: err.message});
}
}

// UPDATE
export const addRemoveFriend = async (req, res) => {
try{
const { id, friendId } = req.params;
const user = await User.findById(id);
const friend = await User.findById(friendId);

if(user.friends.includes(friendId)){
    // remove friend from user's friends list
    user.friends = user.friends.filter((id) => id !== friendId);
    // remove user from friend's friends list
    friend.friends = friend.friends.filter((id) => id !== id);
    // add friend to user's friends list and to own
    user.friends.push(friendId);
    friend.friends.push(id);
}
await user.save();
await friend.save();

const friends = await Promise.all(
    user.friends.map ((id) => User.findById(id))
);
const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
    }
);
res.status(200).json(formattedFriends);

}
catch (err){
    res.status(404).json({error: err.message});
}
}