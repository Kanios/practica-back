const axios = require('axios');

/**
 * Sube una imagen base64 como objeto JSON a IPFS vía Pinata
 */
const uploadToIPFS = async (base64) => {
  const data = {
    pinataMetadata: {
      name: 'firma-albaran'
    },
    pinataContent: {
      image: base64
    }
  };

  const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
      'Content-Type': 'application/json'
    }
  });

  const cid = res.data.IpfsHash;
  return `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${cid}`;
};

module.exports = { uploadToIPFS };