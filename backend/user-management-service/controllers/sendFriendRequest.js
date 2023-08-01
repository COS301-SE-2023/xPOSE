import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';
import MessageBuilder from './messagebuilder.js';

export const sendFriendRequest = async (req, res) => {
    try {
      const { userId, requestId } = req.params;
      const {username} = req.body;

      // send friemd request
      await Friend_request.create({
        friend_a_id: userId,
        friend_b_id: requestId,
        response: "pending"
      });

    
      // Communicate with the notification service
      const queueName = 'notifications';
      const message = new MessageBuilder()
                .setType("friend_request")
                .setMessage(`Friend request from ${username}`)
                .setSenderId(userId)
                .setReceiverId(requestId)
                .build();
        sendMessageToQueue(queueName, message);
        
      // finallly message feedback
      res.status(200).json({ message: `Friend request sent successfully to user with id ${requestId}` });
    } catch (error) {
      console.error('Error sending friend request:', error);
      res.status(500).json({ error: 'An error occurred while sending friend request' });
    }
  };
  







