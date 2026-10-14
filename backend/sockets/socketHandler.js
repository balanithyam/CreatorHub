export const initSockets = (io) => {
  io.on('connection', (socket) => {
    socket.on('join_content', (contentId) => {
      socket.join('content_' + contentId);
    });

    socket.on('leave_content', (contentId) => {
      socket.leave('content_' + contentId);
    });

    socket.on('join_user', (userId) => {
      socket.join('user_' + userId);
    });

    socket.on('send_comment', (data) => {
      io.to('content_' + data.contentId).emit('new_comment', data);
    });

    socket.on('update_comment_status', (data) => {
      io.to('content_' + data.contentId).emit('comment_status_updated', data);
    });

    socket.on('user_typing_review', (data) => {
      socket.to('content_' + data.contentId).emit('reviewer_typing', data);
    });
  });
};
