var express = require('express');
var router = express.Router();
const messageController = require('../Controller/message');


router.post('/send-message', messageController.sendMessage);
router.get('/get-all-messages/:userId', messageController.getAllMessages);
router.get('/get-all-conversations', messageController.getAllConversations);
router.post('/update-deleted-by', messageController.updateDeletedBy);
router.post('/delete-conversation-and-all-messages/:conversationId', messageController.deleteConversation);
router.get('/delete-message/:messageId', messageController.deleteMessage);


module.exports = router;