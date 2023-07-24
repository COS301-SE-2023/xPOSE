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
}



