import admin from "firebase-admin";

export const getUser = (req, res) => {
    const { userId } = req.params;
    const userRef = admin.firestore().collection('Users').doc(userId);
    
    try{
        userRef.get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                res.status(200).json(userData);
            }else {
                res.status(404).json({error: "User not found"});
            }
        })
        .catch((error) => {
            console.error('Error retrieving user: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

    } catch(error){
        console.error('Error retrieving user: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


