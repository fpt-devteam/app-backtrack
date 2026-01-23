const avatarUrls = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/2.jpg",
  "https://randomuser.me/api/portraits/men/3.jpg",
  "https://randomuser.me/api/portraits/women/4.jpg",
  "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  "https://i.pravatar.cc/150?u=b04258a2462d826712d",
  "https://i.pravatar.cc/150?u=c04258a2462d826712d",
  "https://i.pravatar.cc/150?u=d04258a2462d826712d",
  "https://i.pravatar.cc/150?u=e04258a2462d826712d",
  "https://i.pravatar.cc/150?u=f04258a2462d826712d",
  "https://i.pravatar.cc/150?u=g04258a2462d826712d",
  "https://i.pravatar.cc/150?u=h04258a2462d826712d",
  "https://i.pravatar.cc/150?u=i04258a2462d826712d",
];

export const getRandomAvatarUrl = () => {
  const randomIndex = Math.floor(Math.random() * avatarUrls.length);
  return avatarUrls[randomIndex];
};