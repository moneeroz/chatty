const formatTime = (date: string) => {
  if (!date) return;

  const now = new Date();
  const s = Math.abs(now.getTime() - new Date(date).getTime()) / 1000;

  // Seconds
  if (s < 60) {
    return "now";
  }

  // Minutes
  if (s < 3600) {
    return `${Math.floor(s / 60)}m ago`;
  }

  // Hours
  if (s < 86400) {
    return `${Math.floor(s / 3600)}h ago`;
  }

  // Days
  if (s < 604800) {
    return `${Math.floor(s / 86400)}d ago`;
  }
  // Weeks
  if (s < 2592000) {
    return `${Math.floor(s / 604800)}w ago`;
  }

  // Months
  if (s < 31536000) {
    return `${Math.floor(s / 2592000)}mo ago`;
  }

  return "*";
};

export default formatTime;
