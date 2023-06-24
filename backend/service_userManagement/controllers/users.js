import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";


let users = [];

export const getUsers = async (req, res) => {
    try {
        const db = admin.firestore();
        const userRef = db.collection("Users");
        const querySnapshot = await userRef.get();

        querySnapshot.forEach((user) =>{
            users.push(user.data());
        });

        res.json(users);

    } catch(error){
        console.error('Error retrieving users: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    res.send(users);
}

export const getUser = (req, res) => {
    const { userId } = req.params;
    const foundUser =  users.find((user) => user.id === userId);
    res.send(foundUser);
}

export const createUser = (req, res) => {
    const user = req.body;
    const userWithId = {...user, id: uuidv4() };
    users.push(userWithId);
    res.send(`User with the name ${user.name} added to the DB`);
}

export const updateUser = (req, res) => {
    const { userId } = req.params;
    const {name, lastname, age } = req.body;
    const user = users.find((user) => user.id == userId);

    if(name) user.name = name;
    if(lastname) user.lastname = lastname;
    if(age) user.age = age;    

    res.send(`User with the id ${id} has been updated`);

}

export const deleteUser = (req, res) => {
    const { userId } = req.params;
    users = users.filter((user) => user.id != userId);
    res.send(`User with the id ${userId} deleted from the database`);
}

export const getFriends = (req, res) =>{
    res.send("List of friends!");
}

export const getFriend = (req, res) => {
    const { requestId } = req.params 
    res.send(`specified friend id ${requestId}`);
}

export const sendFriendRequest = (req, res) => {
    const {requestId} = req.params;
    res.status(200).json({ message: `Friend request sent successfully to user with id ${requestId}` });
}

export const removeFriend = (req, res) =>{
    const {requestId} = req.params;
    res.status(200).json({ message: `Friend with id ${requestId} removed`});
}

export const acceptFriendRequest = (req, res) =>{
    const {requestId} = req.params;

    res.status(200).json({ message:`Friend with ${requestId} accepted`});
}

export const rejectFriendRequest = (req, res) =>{
    const {requestId} = req.params;
    res.status(200).json({ message:`Friend with ${requestId} rejected`});
}
