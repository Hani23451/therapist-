const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const RtcGenerateToken = async (channelName, uid, roleName) => {
  let role;
  if (roleName === "publisher") {
    role = RtcRole.PUBLISHER;
  } else if (roleName === "audience") {
    role = RtcRole.SUBSCRIBER;
  }
  const expireTime = 3600;
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  const token = RtcTokenBuilder.buildTokenWithUid(
    "440b48a613cb4ad0987da77b5193b3fa",
    "7a545301de594414a10fdc0ea627c4cf",
    channelName,
    uid,
    role,
    privilegeExpireTime
  );
  return token;
};
module.exports = RtcGenerateToken;
