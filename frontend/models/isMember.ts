const isUserMemberOfChannel = (user, channel) => {
    return channel.memberships.some((membership) => membership.member.id === user.id);
  };