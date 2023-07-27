import admin from "firebase-admin";

export const getUser = (req, res) => {
    const { userId } = req.params;
    const {requestId} = req.query; 
    try{
        
        // Check if there is a friendship entry between both users
        const friendship = await Friendship.findOne({
            where: {
                $or: [
                    { friend_a_id: userId, friend_b_id: requestId },
                    { friend_a_id: requestId, friend_b_id: userId },
                ],
            },
        });
        
        let areFriends = false;

        if (friendship) {
          areFriends: true;
        }

        const userRef = admin.firestore().collection('Users').doc(userId);

        userRef.get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                res.status(200).json({...userData, areFriends});
            }else {
                res.status(404).json({error: "User not found"});
            }
        })
        .catch((error) => {
            console.error('Error retrieving user: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

    } catch(error) {
        console.error('Error retrieving user: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


