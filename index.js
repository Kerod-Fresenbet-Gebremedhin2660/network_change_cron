import { execSync } from "child_process";

const getConstants = () => {
  const WIFI_4G_SSID = "GK";
  const WIFI_HOME_SSID = "HGW-7E29DC";
  const LOCAL_HOME_IP = "192.168.101.42";
  const LOCAL_HOME_GATEWAY = "192.168.101.1";
  const LOCAL_4G_SUBNET = "192.168.144";
  return {
    WIFI_4G_SSID,
    WIFI_HOME_SSID,
    LOCAL_HOME_IP,
    LOCAL_HOME_GATEWAY,
    LOCAL_4G_SUBNET,
  };
};
//
const getSSID = () => {
  const getSSIDCommand = `/System/Library/PrivateFrameworks/Apple80211.framework/Resources/airport -I  | awk -F' SSID: '  '/ SSID: / {print $2}'`;
  const result = execSync(getSSIDCommand);
  if (Buffer.isBuffer(result)) {
    const resultStr = result.toString().trim();
    return resultStr;
  } else {
    throw new Error("ssid not found");
  }
};
//
const getLocalIP = () => {
  const getLocalIPCommand = `ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'`;
  const result = execSync(getLocalIPCommand);
  if (Buffer.isBuffer(result)) {
    const resultStr = result.toString().trim();
    return resultStr;
  } else {
    throw new Error("local ip not found");
  }
};
//
const setDHCPIP = () => {
  const setDHCPIPCommand = `sudo networksetup -setdhcp "Wi-Fi"`;
  const result = execSync(setDHCPIPCommand);
  if (Buffer.isBuffer(result)) {
    return true;
  } else {
    throw new Error("failed to set dhcp");
  }
};
//
const setManualIP = () => {
  const setManualNetCommand = `sudo networksetup -setmanual "Wi-Fi" ${
    getConstants().LOCAL_HOME_IP
  } 255.255.255.0 ${getConstants().LOCAL_HOME_GATEWAY}`;
  const resultSetManualCommand = execSync(setManualNetCommand);
  if (Buffer.isBuffer(resultSetManualCommand)) {
    return true;
  } else {
    throw new Error("failed to set manual ip");
  }
};
//
const main = () => {
  try {
    const ssid = getSSID();
    switch (ssid) {
      case getConstants().WIFI_4G_SSID:
        const ip4G = getLocalIP();
        if (ip4G.includes(getConstants().LOCAL_4G_SUBNET)) {
          return true;
        } else {
          setDHCPIP();
        }
        break;
      case getConstants().WIFI_HOME_SSID:
        const ipWifi = getLocalIP();
        if (ipWifi === getConstants().LOCAL_HOME_IP) {
          return true;
        } else {
          setManualIP();
        }
        break;
      default:
        console.error("This is another network");
        return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

main();
